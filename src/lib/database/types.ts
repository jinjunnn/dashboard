// 数据库抽象接口
export interface DatabaseClient {
  query(sql: string, params?: any[]): Promise<any>;
  transaction(callback: (client: DatabaseClient) => Promise<any>): Promise<any>;
  close(): Promise<void>;
}

// Redis抽象接口
export interface CacheClient {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttl?: number): Promise<void>;
  del(key: string): Promise<void>;
  exists(key: string): Promise<boolean>;
  close(): Promise<void>;
}

// 环境类型
export type Environment = "development" | "production";

// 数据库配置
export interface DatabaseConfig {
  host?: string;
  port?: number;
  database?: string;
  username?: string;
  password?: string;
  url?: string;
  ssl?: boolean;
}

// Cache配置
export interface CacheConfig {
  host?: string;
  port?: number;
  password?: string;
  url?: string;
  ssl?: boolean;
}
