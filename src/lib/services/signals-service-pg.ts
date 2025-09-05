/**
 * 基于 PostgreSQL 直连的信号查询服务
 * 替代有问题的 Supabase REST API
 */

import { Client } from 'pg';
import { getSignalsByCategory, getSignalByName, getSignalConfigById, type SignalConfig } from "@/config/signals-config";

// PostgreSQL 连接配置
const PG_CONNECTION = 'postgresql://postgrest:qadkaq-zegxyc-Xeqme3@192.168.18.10:54322/postgres';

// 信号数据接口
export interface Signal {
  id: string; // UUID
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
  
  // 向后兼容属性
  category?: "intraday" | "daily";
  
  // 连表查询的股票信息
  stock?: {
    name: string;
    market: string;
    meta_data: Record<string, unknown>;
  };
}

// 信号统计接口
export interface SignalStats extends SignalConfig {
  count: number;
  activeCount: number;
  bullishCount: number;
  bearishCount: number;
}

// 查询选项接口
export interface SignalQueryOptions {
  level: "intraday" | "1D";
  signalName?: string;
  direction?: 1 | -1;
  symbol?: string;
  limit?: number;
  offset?: number;
  
  // 向后兼容的属性
  category?: "intraday" | "daily";
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
 * 创建 PostgreSQL 客户端
 */
async function createPgClient(): Promise<Client> {
  const client = new Client({ connectionString: PG_CONNECTION });
  await client.connect();
  return client;
}

/**
 * 获取交易信号列表（基于 PostgreSQL 直连）
 */
export async function getSignals(options: SignalQueryOptions): Promise<Signal[]> {
  let client: Client | null = null;
  
  try {
    // 处理向后兼容性：如果传入category则转换为level
    const level = options.level || (options.category ? convertCategoryToLevel(options.category) : "intraday");
    const category = convertLevelToCategory(level);
    
    // 获取配置中启用的信号类型
    const availableSignals = getSignalsByCategory(category);
    const validSignalTypes = availableSignals.filter((signal) => signal.enabled).map((signal) => signal.name);

    if (validSignalTypes.length === 0) {
      console.warn(`分类 ${category} 没有启用的信号类型`);
      return [];
    }

    client = await createPgClient();
    
    // 构建查询条件
    let whereConditions = ['s.level = $1', 's.status = $2'];
    let params: any[] = [level, 'active'];
    let paramIndex = 3;

    // 信号类型筛选
    whereConditions.push(`s.signal_type = ANY($${paramIndex})`);
    params.push(validSignalTypes);
    paramIndex++;

    // 信号名称筛选
    if (options.signalName) {
      const signalConfig = getSignalByName(options.signalName);
      if (!signalConfig || !signalConfig.enabled) {
        throw new Error(`信号类型 ${options.signalName} 不存在或已禁用`);
      }
      whereConditions.push(`s.signal_type = $${paramIndex}`);
      params.push(options.signalName);
      paramIndex++;
    }

    // 方向筛选
    if (options.direction !== undefined) {
      whereConditions.push(`s.direction = $${paramIndex}`);
      params.push(options.direction);
      paramIndex++;
    }

    // 股票代码筛选
    if (options.symbol) {
      whereConditions.push(`s.symbol = $${paramIndex}`);
      params.push(options.symbol);
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
      ${options.limit ? `LIMIT ${options.limit}` : 'LIMIT 50'}
      ${options.offset ? `OFFSET ${options.offset}` : ''}
    `;

    console.log('执行SQL查询:', query);
    console.log('参数:', params);

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

    console.log(`查询成功，返回 ${signals.length} 条记录`);
    return signals;

  } catch (error) {
    console.error("getSignals 执行失败:", error);
    throw error;
  } finally {
    if (client) {
      await client.end();
    }
  }
}

/**
 * 根据配置ID获取信号列表
 */
export async function getSignalsByConfigId(configId: string): Promise<Signal[]> {
  const signalConfig = getSignalConfigById(configId);
  if (!signalConfig) {
    throw new Error(`信号配置 ${configId} 不存在`);
  }

  return getSignals({
    level: signalConfig.category === 'daily' ? '1D' : 'intraday',
    signalName: signalConfig.name,
  });
}

/**
 * 获取信号统计数据
 */
export async function getSignalStats(category: "intraday" | "daily"): Promise<SignalStats[]> {
  let client: Client | null = null;
  
  try {
    const level = convertCategoryToLevel(category);
    
    // 获取配置中启用的信号类型
    const availableSignals = getSignalsByCategory(category).filter((signal) => signal.enabled);

    if (availableSignals.length === 0) {
      return [];
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
    const statsMap = new Map<string, SignalStats>();

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

    return Array.from(statsMap.values());
    
  } catch (error) {
    console.error("getSignalStats 执行失败:", error);
    throw error;
  } finally {
    if (client) {
      await client.end();
    }
  }
}

/**
 * 根据ID获取单个信号
 */
export async function getSignalById(id: string): Promise<Signal | null> {
  let client: Client | null = null;
  
  try {
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
      return null;
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

    return addBackwardCompatibility(signal);
    
  } catch (error) {
    console.error("getSignalById 执行失败:", error);
    throw error;
  } finally {
    if (client) {
      await client.end();
    }
  }
}

/**
 * 搜索信号
 */
export async function searchSignals(searchTerm: string, category?: "intraday" | "daily"): Promise<Signal[]> {
  let client: Client | null = null;
  
  try {
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

    return signals;
    
  } catch (error) {
    console.error("searchSignals 执行失败:", error);
    throw error;
  } finally {
    if (client) {
      await client.end();
    }
  }
}