# 项目备份脚本使用说明

本项目包含三个用于本地项目状态管理的脚本，可以快速保存和恢复项目状态。

## 📋 脚本文件

- `save-state.sh` - 保存当前项目状态
- `restore-state.sh` - 恢复项目状态  
- `manage-backups.sh` - 管理备份文件

## 🚀 快速开始

### 1. 保存当前状态

```bash
# 自动生成备份名称（使用时间戳）
./save-state.sh

# 使用自定义备份名称
./save-state.sh "stable-version"
./save-state.sh "before-refactor"
./save-state.sh "working-state"
```

### 2. 查看所有备份

```bash
# 列出所有可用备份
./manage-backups.sh list

# 或直接运行恢复脚本查看
./restore-state.sh
```

### 3. 恢复到某个状态

```bash
# 恢复到指定备份
./restore-state.sh "stable-version"
./restore-state.sh "backup_20241208_143022"
```

### 4. 管理备份

```bash
# 清理旧备份（保留最近5个）
./manage-backups.sh clean

# 删除特定备份
./manage-backups.sh delete "old-backup"

# 查看帮助
./manage-backups.sh help
```

## 📖 详细说明

### save-state.sh

**功能**: 保存当前项目状态到本地git仓库

**特性**:
- 自动检测并提交未暂存的更改
- 创建备份分支和标签
- 支持自定义备份名称
- 彩色输出，清晰的状态反馈

**使用场景**:
- 开始新功能开发前
- 重大重构前
- 测试新功能前
- 任何不确定的代码修改前

### restore-state.sh

**功能**: 恢复到之前保存的项目状态

**特性**:
- 列出所有可用备份
- 安全检查当前工作区状态
- 自动创建恢复分支，不影响原分支
- 支持从备份分支或标签恢复

**安全机制**:
- 如果工作区有未提交更改，提供选项：
  1. 保存当前更改并继续恢复
  2. 丢弃当前更改并继续恢复
  3. 取消恢复操作

### manage-backups.sh

**功能**: 管理本地备份文件

**命令**:
- `list` - 显示所有备份及其创建时间
- `clean` - 清理旧备份（保留最近5个）
- `delete <name>` - 删除指定备份
- `help` - 显示帮助信息

## 🎯 最佳实践

### 1. 备份时机
```bash
# 开始新功能前
./save-state.sh "before-feature-authentication"

# 重构代码前
./save-state.sh "before-refactor-$(date +%Y%m%d)"

# 测试危险操作前
./save-state.sh "stable-working-state"
```

### 2. 命名规范
建议使用描述性的备份名称：
- `stable-v1.0` - 稳定版本
- `before-database-migration` - 数据库迁移前
- `working-signals-feature` - 信号功能工作版本
- `backup-$(date +%Y%m%d)` - 日期备份

### 3. 定期清理
```bash
# 每周清理一次旧备份
./manage-backups.sh clean
```

### 4. 恢复工作流
```bash
# 1. 查看可用备份
./restore-state.sh

# 2. 恢复到目标状态
./restore-state.sh "stable-version"

# 3. 检查恢复结果
git log --oneline -5

# 4. 如果满意，合并到主分支
git checkout main
git merge restored-from-stable-version-20241208_143022

# 5. 清理恢复分支
git branch -d restored-from-stable-version-20241208_143022
```

## 📂 备份存储结构

```
.git/
├── refs/heads/
│   ├── main                    # 主分支
│   ├── backup/stable-v1.0      # 备份分支
│   ├── backup/before-refactor  # 备份分支
│   └── restored-from-*         # 恢复分支（临时）
└── refs/tags/
    ├── save-stable-v1.0        # 备份标签
    └── save-before-refactor    # 备份标签
```

## ⚠️ 注意事项

1. **仅本地备份**: 这些脚本只在本地git仓库中创建备份，不会推送到远程仓库
2. **工作区检查**: 恢复前会检查工作区状态，确保不丢失未提交的更改
3. **分支管理**: 恢复操作会创建新分支，需要手动合并到目标分支
4. **存储空间**: 定期使用 `./manage-backups.sh clean` 清理旧备份

## 🆘 故障排除

### 问题1: 脚本没有执行权限
```bash
chmod +x save-state.sh restore-state.sh manage-backups.sh
```

### 问题2: 不在git仓库中
确保在项目根目录执行脚本，且该目录是git仓库。

### 问题3: 恢复后代码不是期望的状态
```bash
# 查看当前分支的提交历史
git log --oneline -10

# 查看所有备份
./manage-backups.sh list

# 尝试恢复到其他备份
./restore-state.sh "other-backup-name"
```

### 问题4: 备份分支或标签已存在
脚本会自动处理重名情况，删除旧的备份并创建新的。

## 📞 支持

如果遇到问题，可以：
1. 查看脚本的详细输出信息
2. 运行 `git status` 检查仓库状态
3. 运行 `./manage-backups.sh list` 查看备份状态 