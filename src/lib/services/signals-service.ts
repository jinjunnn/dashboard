/**
 * 基于 API 路由的信号查询服务客户端
 * 通过 API 调用访问信号数据，避免客户端直连数据库
 */

import { getSignalsByCategory, getSignalByName, getSignalConfigById, type SignalConfig } from "@/config/signals-config";

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
 * API 调用辅助函数
 */
async function apiCall<T>(url: string): Promise<T> {
  // 处理相对URL的全路径构建
  let fullUrl = url;
  
  if (url.startsWith('/')) {
    if (typeof window !== 'undefined') {
      // 客户端环境
      fullUrl = `${window.location.origin}${url}`;
    } else {
      // 服务器端环境，动态检测端口号
      const port = process.env.PORT || 3000;
      fullUrl = `http://localhost:${port}${url}`;
    }
  }
  
  const response = await fetch(fullUrl);
  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.error || 'API 调用失败');
  }
  
  return result.data;
}

/**
 * 辅助函数：转换旧的category为新的level
 */
function convertCategoryToLevel(category: "intraday" | "daily"): "intraday" | "1D" {
  return category === "daily" ? "1D" : "intraday";
}

/**
 * 获取交易信号列表（通过 API 路由）
 */
export async function getSignals(options: SignalQueryOptions): Promise<Signal[]> {
  try {
    // 处理向后兼容性：如果传入category则转换为level
    const level = options.level || (options.category ? convertCategoryToLevel(options.category) : "intraday");
    
    // 构建查询参数
    const params = new URLSearchParams({
      level: level
    });

    if (options.signalName) {
      params.append('signalName', options.signalName);
    }
    if (options.direction !== undefined) {
      params.append('direction', options.direction.toString());
    }
    if (options.symbol) {
      params.append('symbol', options.symbol);
    }
    if (options.limit) {
      params.append('limit', options.limit.toString());
    }
    if (options.offset) {
      params.append('offset', options.offset.toString());
    }

    const url = `/api/signals?${params.toString()}`;
    return await apiCall<Signal[]>(url);

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
    level: signalConfig.category === 'daily' ? '1D' : 'intraday',
    signalName: signalConfig.name,
  });
}

/**
 * 获取信号统计数据
 */
export async function getSignalStats(category: "intraday" | "daily"): Promise<SignalStats[]> {
  try {
    const params = new URLSearchParams({
      category: category
    });

    const url = `/api/signals/stats?${params.toString()}`;
    return await apiCall<SignalStats[]>(url);
    
  } catch (error) {
    console.error("getSignalStats 执行失败:", error);
    throw error;
  }
}

/**
 * 根据ID获取单个信号
 */
export async function getSignalById(id: string): Promise<Signal | null> {
  try {
    const url = `/api/signals/${id}`;
    return await apiCall<Signal>(url);
  } catch (error) {
    console.error("getSignalById 执行失败:", error);
    if (error instanceof Error && error.message.includes('404')) {
      return null;
    }
    throw error;
  }
}

/**
 * 搜索信号
 */
export async function searchSignals(searchTerm: string, category?: "intraday" | "daily"): Promise<Signal[]> {
  try {
    const params = new URLSearchParams({
      q: searchTerm
    });

    if (category) {
      params.append('category', category);
    }

    const url = `/api/signals/search?${params.toString()}`;
    return await apiCall<Signal[]>(url);
    
  } catch (error) {
    console.error("searchSignals 执行失败:", error);
    throw error;
  }
}