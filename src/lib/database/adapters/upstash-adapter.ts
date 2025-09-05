import { CacheClient, CacheConfig } from "../types";

// 注意：需要安装 @upstash/redis 包
// npm install @upstash/redis

export class UpstashCacheAdapter implements CacheClient {
  private client: any; // Redis from @upstash/redis

  constructor(config: CacheConfig) {
    if (typeof window === "undefined") {
      const { Redis } = require("@upstash/redis");

      this.client = new Redis({
        url: config.url!,
        token: config.password!,
      });
    }
  }

  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.client.setex(key, ttl, value);
    } else {
      await this.client.set(key, value);
    }
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.client.exists(key);
    return result === 1;
  }

  async close(): Promise<void> {
    // Upstash Redis 客户端不需要手动关闭
  }
}
