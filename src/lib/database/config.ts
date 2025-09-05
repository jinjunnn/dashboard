import { DatabaseConfig, CacheConfig, Environment } from "./types";

/**
 * 获取当前环境
 */
export function getCurrentEnvironment(): Environment {
  // 安全检查 process.env 是否可用
  if (typeof process === 'undefined' || !process.env) {
    return "development";
  }
  
  if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
    return "production";
  }
  return "development";
}

/**
 * 获取 Supabase 配置
 */
export function getSupabaseConfig() {
  // 安全检查 process.env 是否可用
  if (typeof process === 'undefined' || !process.env) {
    // 返回默认的开发环境配置
    return {
      url: "http://127.0.0.1:54321",
      key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU",
      anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.dBjyJnvQBK_L8PN2aPCO6k2Hs-9CsAe6jnIoFj5YqOI",
    };
  }

  const env = getCurrentEnvironment();

  if (env === "production") {
    // 生产环境 - 使用云端 Supabase
    return {
      url: process.env.SUPABASE_URL || "",
      key: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    };
  } else {
    // 开发环境 - 使用本地 Supabase
    return {
      url: process.env.NEXT_PUBLIC_SUPABASE_LOCAL_URL || "http://127.0.0.1:54321",
      key: process.env.SUPABASE_LOCAL_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU",
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_LOCAL_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.dBjyJnvQBK_L8PN2aPCO6k2Hs-9CsAe6jnIoFj5YqOI",
    };
  }
}

/**
 * 获取数据库配置（保持兼容性）
 */
export function getDatabaseConfig(): DatabaseConfig {
  const supabaseConfig = getSupabaseConfig();
  return {
    url: supabaseConfig.url,
    ssl: true,
  };
}

/**
 * 获取缓存配置
 */
export function getCacheConfig(): CacheConfig {
  // 安全检查 process.env 是否可用
  if (typeof process === 'undefined' || !process.env) {
    // 返回默认的开发环境配置
    return {
      host: "localhost",
      port: 6379,
      password: undefined,
      ssl: false,
    };
  }

  const env = getCurrentEnvironment();

  if (env === "production") {
    // 生产环境 - 使用 Upstash Redis
    return {
      url: process.env.UPSTASH_REDIS_REST_URL,
      password: process.env.UPSTASH_REDIS_REST_TOKEN,
      ssl: true,
    };
  } else {
    // 开发环境 - 使用本地 Redis
    return {
      host: process.env.REDIS_HOST || "localhost",
      port: parseInt(process.env.REDIS_PORT || "6379"),
      password: process.env.REDIS_PASSWORD,
      ssl: false,
    };
  }
}
