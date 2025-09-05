/**
 * 信号查询服务
 * 基于 signals-config.ts 配置进行数据查询
 */

import { getSignalsByCategory, getSignalByName, getSignalConfigById, type SignalConfig } from "@/config/signals-config";
import { getDatabaseClient } from "@/lib/database/factory";
import { SupabaseDatabaseAdapter } from "@/lib/database/adapters/supabase-adapter";

// 新的信号数据接口（匹配新数据库结构）
export interface Signal {
  id: string; // 改为 UUID
  symbol: string;
  signal_type: string;
  time_key: string; // 新增时间键
  level: "intraday" | "1D"; // 替代 category
  created_at?: string;
  expires_at?: string;
  direction: 1 | -1; // 改为数字：1=看涨，-1=看跌  
  confidence?: number;
  score?: number; // 新增评分
  strength?: number; // 新增强度
  status?: string;
  risk_level?: string; // 新增风险等级
  priority?: string; // 新增优先级
  price?: number;
  zone?: any[]; // 新增区域数组
  support_level?: number; // 新增支撑位
  resistance_level?: number; // 新增阻力位
  metadata?: Record<string, unknown>; // 改为 metadata
  target_price_action_id?: string; // 新增目标价格行动ID
  backtest?: Record<string, unknown>; // 改为通用对象
  strategy_type: string; // 新增策略类型
  entry_type: string; // 新增入场类型
  signal_source?: string; // 新增信号源
  source_system?: string; // 新增源系统
  parent_signal_id?: string; // 新增父信号ID
  monitoring_context?: Record<string, unknown>; // 新增监控上下文
  
  // 为了向后兼容，添加计算属性
  category?: "intraday" | "daily"; // 从 level 计算得出
  
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

// 查询选项接口（更新以匹配新数据库结构）
export interface SignalQueryOptions {
  level: "intraday" | "1D"; // 使用新的 level 字段
  signalName?: string;
  direction?: 1 | -1; // 使用数字方向
  symbol?: string;
  limit?: number;
  offset?: number;
  
  // 向后兼容的属性
  category?: "intraday" | "daily"; // 将自动转换为 level
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
 * 辅助函数：转换旧的方向字符串为新的数字
 */
function convertDirectionToNumber(direction: "long" | "short"): 1 | -1 {
  return direction === "long" ? 1 : -1;
}

/**
 * 辅助函数：转换新的数字方向为旧的字符串
 */
function convertNumberToDirection(direction: 1 | -1): "long" | "short" {
  return direction === 1 ? "long" : "short";
}

/**
 * 辅助函数：为Signal添加向后兼容的属性
 */
function addBackwardCompatibility(signal: Signal): Signal {
  return {
    ...signal,
    category: convertLevelToCategory(signal.level),
  };
}

/**
 * 构建基础查询
 */
function buildBaseQuery(supabase: any, options: SignalQueryOptions) {
  // 处理向后兼容性：如果传入category则转换为level
  const level = options.level || (options.category ? convertCategoryToLevel(options.category) : "intraday");
  const category = convertLevelToCategory(level);
  
  const availableSignals = getSignalsByCategory(category);
  const validSignalTypes = availableSignals.filter((signal) => signal.enabled).map((signal) => signal.name);

  if (validSignalTypes.length === 0) {
    return null;
  }

  return supabase
    .from("signals")
    .select(
      `
      *,
      stock:symbol (
        name,
        market,
        meta_data
      )
    `,
    )
    .eq("level", level) // 使用新的 level 字段
    .eq("status", "active")
    .in("signal_type", validSignalTypes);
}

/**
 * 应用查询过滤器
 */
function applyFilters(query: any, options: SignalQueryOptions) {
  let filteredQuery = query;

  // 信号名称筛选
  if (options.signalName) {
    const signalConfig = getSignalByName(options.signalName);
    if (!signalConfig || !signalConfig.enabled) {
      throw new Error(`信号类型 ${options.signalName} 不存在或已禁用`);
    }
    filteredQuery = filteredQuery.eq("signal_type", options.signalName);
  }

  // 方向筛选
  if (options.direction) {
    filteredQuery = filteredQuery.eq("direction", options.direction);
  }

  // 股票代码筛选
  if (options.symbol) {
    filteredQuery = filteredQuery.eq("symbol", options.symbol);
  }

  return filteredQuery;
}

/**
 * 应用分页
 */
function applyPagination(query: any, options: SignalQueryOptions) {
  let paginatedQuery = query;

  if (options.limit) {
    paginatedQuery = paginatedQuery.limit(options.limit);
  }

  if (options.offset) {
    const limit = options.limit || 50;
    paginatedQuery = paginatedQuery.range(options.offset, options.offset + limit - 1);
  }

  return paginatedQuery;
}

/**
 * 获取交易信号列表（基于配置）
 */
export async function getSignals(options: SignalQueryOptions): Promise<Signal[]> {
  try {
    const db = getDatabaseClient();
    const supabase = (db as SupabaseDatabaseAdapter).getClient();

    // 构建基础查询
    const baseQuery = buildBaseQuery(supabase, options);
    if (!baseQuery) {
      console.warn(`分类 ${options.category} 没有启用的信号类型`);
      return [];
    }

    // 应用过滤器
    const filteredQuery = applyFilters(baseQuery, options);

    // 应用分页和排序
    const finalQuery = applyPagination(filteredQuery, options).order("created_at", { ascending: false });

    const { data, error } = await finalQuery;

    if (error) {
      console.error("查询信号数据失败:", error);
      throw new Error(`查询失败: ${error.message}`);
    }

    // 添加向后兼容性属性
    const results = (data || []).map(addBackwardCompatibility);
    
    return results;
  } catch (error) {
    console.error("getSignals 执行失败:", error);
    throw error;
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
    category: signalConfig.category,
    signalName: signalConfig.name,
  });
}

/**
 * 获取信号统计数据
 */
export async function getSignalStats(category: "intraday" | "daily"): Promise<SignalStats[]> {
  try {
    const db = getDatabaseClient();
    const supabase = (db as SupabaseDatabaseAdapter).getClient();

    // 获取配置中启用的信号类型
    const availableSignals = getSignalsByCategory(category).filter((signal) => signal.enabled);

    if (availableSignals.length === 0) {
      return [];
    }

    const validSignalTypes = availableSignals.map((signal) => signal.name);

    // 查询统计数据（使用新的 level 字段）
    const level = convertCategoryToLevel(category);
    const { data, error } = await supabase
      .from("signals")
      .select("signal_type, direction, status")
      .eq("level", level)
      .in("signal_type", validSignalTypes);

    if (error) {
      console.error("查询统计数据失败:", error);
      throw new Error(`统计查询失败: ${error.message}`);
    }

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
    data?.forEach((signal) => {
      const stats = statsMap.get(signal.signal_type);
      if (stats) {
        stats.count++;
        if (signal.status === "active") {
          stats.activeCount++;
        }
        if (signal.direction === 1) {
          stats.bullishCount++;
        } else if (signal.direction === -1) {
          stats.bearishCount++;
        }
      }
    });

    return Array.from(statsMap.values());
  } catch (error) {
    console.error("getSignalStats 执行失败:", error);
    throw error;
  }
}

/**
 * 根据ID获取单个信号
 */
export async function getSignalById(id: string): Promise<Signal | null> { // 改为 UUID 字符串
  try {
    const db = getDatabaseClient();
    const supabase = (db as SupabaseDatabaseAdapter).getClient();

    const { data, error } = await supabase
      .from("signals")
      .select(
        `
        *,
        stock:symbol (
          name,
          market,
          meta_data
        )
      `,
      )
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null; // 记录不存在
      }
      throw new Error(`查询失败: ${error.message}`);
    }

    return data ? addBackwardCompatibility(data) : null;
  } catch (error) {
    console.error("getSignalById 执行失败:", error);
    throw error;
  }
}

/**
 * 搜索信号
 */
export async function searchSignals(searchTerm: string, category?: "intraday" | "daily"): Promise<Signal[]> {
  try {
    const db = getDatabaseClient();
    const supabase = (db as SupabaseDatabaseAdapter).getClient();

    let query = supabase
      .from("signals")
      .select(
        `
        *,
        stock:symbol (
          name,
          market,
          meta_data
        )
      `,
      )
      .eq("status", "active");

    // 添加分类过滤器（使用新的 level 字段）
    if (category) {
      const level = convertCategoryToLevel(category);
      query = query.eq("level", level);
    }

    // 搜索条件：股票代码或信号类型
    query = query.or(`symbol.ilike.%${searchTerm}%,signal_type.ilike.%${searchTerm}%`);

    const { data, error } = await query.order("created_at", { ascending: false }).limit(20);

    if (error) {
      throw new Error(`搜索失败: ${error.message}`);
    }

    // 添加向后兼容性属性
    const results = (data || []).map(addBackwardCompatibility);
    return results;
  } catch (error) {
    console.error("searchSignals 执行失败:", error);
    throw error;
  }
}
