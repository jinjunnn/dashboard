/**
 * 信号搜索 API 路由
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
 * 辅助函数：转换旧的category为新的level
 */
function convertCategoryToLevel(category: "intraday" | "daily"): "intraday" | "1D" {
  return category === "daily" ? "1D" : "intraday";
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
 * GET /api/signals/search - 搜索信号
 */
export async function GET(request: NextRequest) {
  let client: Client | null = null;
  
  try {
    const searchParams = request.nextUrl.searchParams;
    const searchTerm = searchParams.get('q');
    const category = searchParams.get('category') as "intraday" | "daily" | null;

    if (!searchTerm) {
      return NextResponse.json({
        success: false,
        error: '搜索关键词不能为空'
      }, { status: 400 });
    }

    client = await createPgClient();

    let whereConditions = ['s.status = $1'];
    let params: any[] = ['active'];
    let paramIndex = 2;

    // 添加分类过滤器
    if (category) {
      const level = convertCategoryToLevel(category);
      whereConditions.push(`s.level = $${paramIndex}`);
      params.push(level);
      paramIndex++;
    }

    // 搜索条件：UUID、股票代码或信号类型
    whereConditions.push(`(s.id::text ILIKE $${paramIndex} OR s.symbol ILIKE $${paramIndex} OR s.signal_type ILIKE $${paramIndex})`);
    params.push(`%${searchTerm}%`);

    const query = `
      SELECT 
        s.*,
        st.name as stock_name,
        st.market as stock_market,
        st.meta_data as stock_meta_data
      FROM signals s
      LEFT JOIN stock st ON s.symbol = st.symbol
      WHERE ${whereConditions.join(' AND ')}
      ORDER BY s.created_at DESC 
      LIMIT 20
    `;

    const result = await client.query(query, params);

    const signals = result.rows.map(row => {
      const signal = {
        ...row,
        stock: row.stock_name ? {
          name: row.stock_name,
          market: row.stock_market,
          meta_data: row.stock_meta_data
        } : undefined
      };
      
      delete signal.stock_name;
      delete signal.stock_market;
      delete signal.stock_meta_data;
      
      return addBackwardCompatibility(signal);
    });

    return NextResponse.json({
      success: true,
      data: signals,
      total: signals.length
    });
    
  } catch (error) {
    console.error("API searchSignals 执行失败:", error);
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