/**
 * 信号查询服务
 * 基于 signals-config.ts 配置进行数据查询
 */

import { 
  getSignalsByCategory, 
  getSignalByName, 
  getSignalConfigById,
  type SignalConfig 
} from "@/config/signals-config"
import { getDatabaseClient } from "@/lib/database/factory"
import { SupabaseDatabaseAdapter } from "@/lib/database/adapters/supabase-adapter"

// 信号数据接口
export interface Signal {
  id: number
  symbol: string
  signal_type: string
  category: "intraday" | "daily"
  direction: "long" | "short"
  price: number
  confidence: number
  status: string
  created_at: string
  expires_at: string
  meta_data: Record<string, unknown>
  backtest?: {
    success_rate: number
    avg_return: number
    max_drawdown: number
  }
  // 连表查询的股票信息
  stock?: {
    name: string
    market: string
    meta_data: Record<string, unknown>
  }
}

// 信号统计接口
export interface SignalStats extends SignalConfig {
  count: number
  activeCount: number
  bullishCount: number
  bearishCount: number
}

// 查询选项接口
export interface SignalQueryOptions {
  category: "intraday" | "daily"
  signalName?: string
  direction?: "long" | "short"
  symbol?: string
  limit?: number
  offset?: number
}

/**
 * 构建基础查询
 */
function buildBaseQuery(supabase: any, options: SignalQueryOptions) {
  const availableSignals = getSignalsByCategory(options.category)
  const validSignalTypes = availableSignals
    .filter((signal) => signal.enabled)
    .map((signal) => signal.name)
  
  if (validSignalTypes.length === 0) {
    return null
  }
  
  return supabase
    .from("signals")
    .select(`
      *,
      stock:symbol (
        name,
        market,
        meta_data
      )
    `)
    .eq("category", options.category)
    .eq("status", "active")
    .in("signal_type", validSignalTypes)
}

/**
 * 应用查询过滤器
 */
function applyFilters(query: any, options: SignalQueryOptions) {
  let filteredQuery = query
  
  // 信号名称筛选
  if (options.signalName) {
    const signalConfig = getSignalByName(options.signalName)
    if (!signalConfig || !signalConfig.enabled) {
      throw new Error(`信号类型 ${options.signalName} 不存在或已禁用`)
    }
    filteredQuery = filteredQuery.eq("signal_type", options.signalName)
  }
  
  // 方向筛选
  if (options.direction) {
    filteredQuery = filteredQuery.eq("direction", options.direction)
  }
  
  // 股票代码筛选
  if (options.symbol) {
    filteredQuery = filteredQuery.eq("symbol", options.symbol)
  }
  
  return filteredQuery
}

/**
 * 应用分页
 */
function applyPagination(query: any, options: SignalQueryOptions) {
  let paginatedQuery = query
  
  if (options.limit) {
    paginatedQuery = paginatedQuery.limit(options.limit)
  }
  
  if (options.offset) {
    const limit = options.limit || 50
    paginatedQuery = paginatedQuery.range(options.offset, options.offset + limit - 1)
  }
  
  return paginatedQuery
}

/**
 * 获取交易信号列表（基于配置）
 */
export async function getSignals(options: SignalQueryOptions): Promise<Signal[]> {
  try {
    const db = getDatabaseClient()
    const supabase = (db as SupabaseDatabaseAdapter).getClient()
    
    // 构建基础查询
    const baseQuery = buildBaseQuery(supabase, options)
    if (!baseQuery) {
      console.warn(`分类 ${options.category} 没有启用的信号类型`)
      return []
    }

    // 应用过滤器
    const filteredQuery = applyFilters(baseQuery, options)
    
    // 应用分页和排序
    const finalQuery = applyPagination(filteredQuery, options)
      .order("created_at", { ascending: false })

    const { data, error } = await finalQuery

    if (error) {
      console.error("查询信号数据失败:", error)
      throw new Error(`查询失败: ${error.message}`)
    }

    return data || []
  } catch (error) {
    console.error("getSignals 执行失败:", error)
    throw error
  }
}

/**
 * 根据配置ID获取信号列表
 */
export async function getSignalsByConfigId(configId: string): Promise<Signal[]> {
  const signalConfig = getSignalConfigById(configId)
  if (!signalConfig) {
    throw new Error(`信号配置 ${configId} 不存在`)
  }

  return getSignals({
    category: signalConfig.category,
    signalName: signalConfig.name,
  })
}

/**
 * 获取信号统计数据
 */
export async function getSignalStats(category: "intraday" | "daily"): Promise<SignalStats[]> {
  try {
    const db = getDatabaseClient()
    const supabase = (db as SupabaseDatabaseAdapter).getClient()
    
    // 获取配置中启用的信号类型
    const availableSignals = getSignalsByCategory(category).filter((signal) => signal.enabled)
    
    if (availableSignals.length === 0) {
      return []
    }

    const validSignalTypes = availableSignals.map((signal) => signal.name)

    // 查询统计数据
    const { data, error } = await supabase
      .from("signals")
      .select("signal_type, direction, status")
      .eq("category", category)
      .in("signal_type", validSignalTypes)

    if (error) {
      console.error("查询统计数据失败:", error)
      throw new Error(`统计查询失败: ${error.message}`)
    }

    // 计算统计信息
    const statsMap = new Map<string, SignalStats>()

    // 初始化统计数据
    availableSignals.forEach((signal) => {
      statsMap.set(signal.name, {
        ...signal,
        count: 0,
        activeCount: 0,
        bullishCount: 0,
        bearishCount: 0,
      })
    })

    // 统计数据
    data?.forEach((signal) => {
      const stats = statsMap.get(signal.signal_type)
      if (stats) {
        stats.count++
        if (signal.status === "active") {
          stats.activeCount++
        }
        if (signal.direction === "long") {
          stats.bullishCount++
        } else if (signal.direction === "short") {
          stats.bearishCount++
        }
      }
    })

    return Array.from(statsMap.values())
  } catch (error) {
    console.error("getSignalStats 执行失败:", error)
    throw error
  }
}

/**
 * 根据ID获取单个信号
 */
export async function getSignalById(id: number): Promise<Signal | null> {
  try {
    const db = getDatabaseClient()
    const supabase = (db as SupabaseDatabaseAdapter).getClient()

    const { data, error } = await supabase
      .from("signals")
      .select(`
        *,
        stock:symbol (
          name,
          market,
          meta_data
        )
      `)
      .eq("id", id)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return null // 记录不存在
      }
      throw new Error(`查询失败: ${error.message}`)
    }

    return data
  } catch (error) {
    console.error("getSignalById 执行失败:", error)
    throw error
  }
}

/**
 * 搜索信号
 */
export async function searchSignals(
  searchTerm: string, 
  category?: "intraday" | "daily"
): Promise<Signal[]> {
  try {
    const db = getDatabaseClient()
    const supabase = (db as SupabaseDatabaseAdapter).getClient()

    let query = supabase
      .from("signals")
      .select(`
        *,
        stock:symbol (
          name,
          market,
          meta_data
        )
      `)
      .eq("status", "active")

    // 添加分类过滤器
    if (category) {
      query = query.eq("category", category)
    }

    // 搜索条件：股票代码或信号类型
    query = query.or(`symbol.ilike.%${searchTerm}%,signal_type.ilike.%${searchTerm}%`)

    const { data, error } = await query
      .order("created_at", { ascending: false })
      .limit(20)

    if (error) {
      throw new Error(`搜索失败: ${error.message}`)
    }

    return data || []
  } catch (error) {
    console.error("searchSignals 执行失败:", error)
    throw error
  }
}
