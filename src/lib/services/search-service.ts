import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface StockSearchResult {
  type: "stock";
  symbol: string;
  name: string;
  market: string;
  meta_data?: any;
}

export interface SignalSearchResult {
  type: "signal";
  id: number;
  symbol: string;
  signal_type: string;
  category: "intraday" | "daily";
  direction: "bullish" | "bearish" | "neutral";
  price: number;
  confidence: number;
  status: string;
  created_at: string;
}

export type SearchResult = StockSearchResult | SignalSearchResult;

export interface SearchResponse {
  stocks: StockSearchResult[];
  signals: SignalSearchResult[];
}

/**
 * 处理股票代码前缀
 * @param input 用户输入
 * @returns 标准化的股票代码
 */
function normalizeStockCode(input: string): string {
  // 移除已有的前缀
  const cleanCode = input.replace(/^(SZ\.|SH\.)/, '');
  
  // 只有6位数字才处理
  if (!/^\d{6}$/.test(cleanCode)) {
    return input; // 如果不是6位数字，直接返回原输入
  }
  
  // 根据规则添加前缀
  if (cleanCode.startsWith('0') || cleanCode.startsWith('3')) {
    return `SZ.${cleanCode}`;
  } else if (cleanCode.startsWith('6')) {
    return `SH.${cleanCode}`;
  }
  
  return input; // 其他情况返回原输入
}

/**
 * 判断输入是否为股票搜索
 * @param input 用户输入
 * @returns 是否为股票搜索
 */
function isStockSearch(input: string): boolean {
  // 中文字符或者0/3/6开头的6位数字
  return /[\u4e00-\u9fa5]/.test(input) || /^[036]\d{5}$/.test(input.replace(/^(SZ\.|SH\.)/, ''));
}

/**
 * 判断输入是否为信号搜索
 * @param input 用户输入
 * @returns 是否为信号搜索
 */
function isSignalSearch(input: string): boolean {
  // 纯数字
  return /^\d+$/.test(input);
}

/**
 * 搜索股票
 * @param query 搜索关键词
 * @returns 股票搜索结果
 */
export async function searchStocks(query: string): Promise<StockSearchResult[]> {
  try {
    const supabase = createSupabaseServerClient();
    
    // 判断是中文还是股票代码
    if (/[\u4e00-\u9fa5]/.test(query)) {
      // 中文搜索股票名称
      const { data, error } = await supabase
        .from('stock')
        .select('symbol, name, market, meta_data')
        .ilike('name', `%${query}%`)
        .limit(10);
      
      if (error) throw error;
      
      return data?.map((stock: any) => ({
        type: "stock" as const,
        symbol: stock.symbol,
        name: stock.name,
        market: stock.market,
        meta_data: stock.meta_data
      })) || [];
    } else {
      // 数字搜索股票代码
      const normalizedCode = normalizeStockCode(query);
      const { data, error } = await supabase
        .from('stock')
        .select('symbol, name, market, meta_data')
        .eq('symbol', normalizedCode)
        .limit(10);
      
      if (error) throw error;
      
      return data?.map((stock: any) => ({
        type: "stock" as const,
        symbol: stock.symbol,
        name: stock.name,
        market: stock.market,
        meta_data: stock.meta_data
      })) || [];
    }
  } catch (error) {
    console.error('搜索股票失败:', error);
    return [];
  }
}

/**
 * 搜索信号
 * @param query 搜索关键词（信号ID）
 * @returns 信号搜索结果
 */
export async function searchSignals(query: string): Promise<SignalSearchResult[]> {
  try {
    const supabase = createSupabaseServerClient();
    const signalId = parseInt(query);
    
    if (isNaN(signalId)) {
      return [];
    }
    
    const { data, error } = await supabase
      .from('signals')
      .select('id, symbol, signal_type, category, direction, price, confidence, status, created_at')
      .eq('id', signalId)
      .limit(10);
    
    if (error) throw error;
    
    return data?.map((signal: any) => ({
      type: "signal" as const,
      id: signal.id,
      symbol: signal.symbol,
      signal_type: signal.signal_type,
      category: signal.category,
      direction: signal.direction,
      price: signal.price,
      confidence: signal.confidence,
      status: signal.status,
      created_at: signal.created_at
    })) || [];
  } catch (error) {
    console.error('搜索信号失败:', error);
    return [];
  }
}

/**
 * 统一搜索函数
 * @param query 搜索关键词
 * @returns 搜索结果
 */
export async function universalSearch(query: string): Promise<SearchResponse> {
  const results: SearchResponse = {
    stocks: [],
    signals: []
  };
  
  if (!query.trim()) {
    return results;
  }
  
  // 同时搜索股票和信号
  const searchPromises: Promise<void>[] = [];
  
  // 如果符合股票搜索条件，搜索股票
  if (isStockSearch(query)) {
    searchPromises.push(
      searchStocks(query).then(stocks => {
        results.stocks = stocks;
      })
    );
  }
  
  // 如果符合信号搜索条件，搜索信号
  if (isSignalSearch(query)) {
    searchPromises.push(
      searchSignals(query).then(signals => {
        results.signals = signals;
      })
    );
  }
  
  await Promise.all(searchPromises);
  
  return results;
} 