---
title: 项目文档中心
description: 股票分析与交易系统完整文档导航
version: 1.0.0
last_updated: 2024-12-19
tags: [documentation, navigation, guide]
---

# 📚 股票分析与交易系统 - 文档中心

## 🎯 文档概览

欢迎来到股票分析与交易系统的文档中心！这里包含了项目的完整技术文档，按功能模块进行分类组织。

## 📁 文档目录结构

```
docs/
├── api/                    # API文档
│   ├── endpoints/         # API端点文档
│   ├── schemas/           # 数据结构文档  
│   └── authentication/   # 认证相关文档
├── development/           # 开发文档
│   ├── setup/            # 环境搭建
│   ├── guidelines/       # 开发指南
│   └── troubleshooting/  # 问题排查
├── deployment/           # 部署文档
│   ├── docker/           # Docker部署
│   ├── production/       # 生产环境
│   └── monitoring/       # 监控配置
├── architecture/         # 架构文档
│   ├── database/         # 数据库设计
│   ├── frontend/         # 前端架构
│   └── backend/          # 后端架构
└── user-guides/          # 用户指南
    ├── features/         # 功能说明
    └── tutorials/        # 使用教程
```

## 🚀 快速导航

### 👨‍💻 开发者文档
- **[开发环境搭建](development/setup/)** - 如何配置本地开发环境
- **[开发指南](development/guidelines/)** - 编码规范和最佳实践
- **[问题排查](development/troubleshooting/)** - 常见问题解决方案

### 🏗️ 架构设计
- **[数据库设计](architecture/database/)** - 数据库schema和关系设计
- **[前端架构](architecture/frontend/)** - React/Next.js架构设计
- **[后端架构](architecture/backend/)** - Supabase集成和API设计

### 🔌 API接口
- **[API端点](api/endpoints/)** - 所有API端点的详细文档
- **[数据结构](api/schemas/)** - 请求和响应的数据格式
- **[认证系统](api/authentication/)** - 身份验证和授权机制

### 🚀 部署运维
- **[Docker部署](deployment/docker/)** - 容器化部署方案
- **[生产环境](deployment/production/)** - 生产环境配置指南
- **[监控配置](deployment/monitoring/)** - 性能监控和日志系统

### 👥 用户指南
- **[功能说明](user-guides/features/)** - 各功能模块的使用说明
- **[使用教程](user-guides/tutorials/)** - 分步骤操作教程

## 📖 现有文档

### 当前已有文档
以下文档已经存在，将逐步迁移到新的目录结构中：

1. **[数据库设置](database-setup.md)** → 将迁移到 `architecture/database/`
2. **[开发问题排查](development-troubleshooting.md)** → 将迁移到 `development/troubleshooting/`
3. **[实时信号](realtime-signals.md)** → 将迁移到 `user-guides/features/`
4. **[解决方案总结](solution-summary.md)** → 将迁移到 `architecture/`
5. **[Supabase架构](supabase-architecture.md)** → 将迁移到 `architecture/backend/`

## 🤖 文档自动生成

### AI助手文档生成
根据 [文档生成指南](../.cursor/rules/docs_generation_guide.mdc)，AI助手会在以下情况自动生成文档：

1. **新增API端点** → 自动生成到 `api/endpoints/`
2. **数据库schema变更** → 更新 `architecture/database/`
3. **新增功能组件** → 生成到 `development/guidelines/`
4. **部署配置变更** → 更新 `deployment/`

### 文档模板
所有自动生成的文档都使用标准模板，确保格式一致性和信息完整性。

## 📋 文档维护规范

### 文档更新原则
1. **及时性** - 代码变更时同步更新相关文档
2. **准确性** - 确保文档内容与实际实现一致
3. **完整性** - 覆盖所有必要的使用信息
4. **可读性** - 使用清晰的结构和表达

### 贡献指南
如果您发现文档问题或需要添加新内容：
1. 查看 [文档生成指南](../.cursor/rules/docs_generation_guide.mdc)
2. 遵循标准模板格式
3. 确保链接和引用正确
4. 提交变更并更新版本信息

## 🔗 相关链接

- **[项目开发规范](../.cursorrules)** - 核心开发规则
- **[前端开发指南](../.cursor/rules/frontend_development_guide.mdc)** - 前端特有开发流程
- **[所有规则文档](../.cursor/rules/help.mdc)** - 完整规则导航

---

## 📞 支持与反馈

如果您在使用文档过程中遇到问题，或者有改进建议，请：
1. 检查相关的开发规范文档
2. 查看问题排查指南
3. 向开发团队反馈具体问题

**文档是项目的重要组成部分，让我们一起维护好这个知识库！** 