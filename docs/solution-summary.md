# 数据库连接解决方案总结

## 🎯 问题描述
你遇到的 `fetch failed` 错误是因为应用尝试连接 Supabase（云端数据库），但你的实际需求是：
- **开发环境**：连接本地 Docker 的 PostgreSQL（端口 5432）
- **生产环境**：连接云端 Supabase

## ✅ 解决方案

### 1. 架构设计
我们实现了数据库适配器模式：
```
开发环境：应用 ← 数据库适配器 ← PostgreSQL (localhost:5432)
生产环境：应用 ← 数据库适配器 ← Supabase (云端)
```

### 2. 主要修改

#### 📁 新增文件
- `src/lib/database/types.ts` - 数据库抽象接口
- `src/lib/database/config.ts` - 环境配置管理
- `src/lib/database/factory.ts` - 数据库客户端工厂
- `src/lib/database/adapters/postgres-adapter.ts` - PostgreSQL 适配器
- `src/lib/database/adapters/supabase-adapter.ts` - Supabase 适配器
- `docker-compose.yml` - Docker 开发环境
- `env.example` - 环境变量模板

#### 🔧 修改文件
- `src/lib/services/signals-service.ts` - 使用数据库适配器
- `package.json` - 添加了 Docker 管理脚本

### 3. 数据格式适配
你的 PostgreSQL 数据库中：
- `direction` 字段存储 `"long"/"short"`
- 我们的代码期望 `"BULLISH"/"BEARISH"`

解决方案：在 SQL 查询中进行转换
```sql
CASE 
  WHEN s.direction = 'long' THEN 'BULLISH'
  WHEN s.direction = 'short' THEN 'BEARISH'
  ELSE UPPER(s.direction)
END as direction
```

## 🚀 使用方法

### 开发环境
```bash
# 1. 启动开发服务器（会自动使用本地 PostgreSQL）
npm run dev

# 2. 查看控制台日志，应该显示：
# "开发环境：使用本地 PostgreSQL 数据库"
```

### 生产环境
```bash
# 部署到 Vercel 时会自动使用 Supabase
# 确保环境变量配置正确：
# SUPABASE_URL=your-supabase-url
# SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## ✅ 验证步骤

1. **启动开发服务器**：`npm run dev`
2. **访问页面**：
   - http://localhost:3000/signals/daily
   - http://localhost:3000/signals/intraday
   - http://localhost:3000/stocks/SZ.002547

3. **检查控制台日志**：
   - ✅ `开发环境：使用本地 PostgreSQL 数据库`
   - ✅ `PostgreSQL 连接池已创建：localhost:5432/stocks`
   - ❌ 不应该看到 `fetch failed` 错误

4. **检查数据**：页面应该显示真实的数据库数据，而不是模拟数据

## 🔍 故障排除

### 问题：仍然看到 fetch failed 错误
**解决**：检查环境变量 `NODE_ENV=development`

### 问题：连接 PostgreSQL 失败
**解决**：确认 Docker 容器运行正常
```bash
docker ps | grep postgres
```

### 问题：数据库连接被拒绝
**解决**：检查 `.env.local` 中的数据库密码是否正确

## 📊 当前状态

✅ **已完成**：
- 数据库适配器架构
- PostgreSQL 连接逻辑
- 数据格式转换
- 环境自动检测

🔄 **测试中**：
- 开发服务器是否正常启动
- 数据库连接是否成功
- 页面是否显示真实数据

## 🎉 预期结果

修改完成后，你应该能够：
1. **开发环境**：直接从本地 PostgreSQL 读取真实数据
2. **生产环境**：无缝切换到 Supabase
3. **无代码重复**：一套代码适用于两种环境
4. **类型安全**：统一的数据接口保证类型一致性 