import { getDatabaseClient, getCacheClient, getSupabaseClient } from './factory';

/**
 * 示例：用户数据访问层
 */
export class UserService {
  /**
   * 获取用户信息（适用于两种环境）
   */
  async getUser(userId: string) {
    const db = getDatabaseClient();
    
    // 检查是否为 Supabase 环境
    try {
      const supabase = getSupabaseClient();
      // 使用 Supabase 的表操作
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      return data;
    } catch {
      // 使用原生 SQL（PostgreSQL）
      const result = await db.query(
        'SELECT * FROM users WHERE id = $1',
        [userId]
      );
      return result[0];
    }
  }

  /**
   * 创建用户（带事务）
   */
  async createUser(userData: any) {
    const db = getDatabaseClient();
    
    return await db.transaction(async (tx) => {
      try {
        const supabase = getSupabaseClient();
        // Supabase 创建用户
        const { data, error } = await supabase
          .from('users')
          .insert(userData)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } catch {
        // PostgreSQL 创建用户
        const result = await tx.query(
          'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
          [userData.name, userData.email]
        );
        return result[0];
      }
    });
  }
}

/**
 * 示例：缓存服务
 */
export class CacheService {
  private cache = getCacheClient();

  async getUserCache(userId: string) {
    const key = `user:${userId}`;
    const cached = await this.cache.get(key);
    
    if (cached) {
      return JSON.parse(cached);
    }
    
    return null;
  }

  async setUserCache(userId: string, userData: any, ttl = 3600) {
    const key = `user:${userId}`;
    await this.cache.set(key, JSON.stringify(userData), ttl);
  }

  async invalidateUserCache(userId: string) {
    const key = `user:${userId}`;
    await this.cache.del(key);
  }
}

/**
 * 示例：综合服务（数据库 + 缓存）
 */
export class UserManager {
  private userService = new UserService();
  private cacheService = new CacheService();

  async getUser(userId: string) {
    // 先查缓存
    let user = await this.cacheService.getUserCache(userId);
    
    if (!user) {
      // 缓存未命中，查数据库
      user = await this.userService.getUser(userId);
      
      if (user) {
        // 设置缓存
        await this.cacheService.setUserCache(userId, user);
      }
    }
    
    return user;
  }

  async updateUser(userId: string, updateData: any) {
    // 更新数据库
    const updatedUser = await this.userService.createUser({
      ...updateData,
      id: userId
    });
    
    // 更新缓存
    await this.cacheService.setUserCache(userId, updatedUser);
    
    return updatedUser;
  }
} 