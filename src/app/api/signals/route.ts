/**
 * 信号数据查询 API 路由
 * 提供服务端访问 PostgreSQL 的接口
 */

import { Client } from 'pg';
import { NextRequest, NextResponse } from 'next/server';

// PostgreSQL 连接配置
const PG_CONNECTION = 'postgresql://postgrest:qadkaq-zegxyc-Xeqme3@192.168.18.10:54322/postgres';

// 信号数据接口
export interface Signal {
  id: string;
  symbol: string;
  signal_type: string;
  time_key: string;
  level: "intraday" | "1D";
  created_at?: string;
  expires_at?: string;
  direction: 1 | -1;
  confidence?: number;
  score?: number;
  strength?: number;
  status?: string;
  risk_level?: string;
  priority?: string;
  price?: number;
  zone?: any[];
  support_level?: number;
  resistance_level?: number;
  metadata?: Record<string, unknown>;
  target_price_action_id?: string;
  backtest?: Record<string, unknown>;
  strategy_type: string;
  entry_type: string;
  signal_source?: string;
  source_system?: string;
  parent_signal_id?: string;
  monitoring_context?: Record<string, unknown>;
  category?: "intraday" | "daily";
  
  // 连表查询的股票信息
  stock?: {
    name: string;
    market: string;
    meta_data: Record<string, unknown>;
  };
}

// 信号统计接口
export interface SignalStats {
  id: string;
  name: string;
  displayName: string;
  description: string;
  category: "intraday" | "daily";
  enabled: boolean;
  count: number;
  activeCount: number;
  bullishCount: number;
  bearishCount: number;
}

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
function addBackwardCompatibility(signal: any): Signal {
  return {
    ...signal,
    category: convertLevelToCategory(signal.level),
  };
}

/**
 * GET /api/signals - 获取信号列表
 */
export async function GET(request: NextRequest) {
  let client: Client | null = null;
  
  try {
    const searchParams = request.nextUrl.searchParams;
    const level = searchParams.get('level') as "intraday" | "1D" || 
                 (searchParams.get('category') ? 
                  convertCategoryToLevel(searchParams.get('category') as "intraday" | "daily") : 
                  "intraday");
    const signalName = searchParams.get('signalName');
    const direction = searchParams.get('direction');
    const symbol = searchParams.get('symbol');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    client = await createPgClient();
    
    // 构建查询条件
    let whereConditions = ['s.level = $1', 's.status = $2'];
    let params: any[] = [level, 'active'];
    let paramIndex = 3;

    // 信号名称筛选
    if (signalName) {
      whereConditions.push(`s.signal_type = $${paramIndex}`);
      params.push(signalName);
      paramIndex++;
    }

    // 方向筛选
    if (direction && (direction === '1' || direction === '-1')) {
      whereConditions.push(`s.direction = $${paramIndex}`);
      params.push(parseInt(direction));
      paramIndex++;
    }

    // 股票代码筛选
    if (symbol) {
      whereConditions.push(`s.symbol = $${paramIndex}`);
      params.push(symbol);
      paramIndex++;
    }

    // 构建完整查询
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
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    params.push(limit, offset);

    const result = await client.query(query, params);
    
    // 处理结果并添加向后兼容性
    const signals = result.rows.map(row => {
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
      
      return addBackwardCompatibility(signal);
    });

    return NextResponse.json({
      success: true,
      data: signals,
      total: signals.length
    });

  } catch (error) {
    console.error("API getSignals 执行失败:", error);
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