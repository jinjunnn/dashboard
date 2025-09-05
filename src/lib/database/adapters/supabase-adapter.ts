import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { DatabaseClient } from "../types";

export class SupabaseDatabaseAdapter implements DatabaseClient {
  private client: SupabaseClient;

  constructor(url: string, key: string) {
    this.client = createClient(url, key);
  }

  async query(sql: string, params?: any[]): Promise<any> {
    // Supabase 使用 rpc 调用存储过程或直接使用表操作
    // 这里需要根据你的具体需求来实现
    throw new Error("Supabase adapter: 请使用 Supabase 的表操作方法");
  }

  async transaction(callback: (client: DatabaseClient) => Promise<any>): Promise<any> {
    // Supabase 不直接支持事务，但可以通过 RPC 实现
    return callback(this);
  }

  async close(): Promise<void> {
    // Supabase 客户端不需要手动关闭
  }

  // Supabase 特有方法
  getClient(): SupabaseClient {
    return this.client;
  }

  // 表操作方法
  table(tableName: string) {
    return this.client.from(tableName);
  }

  // 认证方法
  get auth() {
    return this.client.auth;
  }

  // 存储方法
  get storage() {
    return this.client.storage;
  }
}
