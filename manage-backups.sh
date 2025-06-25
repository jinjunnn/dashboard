#!/bin/bash

# 备份管理脚本
# 使用方法: ./manage-backups.sh [list|clean|delete <backup_name>]

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

show_help() {
    echo -e "${BLUE}📋 备份管理脚本${NC}"
    echo ""
    echo -e "${YELLOW}使用方法:${NC}"
    echo -e "  ./manage-backups.sh list           - 列出所有备份"
    echo -e "  ./manage-backups.sh clean          - 清理旧备份（保留最近5个）"
    echo -e "  ./manage-backups.sh delete <name>  - 删除特定备份"
    echo -e "  ./manage-backups.sh help           - 显示帮助"
    echo ""
}

list_backups() {
    echo -e "${BLUE}📁 所有备份列表${NC}"
    echo ""
    
    # 显示备份分支
    echo -e "${YELLOW}🌿 备份分支:${NC}"
    backup_branches=$(git branch -a | grep "backup/" | sed 's/.*backup\///' | sort -r)
    if [ -n "$backup_branches" ]; then
        echo "$backup_branches" | while read branch; do
            # 获取分支的最后提交时间
            commit_date=$(git log -1 --format="%ci" "backup/$branch" 2>/dev/null || echo "未知时间")
            echo -e "  📁 ${GREEN}$branch${NC} (${commit_date})"
        done
    else
        echo -e "  ${YELLOW}无备份分支${NC}"
    fi
    
    echo ""
    
    # 显示备份标签
    echo -e "${YELLOW}🏷️  备份标签:${NC}"
    backup_tags=$(git tag | grep "^save-" | sed 's/save-//' | sort -r)
    if [ -n "$backup_tags" ]; then
        echo "$backup_tags" | while read tag; do
            # 获取标签的创建时间
            tag_date=$(git log -1 --format="%ci" "save-$tag" 2>/dev/null || echo "未知时间")
            echo -e "  🏷️  ${GREEN}$tag${NC} (${tag_date})"
        done
    else
        echo -e "  ${YELLOW}无备份标签${NC}"
    fi
    
    echo ""
    echo -e "${BLUE}💾 存储统计:${NC}"
    backup_count=$(git branch | grep "backup/" | wc -l)
    tag_count=$(git tag | grep "^save-" | wc -l)
    echo -e "  分支数量: ${GREEN}$backup_count${NC}"
    echo -e "  标签数量: ${GREEN}$tag_count${NC}"
}

clean_old_backups() {
    echo -e "${BLUE}🧹 清理旧备份（保留最近5个）...${NC}"
    
    # 清理旧的备份分支
    echo -e "${YELLOW}清理备份分支...${NC}"
    old_branches=$(git branch | grep "backup/" | sed 's/.*backup\///' | sort -r | tail -n +6)
    if [ -n "$old_branches" ]; then
        echo "$old_branches" | while read branch; do
            echo -e "  删除分支: ${RED}backup/$branch${NC}"
            git branch -D "backup/$branch" >/dev/null 2>&1 || true
        done
    else
        echo -e "  ${GREEN}无需清理分支${NC}"
    fi
    
    # 清理旧的备份标签
    echo -e "${YELLOW}清理备份标签...${NC}"
    old_tags=$(git tag | grep "^save-" | sed 's/save-//' | sort -r | tail -n +6)
    if [ -n "$old_tags" ]; then
        echo "$old_tags" | while read tag; do
            echo -e "  删除标签: ${RED}save-$tag${NC}"
            git tag -d "save-$tag" >/dev/null 2>&1 || true
        done
    else
        echo -e "  ${GREEN}无需清理标签${NC}"
    fi
    
    echo -e "${GREEN}✅ 清理完成${NC}"
}

delete_backup() {
    if [ -z "$1" ]; then
        echo -e "${RED}❌ 错误: 请提供要删除的备份名称${NC}"
        return 1
    fi
    
    BACKUP_NAME="$1"
    BACKUP_BRANCH="backup/$BACKUP_NAME"
    TAG_NAME="save-$BACKUP_NAME"
    
    echo -e "${YELLOW}⚠️  确认删除备份: $BACKUP_NAME${NC}"
    
    # 检查备份是否存在
    branch_exists=$(git branch | grep "backup/$BACKUP_NAME" || true)
    tag_exists=$(git tag | grep "^save-$BACKUP_NAME$" || true)
    
    if [ -z "$branch_exists" ] && [ -z "$tag_exists" ]; then
        echo -e "${RED}❌ 备份不存在: $BACKUP_NAME${NC}"
        return 1
    fi
    
    read -p "确认删除? (y/N): " confirm
    if [[ $confirm =~ ^[Yy]$ ]]; then
        # 删除分支
        if [ -n "$branch_exists" ]; then
            git branch -D "$BACKUP_BRANCH" >/dev/null 2>&1 && \
                echo -e "${GREEN}✅ 已删除分支: $BACKUP_BRANCH${NC}" || \
                echo -e "${RED}❌ 删除分支失败: $BACKUP_BRANCH${NC}"
        fi
        
        # 删除标签
        if [ -n "$tag_exists" ]; then
            git tag -d "$TAG_NAME" >/dev/null 2>&1 && \
                echo -e "${GREEN}✅ 已删除标签: $TAG_NAME${NC}" || \
                echo -e "${RED}❌ 删除标签失败: $TAG_NAME${NC}"
        fi
        
        echo -e "${GREEN}✅ 备份删除完成${NC}"
    else
        echo -e "${YELLOW}取消删除操作${NC}"
    fi
}

# 检查是否在git仓库中
if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    echo -e "${RED}❌ 错误: 当前目录不是git仓库${NC}"
    exit 1
fi

# 处理命令行参数
case "${1:-list}" in
    "list"|"ls")
        list_backups
        ;;
    "clean")
        clean_old_backups
        ;;
    "delete"|"del"|"rm")
        delete_backup "$2"
        ;;
    "help"|"-h"|"--help")
        show_help
        ;;
    *)
        echo -e "${RED}❌ 未知命令: $1${NC}"
        show_help
        exit 1
        ;;
esac 