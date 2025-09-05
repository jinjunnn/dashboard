import { DatabaseClient, CacheClient } from "./types";
import { getCurrentEnvironment, getSupabaseConfig, getCacheConfig } from "./config";
import { SupabaseDatabaseAdapter } from "./adapters/supabase-adapter";
import { RedisCacheAdapter } from "./adapters/redis-adapter";
import { UpstashCacheAdapter } from "./adapters/upstash-adapter";

let databaseInstance: DatabaseClient | null = null;
let cacheInstance: CacheClient | null = null;

/**
 * 获取数据库客户端（单例模式）
 */
export function getDatabaseClient(): DatabaseClient {
  if (!databaseInstance) {
    const env = getCurrentEnvironment();
    const config = getSupabaseConfig();

    // 本地和云端都使用 Supabase，只是配置不同
    databaseInstance = new SupabaseDatabaseAdapter(config.url, config.key);

    if (env === "production") {
      console.log("生产环境：使用云端 Supabase 数据库");
    } else {
      console.log("开发环境：使用本地 Supabase 数据库");
    }
  }

  return databaseInstance;
}

/**
 * 获取缓存客户端（单例模式）
 */
export function getCacheClient(): CacheClient {
  if (!cacheInstance) {
    const env = getCurrentEnvironment();
    const config = getCacheConfig();

    if (env === "production") {
      // 生产环境使用 Upstash
      cacheInstance = new UpstashCacheAdapter(config);
      console.log("生产环境：使用 Upstash Redis 缓存");
    } else {
      // 开发环境使用本地 Redis
      cacheInstance = new RedisCacheAdapter(config);
      console.log("开发环境：使用本地 Redis 缓存");
    }
  }

  return cacheInstance;
}

/**
 * 获取 Supabase 客户端
 */
export function getSupabaseClient() {
  const adapter = getDatabaseClient();
  if (adapter instanceof SupabaseDatabaseAdapter) {
    return adapter.getClient();
  }
  throw new Error("数据库适配器不是 Supabase 类型");
}

/**
 * 关闭所有数据库连接
 */
export async function closeAllConnections() {
  const promises: Promise<void>[] = [];

  if (databaseInstance) {
    promises.push(databaseInstance.close());
    databaseInstance = null;
  }

  if (cacheInstance) {
    promises.push(cacheInstance.close());
    cacheInstance = null;
  }

  await Promise.all(promises);
}
