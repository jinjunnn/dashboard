/**
 * 信号统计数据 API 路由
 */

import { Client } from 'pg';
import { NextRequest, NextResponse } from 'next/server';
import { getSignalsByCategory } from "@/config/signals-config";

// PostgreSQL 连接配置
const PG_CONNECTION = 'postgresql://postgrest:qadkaq-zegxyc-Xeqme3@192.168.18.10:54322/postgres';

/**
 * 创建 PostgreSQL 客户端
 */
async function createPgClient(): Promise<Client> {
  const client = new Client({ connectionString: PG_CONNECTION });
  await client.connect();
  return client;
}

/**
 * 辅助函数：转换旧的category为新的level
 */
function convertCategoryToLevel(category: "intraday" | "daily"): "intraday" | "1D" {
  return category === "daily" ? "1D" : "intraday";
}

/**
 * GET /api/signals/stats - 获取信号统计数据
 */
export async function GET(request: NextRequest) {
  let client: Client | null = null;
  
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category') as "intraday" | "daily" || "intraday";
    
    const level = convertCategoryToLevel(category);
    
    // 获取配置中启用的信号类型
    const availableSignals = getSignalsByCategory(category).filter((signal) => signal.enabled);

    if (availableSignals.length === 0) {
      return NextResponse.json({
        success: true,
        data: []
      });
    }

    const validSignalTypes = availableSignals.map((signal) => signal.name);
    client = await createPgClient();

    // 查询统计数据
    const query = `
      SELECT signal_type, direction, status, COUNT(*) as count
      FROM signals 
      WHERE level = $1 AND signal_type = ANY($2)
      GROUP BY signal_type, direction, status
    `;

    const result = await client.query(query, [level, validSignalTypes]);

    // 计算统计信息
    const statsMap = new Map();

    // 初始化统计数据
    availableSignals.forEach((signal) => {
      statsMap.set(signal.name, {
        ...signal,
        count: 0,
        activeCount: 0,
        bullishCount: 0,
        bearishCount: 0,
      });
    });

    // 统计数据
    result.rows.forEach((row) => {
      const stats = statsMap.get(row.signal_type);
      if (stats) {
        const count = parseInt(row.count);
        stats.count += count;
        
        if (row.status === "active") {
          stats.activeCount += count;
        }
        if (row.direction === 1) {
          stats.bullishCount += count;
        } else if (row.direction === -1) {
          stats.bearishCount += count;
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: Array.from(statsMap.values())
    });
    
  } catch (error) {
    console.error("API getSignalStats 执行失败:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 });
  } finally {
    if (client) {
      await client.end();
    }
  }
}