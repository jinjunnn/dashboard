# Docker 部署指南

## 前置条件

确保你已经在Docker中运行了以下服务：

- Supabase (通常在端口 54321)
- PostgreSQL (如果单独部署)

## 环境变量配置

1. 复制环境变量模板：

```bash
cp env.example .env.local
```

2. 编辑 `.env.local` 文件，配置以下关键变量：

```bash
# 基础配置
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3100

# Supabase 配置 (本地开发)
NEXT_PUBLIC_SUPABASE_LOCAL_URL=http://host.docker.internal:54321
SUPABASE_LOCAL_SERVICE_ROLE_KEY=你的本地服务角色密钥
NEXT_PUBLIC_SUPABASE_LOCAL_ANON_KEY=你的本地匿名密钥

# Redis 配置 (将由Docker Compose自动创建)
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT 密钥 (请更换为安全的密钥)
JWT_SECRET=your-secure-jwt-secret-here
NEXTAUTH_SECRET=your-secure-nextauth-secret-here
NEXTAUTH_URL=http://localhost:3100
```

## 快速部署

### 方法1: 使用Docker Compose (推荐)

```bash
# 1. 构建并启动所有服务
docker-compose up -d

# 2. 查看日志
docker-compose logs -f dashboard

# 3. 停止服务
docker-compose down
```

### 方法2: 单独构建Docker镜像

```bash
# 1. 构建镜像
docker build -t dashboard:latest .

# 2. 运行容器 (需要先确保Redis等依赖服务运行)
docker run -p 3100:3100 \
  --env-file .env.local \
  --add-host host.docker.internal:host-gateway \
  dashboard:latest
```

## 访问应用

部署完成后，在浏览器中访问：

- **应用URL**: http://localhost:3100

## 网络配置说明

- 应用端口：3100 (映射到容器内的3100端口)
- Redis端口：6379 (由Docker Compose自动管理)
- 宿主机服务访问：通过 `host.docker.internal` 访问宿主机上的服务

## 故障排查

### 1. 无法连接Supabase

确保Supabase服务正在运行，并且URL配置正确：

```bash
# 检查Supabase是否可访问
curl http://localhost:54321/rest/v1/
```

### 2. Redis连接问题

检查Redis服务状态：

```bash
docker-compose logs redis
```

### 3. 应用无法启动

查看应用日志：

```bash
docker-compose logs dashboard
```

### 4. 端口冲突

如果3100端口被占用，修改 `docker-compose.yml` 中的端口映射：

```yaml
ports:
  - "3101:3100" # 改为使用3101端口
```

## 开发模式

如果需要在开发模式下运行（支持热重载）：

```bash
# 1. 安装依赖
npm install

# 2. 启动依赖服务（仅Redis）
docker-compose up -d redis

# 3. 启动开发服务器
npm run dev
```

## 生产部署建议

1. **环境变量安全**：生产环境中使用强密码和安全的JWT密钥
2. **HTTPS配置**：生产环境建议配置反向代理（如Nginx）支持HTTPS
3. **数据持久化**：确保Redis数据和Supabase数据正确持久化
4. **监控日志**：配置日志收集和监控系统

## 清理

完全清理Docker资源：

```bash
# 停止并删除容器、网络、镜像和卷
docker-compose down -v --rmi all --remove-orphans

# 清理未使用的Docker资源
docker system prune -a
```
