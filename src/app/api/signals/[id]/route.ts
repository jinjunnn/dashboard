/**
 * 单个信号查询 API 路由
 */

import { Client } from 'pg';
import { NextRequest, NextResponse } from 'next/server';

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
 * 辅助函数：转换新的level为旧的category  
 */
function convertLevelToCategory(level: "intraday" | "1D"): "intraday" | "daily" {
  return level === "1D" ? "daily" : "intraday";
}

/**
 * 辅助函数：为Signal添加向后兼容的属性
 */
function addBackwardCompatibility(signal: any) {
  return {
    ...signal,
    category: convertLevelToCategory(signal.level),
  };
}

/**
 * GET /api/signals/[id] - 根据ID获取单个信号
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  let client: Client | null = null;
  
  try {
    const { id } = params;

    client = await createPgClient();

    const query = `
      SELECT 
        s.*,
        st.name as stock_name,
        st.market as stock_market,
        st.meta_data as stock_meta_data
      FROM signals s
      LEFT JOIN stock st ON s.symbol = st.symbol
      WHERE s.id = $1
    `;

    const result = await client.query(query, [id]);

    if (result.rows.length === 0) {
      return NextResponse.json({
        success: false,
        error: '信号未找到'
      }, { status: 404 });
    }

    const row = result.rows[0];
    const signal = {
      ...row,
      stock: row.stock_name ? {
        name: row.stock_name,
        market: row.stock_market,
        meta_data: row.stock_meta_data
      } : undefined
    };

    // 清理连表字段
    delete signal.stock_name;
    delete signal.stock_market;
    delete signal.stock_meta_data;

    return NextResponse.json({
      success: true,
      data: addBackwardCompatibility(signal)
    });
    
  } catch (error) {
    console.error("API getSignalById 执行失败:", error);
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