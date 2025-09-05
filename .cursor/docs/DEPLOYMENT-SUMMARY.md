# Dashboard Docker 部署总结

## 🎯 项目状态

✅ **成功配置**: Dashboard项目已成功配置为可在端口3100上运行
✅ **依赖环境**: 你的Supabase和Redis服务已正常运行  
✅ **环境变量**: 已配置本地Docker环境变量

## 🚀 部署方案

由于Docker Hub连接问题，我们提供了两种部署方案：

### 方案1: 本地运行 + Docker环境 (推荐，已就绪)

```bash
# 一键启动 - 连接你现有的Docker环境
./run-local-with-docker-env.sh
```

**优势:**

- ✅ 无需Docker镜像构建
- ✅ 连接现有Supabase (端口54321) 和 Redis (端口6379)
- ✅ 支持热重载开发
- ✅ 运行在目标端口3100

### 方案2: 纯Docker容器 (网络问题时备用)

```bash
# 当网络恢复后可使用
./deploy-to-docker.sh
```

## 📊 配置详情

### 连接信息

- **应用URL**: http://localhost:3100
- **Supabase**: http://localhost:54321 (连接你现有实例)
- **Redis**: localhost:6379 (连接你现有实例)
- **数据库**: 通过Supabase访问，已有stock和signals表

### 环境变量 (.env.docker.local)

```bash
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3100
NEXT_PUBLIC_SUPABASE_LOCAL_URL=http://localhost:54321
SUPABASE_LOCAL_SERVICE_ROLE_KEY=<标准本地开发密钥>
NEXT_PUBLIC_SUPABASE_LOCAL_ANON_KEY=<标准本地开发密钥>
REDIS_HOST=localhost
REDIS_PORT=6379
```

## 🔧 使用说明

### 启动应用

```bash
# 方式1: 自动化脚本 (推荐)
./run-local-with-docker-env.sh

# 方式2: 手动启动
export NODE_ENV=development
export NEXT_PUBLIC_APP_URL=http://localhost:3100
# ... 其他环境变量
PORT=3100 npm start
```

### 查看状态

```bash
# 检查应用是否运行
curl http://localhost:3100

# 检查Supabase连接
curl http://localhost:54321/rest/v1/

# 检查Redis连接
docker ps | grep redis
```

### 停止应用

```bash
# 如果使用脚本启动，按 Ctrl+C
# 或查找进程并终止
lsof -ti:3100 | xargs kill
```

## 🎉 验证部署

部署成功后：

1. 访问 http://localhost:3100 查看Dashboard
2. 应用应该能够：
   - 连接到你的Supabase数据库
   - 访问stock和signals表数据
   - 使用Redis缓存
   - 显示股票分析界面

## 📝 注意事项

1. **数据库兼容性**: 应用配置为使用你现有的Supabase实例
2. **端口配置**: 应用运行在3100端口，避免与现有服务冲突
3. **开发模式**: 当前配置为开发模式，支持代码热重载
4. **网络连接**: 应用通过localhost连接到你的Docker服务

## 🛠️ 故障排查

### 常见问题

1. **端口被占用**: 脚本会自动检测并提示处理
2. **Supabase连接失败**: 确保容器`supabase_kong_impharaonjin`运行正常
3. **Redis连接失败**: 确保Redis容器运行正常
4. **构建失败**: 检查Node.js版本和依赖

### 调试命令

```bash
# 检查所有相关服务
docker ps | grep -E "(supabase|redis)"

# 查看应用日志
tail -f /path/to/dashboard/logs

# 测试环境连接
curl -v http://localhost:54321/rest/v1/
```

---

**状态**: ✅ 就绪部署  
**下一步**: 运行 `./run-local-with-docker-env.sh` 启动应用
