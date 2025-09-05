# Docker 部署环境变量配置指南

## 必需配置的环境变量

由于你已经有运行中的Supabase实例，你需要配置以下环境变量才能让Dashboard正常连接：

### 1. 获取Supabase配置信息

#### 方法1: 从Supabase Studio获取

1. 访问你的Supabase Studio: http://localhost:54323
2. 进入项目设置 → API 设置
3. 复制以下信息：
   - **URL**: `http://localhost:54321`
   - **anon/public key**: 匿名密钥
   - **service_role key**: 服务角色密钥（具有管理员权限）

#### 方法2: 从Docker容器日志获取

```bash
# 查看Supabase Kong容器的配置
docker logs supabase_kong_impharaonjin 2>&1 | grep -E "(anon|service_role)"

# 或查看auth容器配置
docker logs supabase_auth_impharaonjin 2>&1 | grep -E "JWT"
```

#### 方法3: 检查现有配置文件

如果你之前配置过本地开发环境，检查以下位置：

```bash
# 可能的配置文件位置
ls -la ~/.config/supabase/
cat ~/.config/supabase/config.toml
```

### 2. 配置环境变量

创建或更新你的 `.env.local` 文件：

```bash
# 复制示例配置
cp env.example .env.local
```

然后编辑 `.env.local` 文件，至少配置以下变量：

```bash
# 基础配置
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3100

# Supabase 配置 (本地开发) - 必须配置
NEXT_PUBLIC_SUPABASE_LOCAL_URL=http://localhost:54321
SUPABASE_LOCAL_SERVICE_ROLE_KEY=你的服务角色密钥
NEXT_PUBLIC_SUPABASE_LOCAL_ANON_KEY=你的匿名密钥

# Redis 配置 (连接到现有Redis)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT 配置 (可以使用默认值)
JWT_SECRET=secure-jwt-secret-for-development
NEXTAUTH_SECRET=secure-nextauth-secret-for-development
NEXTAUTH_URL=http://localhost:3100
```

### 3. 验证配置

配置完成后，可以用以下命令验证Supabase连接：

```bash
# 测试REST API
curl -H "apikey: 你的匿名密钥" \
     -H "Authorization: Bearer 你的匿名密钥" \
     http://localhost:54321/rest/v1/

# 应该返回类似这样的响应: {"hint":"No tables defined","message":"..."...}
```

## 快速部署命令

配置完环境变量后，运行以下命令部署到Docker：

```bash
# 使用专门的部署脚本 (推荐)
./deploy-to-docker.sh

# 或手动部署
docker-compose up -d --build dashboard
```

## 常见问题解决

### Q: 找不到Supabase密钥

**A**: 尝试以下命令查找：

```bash
# 查看所有Supabase相关容器的环境变量
docker inspect $(docker ps --filter "name=supabase" -q) | grep -E "(ANON|SERVICE_ROLE|JWT)"
```

### Q: 连接Supabase失败

**A**: 检查URL配置，在Docker内部使用 `host.docker.internal:54321`

### Q: Redis连接失败

**A**: 确保Redis容器正在运行：

```bash
docker ps | grep redis
```

## 下一步

配置完成后：

1. 运行 `./deploy-to-docker.sh` 部署应用
2. 访问 http://localhost:3100 查看应用
3. 查看日志：`docker-compose logs -f dashboard`
