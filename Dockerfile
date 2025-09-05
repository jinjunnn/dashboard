# 使用官方 Node.js 20 runtime 作为基础镜像
FROM node:20-alpine AS base

# 安装依赖项阶段
FROM base AS deps
# 检查 https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine 以了解为什么可能需要 libc6-compat
RUN apk add --no-cache libc6-compat
WORKDIR /app

# 安装依赖项
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# 重建源代码阶段
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 为生产环境构建应用程序
RUN npm run build

# 生产镜像，复制所有文件并运行 next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# 设置正确的权限以启用预渲染缓存
RUN mkdir .next
RUN chown nextjs:nodejs .next

# 自动利用输出跟踪来减少图像大小
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3100

ENV PORT 3100
ENV HOSTNAME "0.0.0.0"

# 服务器.js 是使用独立输出创建的
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["node", "server.js"] 