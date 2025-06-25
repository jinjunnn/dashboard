import { SearchResponse } from "./search-service";

/**
 * 客户端搜索服务
 * 通过API路由调用，避免客户端直接访问数据库
 */
export async function universalSearchClient(query: string): Promise<SearchResponse> {
  try {
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      throw new Error(`搜索请求失败: ${response.status}`);
    }
    
    const data = await response.json();
    
    // 如果API返回错误，返回空结果
    if (data.error) {
      console.error("搜索API错误:", data.error, data.details);
      return {
        stocks: [],
        signals: []
      };
    }
    
    return data;
  } catch (error) {
    console.error("客户端搜索失败:", error);
    return {
      stocks: [],
      signals: []
    };
  }
} 