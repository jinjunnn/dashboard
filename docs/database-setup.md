# 数据库设置指南

## 概述

本项目采用**环境适配器模式**，实现本地开发和生产环境的数据库无缝切换：

- **开发环境**：Docker PostgreSQL + Redis
- **生产环境**：Supabase + Upstash Redis

## 快速开始

### 1. 本地开发环境

```bash
# 1. 复制环境变量文件
cp env.example .env.local

# 2. 启动 Docker 服务
npm run docker:up

# 3. 启动开发服务器
npm run dev
```

### 2. 环境变量配置

```bash
# 开发环境
NODE_ENV=development
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=dashboard
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres

REDIS_HOST=localhost
REDIS_PORT=6379

# 生产环境（Vercel 部署时设置）
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
UPSTASH_REDIS_REST_URL=your-upstash-url
UPSTASH_REDIS_REST_TOKEN=your-upstash-token
```

## 使用方法

### 数据库操作

```typescript
import { getDatabaseClient } from '@/lib/database/factory';

const db = getDatabaseClient();

// 查询数据
const users = await db.query('SELECT * FROM users WHERE active = $1', [true]);

// 事务操作
await db.transaction(async (tx) => {
  await tx.query('INSERT INTO users (name, email) VALUES ($1, $2)', ['John', 'john@example.com']);
  await tx.query('INSERT INTO profiles (user_id, bio) VALUES ($1, $2)', [userId, 'Bio']);
});
```

### 缓存操作

```typescript
import { getCacheClient } from '@/lib/database/factory';

const cache = getCacheClient();

// 基本操作
await cache.set('key', 'value', 3600); // TTL 3600秒
const value = await cache.get('key');
await cache.del('key');
```

### Supabase 特殊功能

```typescript
import { getSupabaseClient } from '@/lib/database/factory';

// 仅在生产环境可用
const supabase = getSupabaseClient();

// 认证
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password'
});

// 文件上传
const { data, error } = await supabase.storage
  .from('avatars')
  .upload('user-avatar.png', file);
```

## Docker 管理命令

```bash
# 启动服务
npm run docker:up

# 查看日志
npm run docker:logs

# 停止服务
npm run docker:down

# 清理数据（谨慎使用）
npm run docker:clean
```

## 数据库管理工具

- **Adminer**：http://localhost:8080 （PostgreSQL 管理）
- **Redis Commander**：http://localhost:8081 （Redis 管理）

## 部署到 Vercel

1. 在 Vercel 项目设置中添加环境变量
2. 确保 Supabase 和 Upstash 配置正确
3. 代码会自动检测生产环境并切换到云服务

## 故障排除

### 常见问题

1. **Docker 启动失败**
   ```bash
   # 检查端口占用
   lsof -i :5432
   lsof -i :6379
   ```

2. **环境变量未生效**
   - 检查 `.env.local` 文件是否存在
   - 重启开发服务器

3. **生产环境连接失败**
   - 验证 Supabase 和 Upstash 的 URL 和密钥
   - 检查网络连接

### 调试模式

```typescript
import { getCurrentEnvironment } from '@/lib/database/config';

console.log('当前环境:', getCurrentEnvironment());
```

## 最佳实践

1. **始终使用抽象层**：通过 factory 函数获取客户端，不要直接导入适配器
2. **环境隔离**：开发和生产使用不同的数据库实例
3. **错误处理**：妥善处理数据库连接失败的情况
4. **缓存策略**：合理使用缓存提高性能
5. **事务管理**：涉及多表操作时使用事务 