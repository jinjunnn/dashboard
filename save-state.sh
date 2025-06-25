#!/bin/bash

# 本地项目状态保存脚本
# 使用方法: ./save-state.sh [备份名称]

set -e  # 出错时停止脚本

# 获取当前时间戳
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# 获取备份名称，如果没有提供则使用时间戳
BACKUP_NAME=${1:-"backup_$TIMESTAMP"}

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📦 开始保存项目状态...${NC}"

# 检查是否在git仓库中
if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    echo -e "${RED}❌ 错误: 当前目录不是git仓库${NC}"
    exit 1
fi

# 获取当前分支名
CURRENT_BRANCH=$(git branch --show-current)
echo -e "${YELLOW}📌 当前分支: $CURRENT_BRANCH${NC}"

# 检查是否有未提交的更改
if ! git diff-index --quiet HEAD -- 2>/dev/null; then
    echo -e "${YELLOW}⚠️  检测到未提交的更改，正在暂存...${NC}"
    
    # 添加所有文件（包括新文件）
    git add -A
    
    # 提交当前状态
    git commit -m "保存状态: $BACKUP_NAME - $(date '+%Y-%m-%d %H:%M:%S')" || {
        echo -e "${YELLOW}💡 没有需要提交的更改${NC}"
    }
else
    echo -e "${GREEN}✅ 工作区是干净的${NC}"
fi

# 创建备份分支
BACKUP_BRANCH="backup/$BACKUP_NAME"
echo -e "${BLUE}🌿 创建备份分支: $BACKUP_BRANCH${NC}"

if git show-ref --verify --quiet refs/heads/$BACKUP_BRANCH; then
    echo -e "${YELLOW}⚠️  备份分支已存在，将删除旧分支${NC}"
    git branch -D $BACKUP_BRANCH
fi

# 创建新的备份分支
git checkout -b $BACKUP_BRANCH

# 切换回原分支
git checkout $CURRENT_BRANCH

# 创建标签
TAG_NAME="save-$BACKUP_NAME"
echo -e "${BLUE}🏷️  创建标签: $TAG_NAME${NC}"

if git tag | grep -q "^$TAG_NAME$"; then
    echo -e "${YELLOW}⚠️  标签已存在，将删除旧标签${NC}"
    git tag -d $TAG_NAME
fi

git tag $TAG_NAME $BACKUP_BRANCH

echo -e "${GREEN}✅ 状态保存完成!${NC}"
echo -e "${BLUE}📋 保存信息:${NC}"
echo -e "   🌿 备份分支: $BACKUP_BRANCH"
echo -e "   🏷️  备份标签: $TAG_NAME"
echo -e "   📅 保存时间: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""
echo -e "${YELLOW}💡 恢复方法:${NC}"
echo -e "   1. 使用分支: ${GREEN}git checkout $BACKUP_BRANCH${NC}"
echo -e "   2. 使用标签: ${GREEN}git checkout $TAG_NAME${NC}"
echo -e "   3. 使用脚本: ${GREEN}./restore-state.sh $BACKUP_NAME${NC}"
echo ""
echo -e "${BLUE}📝 查看所有备份: ${GREEN}git branch -a | grep backup${NC}"
echo -e "${BLUE}📝 查看所有标签: ${GREEN}git tag | grep save${NC}" 