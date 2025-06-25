import { CacheClient, CacheConfig } from '../types';

// 注意：需要安装 redis 包
// npm install redis

export class RedisCacheAdapter implements CacheClient {
  private client: any; // RedisClientType

  constructor(config: CacheConfig) {
    if (typeof window === 'undefined') {
      const { createClient } = require('redis');
      
      this.client = createClient({
        socket: {
          host: config.host,
          port: config.port,
        },
        password: config.password,
      });
      
      this.client.on('error', (err: Error) => {
        console.error('Redis Client Error:', err);
      });
    }
  }

  private async ensureConnected() {
    if (!this.client.isOpen) {
      await this.client.connect();
    }
  }

  async get(key: string): Promise<string | null> {
    await this.ensureConnected();
    return await this.client.get(key);
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    await this.ensureConnected();
    if (ttl) {
      await this.client.setEx(key, ttl, value);
    } else {
      await this.client.set(key, value);
    }
  }

  async del(key: string): Promise<void> {
    await this.ensureConnected();
    await this.client.del(key);
  }

  async exists(key: string): Promise<boolean> {
    await this.ensureConnected();
    const result = await this.client.exists(key);
    return result === 1;
  }

  async close(): Promise<void> {
    if (this.client && this.client.isOpen) {
      await this.client.quit();
    }
  }
} 