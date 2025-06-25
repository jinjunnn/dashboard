#!/bin/bash

# 本地项目状态恢复脚本
# 使用方法: ./restore-state.sh [备份名称]

set -e  # 出错时停止脚本

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔄 开始恢复项目状态...${NC}"

# 检查是否在git仓库中
if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    echo -e "${RED}❌ 错误: 当前目录不是git仓库${NC}"
    exit 1
fi

# 如果没有提供备份名称，显示可用的备份
if [ -z "$1" ]; then
    echo -e "${YELLOW}🗂️  可用的备份:${NC}"
    echo ""
    echo -e "${BLUE}备份分支:${NC}"
    git branch -a | grep "backup/" | sed 's/.*backup\//  📁 /' || echo "  无备份分支"
    echo ""
    echo -e "${BLUE}备份标签:${NC}"
    git tag | grep "^save-" | sed 's/save-/  🏷️  /' || echo "  无备份标签"
    echo ""
    echo -e "${YELLOW}💡 使用方法: ./restore-state.sh <备份名称>${NC}"
    echo -e "${YELLOW}💡 示例: ./restore-state.sh backup_20241208_143022${NC}"
    exit 0
fi

BACKUP_NAME="$1"
BACKUP_BRANCH="backup/$BACKUP_NAME"
TAG_NAME="save-$BACKUP_NAME"

# 获取当前分支名
CURRENT_BRANCH=$(git branch --show-current)
echo -e "${YELLOW}📌 当前分支: $CURRENT_BRANCH${NC}"

# 检查工作区状态
if ! git diff-index --quiet HEAD -- 2>/dev/null; then
    echo -e "${RED}⚠️  警告: 工作区有未提交的更改!${NC}"
    echo -e "${YELLOW}请选择操作:${NC}"
    echo -e "  1. 保存当前更改并继续恢复"
    echo -e "  2. 丢弃当前更改并继续恢复"
    echo -e "  3. 取消恢复操作"
    
    read -p "请输入选择 (1/2/3): " choice
    
    case $choice in
        1)
            echo -e "${BLUE}💾 保存当前更改...${NC}"
            ./save-state.sh "before-restore-$(date +%Y%m%d_%H%M%S)"
            ;;
        2)
            echo -e "${YELLOW}⚠️  丢弃当前更改...${NC}"
            git reset --hard HEAD
            git clean -fd
            ;;
        3)
            echo -e "${GREEN}✅ 取消恢复操作${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}❌ 无效选择，取消操作${NC}"
            exit 1
            ;;
    esac
fi

# 尝试恢复（优先使用分支，然后是标签）
RESTORED=false

# 检查备份分支是否存在
if git show-ref --verify --quiet refs/heads/$BACKUP_BRANCH; then
    echo -e "${BLUE}🌿 从备份分支恢复: $BACKUP_BRANCH${NC}"
    git checkout $BACKUP_BRANCH
    
    # 创建一个新的工作分支
    RESTORE_BRANCH="restored-from-$BACKUP_NAME-$(date +%Y%m%d_%H%M%S)"
    git checkout -b $RESTORE_BRANCH
    
    echo -e "${GREEN}✅ 已创建恢复分支: $RESTORE_BRANCH${NC}"
    RESTORED=true
    
elif git tag | grep -q "^$TAG_NAME$"; then
    echo -e "${BLUE}🏷️  从备份标签恢复: $TAG_NAME${NC}"
    git checkout $TAG_NAME
    
    # 创建一个新的工作分支
    RESTORE_BRANCH="restored-from-$BACKUP_NAME-$(date +%Y%m%d_%H%M%S)"
    git checkout -b $RESTORE_BRANCH
    
    echo -e "${GREEN}✅ 已创建恢复分支: $RESTORE_BRANCH${NC}"
    RESTORED=true
else
    echo -e "${RED}❌ 错误: 找不到备份 '$BACKUP_NAME'${NC}"
    echo -e "${YELLOW}💡 请检查备份名称是否正确${NC}"
    echo -e "${YELLOW}💡 运行 './restore-state.sh' 查看所有可用备份${NC}"
    exit 1
fi

if [ "$RESTORED" = true ]; then
    echo -e "${GREEN}✅ 状态恢复完成!${NC}"
    echo -e "${BLUE}📋 恢复信息:${NC}"
    echo -e "   📂 当前分支: $RESTORE_BRANCH"
    echo -e "   🔄 恢复自: $BACKUP_NAME"
    echo -e "   📅 恢复时间: $(date '+%Y-%m-%d %H:%M:%S')"
    echo ""
    echo -e "${YELLOW}💡 下一步操作:${NC}"
    echo -e "   1. 查看恢复的代码: ${GREEN}git log --oneline -5${NC}"
    echo -e "   2. 如果满意，可以合并到主分支: ${GREEN}git checkout main && git merge $RESTORE_BRANCH${NC}"
    echo -e "   3. 删除恢复分支: ${GREEN}git branch -d $RESTORE_BRANCH${NC}"
    echo ""
    echo -e "${BLUE}📝 当前项目状态已恢复到备份点${NC}"
fi 