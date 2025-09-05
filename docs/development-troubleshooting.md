# 开发环境故障排除指南

## 问题：fetch failed 错误

### 问题描述

在开发环境中运行 `npm run dev` 时，出现以下错误：

```
查询信号失败: {
  message: 'TypeError: fetch failed',
  details: 'TypeError: fetch failed\n' +
    '    at node:internal/deps/undici/undici:13502:13\n' +
    '    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)\n' +
    '    at async getSignals (webpack-internal:///(rsc)/./src/lib/services/signals-service.ts:148:33)'
}
```

### 根本原因

- 应用程序试图连接 Supabase（云端数据库）
- 但在开发环境中，我们希望使用本地 Docker 中的 PostgreSQL 和 Redis
- Supabase 连接失败导致了 fetch failed 错误

### 解决方案

#### 方案 1：立即修复（已实施）

为所有 Supabase 服务添加开发环境检测，在开发环境中自动使用模拟数据：

**修改的文件：**

1. `src/lib/services/signals-service.ts`
2. `src/lib/services/search-service.ts`
3. `src/app/(main)/stocks/[symbol]/page.tsx`

**修改内容：**

```typescript
// 在每个函数开始添加
if (process.env.NODE_ENV === "development") {
  console.log("开发环境：使用模拟数据");
  return generateMockData();
}
```

#### 方案 2：完整架构升级（推荐）

使用我们设计的数据库适配器架构，支持：

- 开发环境：Docker PostgreSQL + Redis
- 生产环境：Supabase + Upstash

### 验证修复

运行以下命令验证修复是否生效：

```bash
npm run dev
```

在浏览器中访问：

- http://localhost:3000/signals/daily
- http://localhost:3000/signals/intraday
- http://localhost:3000/stocks/SH.600001

应该看到：

- 控制台输出："开发环境：使用模拟数据"
- 页面正常显示模拟数据
- 没有 fetch failed 错误

### 环境配置

确保你的 `.env.local` 文件包含：

```bash
NODE_ENV=development
```

### 长期解决方案

1. **实施数据库适配器架构**

   ```bash
   # 安装依赖
   npm install pg @types/pg redis @upstash/redis

   # 启动本地数据库
   npm run docker:up

   # 配置环境变量
   cp env.example .env.local
   ```

2. **使用统一的数据访问层**

   ```typescript
   import { getDatabaseClient, getCacheClient } from "@/lib/database/factory";

   const db = getDatabaseClient(); // 自动选择 PostgreSQL 或 Supabase
   const cache = getCacheClient(); // 自动选择 Redis 或 Upstash
   ```

### 常见问题

**Q: 为什么不直接连接本地数据库？**
A: 当前代码架构是为 Supabase 设计的，需要重构才能支持本地数据库。立即修复方案确保应用可以正常运行。

**Q: 模拟数据是否会影响开发？**
A: 模拟数据包含了所有必要的字段和逻辑，可以正常测试前端功能。

**Q: 如何切换到真实数据库？**
A: 按照 `docs/database-setup.md` 中的指南实施完整的数据库适配器架构。

### 下一步

1. ✅ 修复 fetch failed 错误（已完成）
2. 🔄 实施数据库适配器架构
3. 🔄 配置本地 Docker 环境
4. 🔄 迁移到统一数据访问层
