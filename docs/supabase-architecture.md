# Supabase 统一架构

## 架构概述

本项目现在使用统一的 Supabase 架构：

- **开发环境**：本地 Supabase 实例
- **生产环境**：云端 Supabase 实例

## 优势

1. **统一接口**：本地和云端使用相同的 Supabase API
2. **简化维护**：只需维护一套数据库适配器
3. **一致体验**：本地开发可以测试所有 Supabase 功能（实时、认证等）
4. **减少复杂度**：环境切换更简单直接

## 环境配置

### 开发环境（本地 Supabase）

```env
NEXT_PUBLIC_SUPABASE_LOCAL_URL=http://localhost:54321
SUPABASE_LOCAL_SERVICE_ROLE_KEY=your_local_service_role_key
NEXT_PUBLIC_SUPABASE_LOCAL_ANON_KEY=your_local_anon_key
```

### 生产环境（云端 Supabase）

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
```

## 自动环境检测

系统会根据 `NODE_ENV` 和 `VERCEL` 环境变量自动选择配置：

```typescript
export function getCurrentEnvironment(): Environment {
  if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
    return "production";
  }
  return "development";
}
```

## 缓存配置

- **开发环境**：本地 Redis (`localhost:6379`)
- **生产环境**：Upstash Redis (云端)

## 文件结构

```
src/lib/database/
├── config.ts           # 环境配置管理
├── factory.ts          # 客户端工厂
├── types.ts           # 类型定义
└── adapters/
    ├── supabase-adapter.ts  # Supabase 适配器
    ├── redis-adapter.ts     # Redis 适配器
    └── upstash-adapter.ts   # Upstash 适配器
```

## 使用方式

### 在服务中使用

```typescript
import { getDatabaseClient } from "@/lib/database/factory";

export async function getSignals() {
  const db = getDatabaseClient();
  const supabase = (db as SupabaseDatabaseAdapter).getClient();

  const { data, error } = await supabase.from("signals").select("*");

  return data;
}
```

### 在组件中使用

```typescript
import { createSupabaseClient } from "@/lib/supabase/client";

export function SignalsList() {
  const supabase = createSupabaseClient();
  // ... 使用 supabase 客户端
}
```

## 迁移说明

从之前的 PostgreSQL + Supabase 混合架构迁移到统一 Supabase 架构：

1. ✅ 移除了 PostgreSQL 适配器
2. ✅ 删除了 `pg` 和 `@types/pg` 依赖
3. ✅ 统一使用 Supabase 适配器
4. ✅ 简化了环境配置
5. ✅ 移除了复杂的模拟数据逻辑

## 注意事项

1. 确保本地 Supabase 实例正在运行（通常在端口 54321）
2. 数据库表结构需要在本地和云端保持一致
3. 环境变量需要正确配置
4. Redis 缓存仍然使用原有的本地/云端分离策略
