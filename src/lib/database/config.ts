import { DatabaseConfig, CacheConfig, Environment } from './types';

/**
 * 获取当前环境
 */
export function getCurrentEnvironment(): Environment {
  if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
    return 'production';
  }
  return 'development';
}

/**
 * 获取 Supabase 配置
 */
export function getSupabaseConfig() {
  const env = getCurrentEnvironment();
  
  if (env === 'production') {
    // 生产环境 - 使用云端 Supabase
    return {
      url: process.env.SUPABASE_URL!,
      key: process.env.SUPABASE_SERVICE_ROLE_KEY!,
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    };
  } else {
    // 开发环境 - 使用本地 Supabase
    return {
      url: process.env.NEXT_PUBLIC_SUPABASE_LOCAL_URL || 'http://127.0.0.1:54321',
      key: process.env.SUPABASE_LOCAL_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY!,
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_LOCAL_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
  const env = getCurrentEnvironment();
  
  if (env === 'production') {
    // 生产环境 - 使用 Upstash Redis
    return {
      url: process.env.UPSTASH_REDIS_REST_URL,
      password: process.env.UPSTASH_REDIS_REST_TOKEN,
      ssl: true,
    };
  } else {
    // 开发环境 - 使用本地 Redis
    return {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      ssl: false,
    };
  }
} 