# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 额外强制性开发要求

1. 除非用户明确指定，**禁止编写example示例代码**。
2. 除非用户明确指示，**禁止编写README文档**。
3. 测试应**优先在CLI中直接执行**，而不是先写复杂的测试文档再执行。
4. 只有在用户明确要求编写测试文档时，才允许编写测试文档并据此进行测试。
5. **禁止修改 `/tmp` 目录下的临时文件和测试文件**，这些文件不是核心业务代码，只专注于修改核心业务逻辑代码。

## ⚠️ 绝对强制性禁令

**🚫 绝对禁止任何形式的向后兼容性代码 🚫**

- **严格禁止**任何向后兼容的代码、注释、或设计
- **严格禁止**保留旧接口、旧方法、旧变量名
- **严格禁止**使用"向后兼容"、"compatibility"、"legacy"等术语
- **严格禁止**创建过渡性代码或临时兼容方案
- **必须直接删除**旧代码，使用新标准接口
- **必须彻底重构**，不允许任何妥协或折中方案

**违反此禁令将被视为严重错误！**

## Code Development Standards

**所有代码修改必须遵循现代软件开发标准：**

### 核心原则
1. **单一职责原则 (Single Responsibility Principle)**
   - 每个类、方法只负责一个功能
   - 避免god class和超大方法
   - 功能清晰，职责明确

2. **关注点分离 (Separation of Concerns)**
   - 业务逻辑与数据持久化分离
   - 计算逻辑与表示逻辑分离
   - 配置与实现分离

3. **统一职责原则**
   - 同一个职责由同一个方法/类维护
   - 避免功能重复实现
   - 统一入口，统一管理

4. **现代化重构原则**
   - **在原代码基础上优化升级**，不创建Enhanced/V2版本
   - **不做向后兼容**，彻底重构旧代码
   - **删除冗余代码**，保持架构简洁
   - **统一接口**，避免多套API并存

### 禁止行为
- ❌ 创建Enhanced、V2、Legacy等多版本并存
- ❌ **绝对禁止任何向后兼容的冗余代码**
- ❌ 同一功能多处实现
- ❌ 复杂的优先级判断逻辑
- ❌ 重复的计算和评分逻辑
- ❌ 绕过问题找解决方案，必须直面问题根本原因
- ❌ 编写简化版本或示例代码，必须修改实际业务代码
- ❌ **绝对禁止编写任何向后兼容代码，必须直接使用新标准接口**
- ❌ **绝对禁止保留旧接口、旧方法名、旧变量名**

### 必须行为
- ✅ 直接修改原有代码，彻底重构
- ✅ 统一入口和统一管理
- ✅ 清晰的职责分工
- ✅ 简洁的架构设计
- ✅ 删除所有冗余逻辑
- ✅ 严格使用新标准，杜绝向后兼容
- ✅ 彻底解决问题，不绕过或简化

## Important Changelog Update Rule

**完成任何编码任务后，必须直接更新 `changelog.md`：**

1. **直接编辑 changelog.md 文件**：
   - 读取当前 `changelog.md` 的最新版本号（如 `1.2.7`），将最后一位数字加1（如变为 `1.2.8`）
   - 在文件顶部插入新版本条目，使用**完整格式**包含主要变更和技术细节
   - **禁止创建Python脚本来修改changelog**，必须直接编辑文件

2. **Changelog标准格式要求**：
```markdown
## [x.x.x] - YYYY-MM-DD：📝 简要描述（使用合适的emoji）

### 主要变更
- **核心改进点1**: 详细描述变更内容和影响
- **核心改进点2**: 详细描述变更内容和影响
- **核心改进点3**: 详细描述变更内容和影响

### 技术细节
- **文件1**: 具体技术实现细节，参数配置，架构变更等
- **文件2**: 具体技术实现细节，参数配置，架构变更等
- **其他**: 性能优化、兼容性、测试覆盖等技术说明
```

3. **版本号递增规则**：
   - 补丁版本（第三位）：bug修复、小优化、重构
   - 小版本（第二位）：新功能、API更改  
   - 大版本（第一位）：重大架构变更

4. **Emoji使用标准**：
   - 🚀 新功能和重大升级
   - 🔧 优化和改进  
   - 🐛 Bug修复
   - ✅ 完成任务和测试
   - 📝 文档更新
   - 🎯 性能优化
   - 🔒 安全相关

## Common Development Commands

### Application Management
```bash
# Start the main FastAPI application
python app.py

# Start the orchestrator (coordinates all system components)
python orchestrator.py

# Run with Docker Compose (recommended for development)
docker-compose up -d

# Quick deployment
./quick_deploy.sh

# Build and deploy with fresh base image
./rebuild_dockerbase_and_deploy.sh
```

### Database Operations
The system uses 5 databases with specific testing patterns defined in GEMINI.md:

**IMPORTANT: Database Separation**
- **Main PostgreSQL Database**: `postgresql://postgres:qadkaq-zegxyc-Xeqme3@localhost:5432/stocks` (legacy tables)
- **Supabase Database**: `http://192.168.18.10:54321` (factors, stock tables with time_key fields)
  - URL: `SUPABASE_URL_NETWORK=http://192.168.18.10:54321`
  - Key: `SUPABASE_SERVICE_ROLE_KEY_NETWORK=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU`
  - PostgreSQL Direct: `postgresql://postgrest:qadkaq-zegxyc-Xeqme3@192.168.18.10:54322/postgres`

```bash
# Main PostgreSQL connection test  
psql "postgresql://postgres:qadkaq-zegxyc-Xeqme3@localhost:5432/stocks" -c "\conninfo"

# Supabase PostgreSQL connection test (port 54322 for direct DB access)
psql "postgresql://postgres:postgres@127.0.0.1:54322/postgres" -c "\conninfo"

# MongoDB connection test  
mongosh "mongodb://admin:pixdow-2padVi-qewguk@localhost:27017/mongo_db?authSource=admin"

# MongoDB data queries
mongosh "mongodb://admin:pixdow-2padVi-qewguk@localhost:27017/mongo_db?authSource=admin" --eval "db.atomic_knowledge.find({}).limit(5).pretty()"
mongosh "mongodb://admin:pixdow-2padVi-qewguk@localhost:27017/mongo_db?authSource=admin" --eval "db.atomic_knowledge.find({content: /breakout/i}).pretty()"
mongosh "mongodb://admin:pixdow-2padVi-qewguk@localhost:27017/mongo_db?authSource=admin" --eval "db.atomic_knowledge.find({tags: 'breakout_strategy'}).pretty()"

# Redis operations
redis-cli -a "your_password_here"
redis-cli KEYS "*"

# Qdrant vector database (via curl)
curl -X GET "http://localhost:6333/collections" -H "api-key: bUjqem-8wyhpi-kejcuw" | jq '.'

# Qdrant data queries
curl -X POST "http://localhost:6333/collections/memory/points/search" \
  -H "api-key: bUjqem-8wyhpi-kejcuw" \
  -H "Content-Type: application/json" \
  -d '{"vector": [0.1, 0.2, 0.3], "limit": 10}' | jq '.'
  
curl -X POST "http://localhost:6333/collections/memory/points/scroll" \
  -H "api-key: bUjqem-8wyhpi-kejcuw" \
  -H "Content-Type: application/json" \
  -d '{"filter": {"must": [{"key": "tags", "match": {"value": "breakout"}}]}, "limit": 100}' | jq '.'
```

### Python Testing
```bash
# CLI testing pattern for functions
python -c "
import asyncio
from models.postgres_model import User, create_record
async def test():
    print('Test logic executed')
asyncio.run(test())
"

# Syntax and import validation
python -m py_compile <file>
python -c "import <module>"
```

### Scheduled Tasks
```bash
# Run specific schedulers
python scripts/scheduled_tasks/okx_scheduler.py
python scripts/scheduled_tasks/signal_engine_scheduler.py
python scripts/scheduled_tasks/eod_snapshot_scheduler.py
python scripts/scheduled_tasks/snapshot_scheduler.py
```

### Risk Center Testing
```bash
# Risk Engine basic testing
python -c "
from services.risk_center.core.risk_engine import RiskEngine
from services.risk_center.core.redis_state_manager import get_state_manager
from schemas.signal_schema import Signal, Priority, RiskLevel, SignalDirection

# Create risk engine
state_manager = get_state_manager()
risk_engine = RiskEngine(state_manager)

# Create test signal
signal = Signal(
    id='test_001',
    symbol='000001.SZ',
    signal_type='breakout',
    direction=SignalDirection.BULLISH,
    price=15.50,
    confidence=0.85,
    score=0.80,
    priority=Priority.HIGH,
    risk_level=RiskLevel.MEDIUM
)

# Execute risk decision
decision = risk_engine.evaluate_signal_with_context(
    signal, 'breakout_strategy', 1000000.0
)

print(f'Decision: {decision.result}')
if decision.result == 'PASS':
    print(f'Approved amount: {decision.approved_amount}')
    print(f'Approved quantity: {decision.approved_quantity}')
else:
    print(f'Reject reason: {decision.reject_reason}')
"

# Redis state queries
python -c "
from services.risk_center.core.redis_state_manager import get_state_manager

state_manager = get_state_manager()

# Query strategy exposure
exposure = state_manager.get_strategy_exposure('breakout_strategy')
print(f'Strategy exposure: {exposure}')

# Query daily count
count = state_manager.get_daily_buy_count('breakout_strategy')
print(f'Daily buy count: {count}')

# Query total exposure
total = state_manager.get_total_exposure()
print(f'Total exposure: {total}')
"

# Configuration management
python -c "
from services.risk_center.core.config_manager import get_config_manager

config_manager = get_config_manager()
result = config_manager.reload_config()
print(f'Config reload: {result.success}')
if result.errors:
    print(f'Config errors: {result.errors}')
"

# Risk Center comprehensive testing
python tmp/test_risk_center_integration.py
python tmp/test_redis_concurrency.py  
python tmp/test_config_loading.py
```

### Audit service testing
```bash
python -c "
from services.risk_center.services.audit_service import get_audit_service
from datetime import datetime, timedelta

audit_service = get_audit_service()

# Query recent decision logs
end_time = datetime.now()
start_time = end_time - timedelta(hours=24)
logs = audit_service.query_decision_logs(
    start_time=start_time,
    end_time=end_time,
    limit=10
)
print(f'Found {len(logs)} decision logs in last 24 hours')

# Get audit statistics
stats = audit_service.get_audit_statistics(
    start_time=start_time,
    end_time=end_time
)
print(f'Audit stats: {stats}')
"
```

## Architecture Overview

### System Design
This is a **FastAPI-based stock analysis and trading system** with sophisticated multi-database architecture, AI-powered analysis, and event-driven quantitative trading capabilities.

**Core Pattern**: Orchestrator-based coordination with event-driven architecture using `utils.eventbus`.

### Multi-Database Architecture
- **PostgreSQL** - Primary relational data, user management, billing
- **MongoDB** - Analysis results, unstructured trading data  
- **Redis** - Caching, real-time state, time-series data, pub/sub messaging
- **Neo4j** - Relationship graphs, ICT pattern analysis
- **Qdrant** - Vector embeddings for AI analysis

### Key Service Modules

#### AI Analysis Framework (`aigo/`)
Multi-agent architecture with specialized components:
- **Intent Recognition Agent** - Routes user queries to appropriate handlers
- **Stock Analysis Agents** - Deep/general analysis with preprocessing
- **DB Agents** - Coordinator pattern for multi-database operations
- **Framework Components**: Conversation graphs, thinking workflows, ReAct agents
- **Template System**: JSON/YAML-based prompt management with dynamic generation

#### Quantitative Trading (`services/quants/`)
Strategy-based architecture with Redis state management:
- **Base Strategy Class** with confidence scoring and event tracking
- **Concrete Strategies**: Breakout, Bull Run, Realtime Breakout, Trend Pullback
- **Workflow Engine**: Node-based processing (advice → analyze → decision → trade)
- **Top-K Ranking System** for signal filtering and prioritization

#### Signal Detection (`services/signals/` + `signals/`)
Two-tier system:
- **Legacy System** (`signals/`) - Individual signal implementations (MSS, BOS, OB, FVG, SSL)
- **New System v2.0** (`services/signals/`) - Plugin architecture with configuration management, smart caching, event-driven processing

#### Risk Center (`services/risk_center/`) - 🆕 全新项目
**核心原则**: 全新代码架构，不需要向后兼容，采用现代化设计模式

Unified risk management and position control system:
- **Risk Engine**: Multi-layered risk checks with P95 < 100ms decision time
- **Position Manager**: Complete position lifecycle management (open/add/reduce/close)
- **Signal-Priority Management**: Four-tier priority system (URGENT/HIGH/MEDIUM/LOW) with differentiated quotas
- **Redis State Manager**: Atomic operations for real-time exposure tracking
- **Audit Service**: Complete decision traceability with Supabase storage
- **统一信号集成**: 标准化接口支持多系统信号入口（quants/digital_currencies/signal_engine）

**架构特点**:
- 📍 **全新项目**: 无历史包袱，采用最新设计模式和最佳实践
- 🔄 **统一信号模型**: 使用`schemas/signal_schema.py`统一所有信号数据结构
- 🎯 **直接导入对接**: services内部直接import，无需HTTP接口
- ⚡ **高性能设计**: P95决策时间<100ms，Redis原子操作
- 🛡️ **完整风控链**: 信号评估→仓位管理→风险控制→审计追踪

#### Digital Currencies (`services/digital_currencies/`)
数字货币交易系统:
- **Crypto Signal Generator**: 基于ICT分析的信号生成系统
- **Strategy Framework**: 继承BaseStrategy的数字货币策略基类
- **Multi-timeframe Analysis**: 支持15M/30M/1H等多时间级别分析
- **Discord Integration**: 自动信号推送和通知系统

#### Signal Tracker (`services/signal_tracker/`) - 🆕 全新服务
**核心功能**: 监控已生成信号，识别执行机会

完整交易生命周期监控:
- **建仓机会**: 兑现交易机会 (REALIZATION)
- **加仓机会**: 加仓交易机会 (ADDITION) 
- **二次入场**: 策略的第二买点交易机会 (SECONDARY_ENTRY)
- **减仓管理**: 减仓交易机会, 止盈交易机会, 止损交易机会
- **退出管理**: 全部平仓交易机会, 紧急退出交易机会
- **调整管理**: 策略调整交易机会, 风险管理交易机会

**架构特点**:
- 📍 **服务内组件**: 非独立微服务，集成在整体services架构中
- 🚫 **无独立API**: 不提供FastAPI端点，不使用app.py/Docker等微服务组件
- 🔄 **多维配置**: [策略×风险等级×优先级×监控类型]四维配置矩阵
- 🎯 **插件化Tracker**: 可插拔监控执行器(价格突破、成交量异动、均线交叉等)
- ⚡ **Risk Center集成**: 直接import对接，使用原生数据类和接口

**重要开发约束**:
- ❌ 禁止添加app.py, requirements.txt, Dockerfile等微服务部署文件
- ❌ 禁止创建FastAPI路由和API端点
- ❌ 禁止添加Docker相关配置
- ✅ 只开发核心业务逻辑组件和服务类

### API Structure
Domain-driven route organization:
- `/stock` - Core stock data and analysis results
- `/analysis` - AI-powered analysis endpoints  
- `/quant` - Quantitative strategies and signals
- `/risk` - Risk management and position control endpoints
- `/market` - Market data and news
- `/mcp` - Model Context Protocol integration
- `/billing` - Usage tracking and cost management

### Event-Driven Workflows

**Real-time Trading Pipeline**:
1. Data Ingestion → Redis time-series
2. Signal Detection → Parallel analyzers  
3. Strategy Evaluation → Quantitative processing
4. Risk Control → Multi-layer risk checks and position sizing
5. AI Analysis → LLM-powered decision making
6. Trade Execution → Position management and execution
7. Event Tracking → Comprehensive analytics and audit trails

**AI Analysis Workflow**:
1. Intent Recognition → Route to appropriate agents
2. Multi-database Coordination → Context retrieval
3. Template Processing → Dynamic prompt generation
4. LLM Chain Reasoning → Validation and confidence scoring
5. Structured Output → Formatted results

### Configuration Management
- **Global Config** (`configs/global_config.yaml`) - Environment-specific settings
- **Database Config** (`configs/db_config.py`) - Docker-aware connection management
- **Authentication** - API key management with Redis storage and rate limiting

## Memory Systems

### MCP/Memory Tools
The system provides two complementary memory systems for knowledge management:

#### 1. MCP/Memory - Entity and Relation Memory
**Primary Use Case**: Store and query structured entities and relationships

**When to Use**:
- Storing stock-concept relationships (e.g., "三一重工 属于 墨脱水电工程")
- Building knowledge graphs of industry chains and company relationships
- Managing structured entity data with explicit connections

**Usage Pattern**:
```python
# Store entity relationship
{
    "type": "relation",
    "from": "墨脱水电工程",
    "to": "三一重工", 
    "relationType": "属于"
}

# Store entity definition
{
    "type": "entity",
    "name": "三一重工",
    "entityType": "股票",
    "observations": ["工程机械主机厂，受益于墨脱水电工程"]
}
```

**Claude Agent Usage**:
- When user says "记忆这个实体关系" → Use MCP/Memory tool
- When user asks "查询XX的关系" → Query MCP/Memory for entity relationships
- Best for: Company-concept mappings, industry chains, explicit business relationships

#### 2. OpenMemory - Long-term Knowledge Memory  
**Primary Use Case**: Store comprehensive knowledge with contextual understanding

**When to Use**:
- Storing trading strategies, market analysis insights
- Recording user preferences and learning notes
- Managing complex knowledge with rich metadata and scope-based organization

**Scope-based Architecture** (defined in `schemas/memory_scope_schema.py`):
- **8 Major Domains**: trading_knowledge, project_dev, personal, market_data, system_config, learning_notes, business, stock_info
- **Hierarchical Structure**: Level1.Level2.Level3 (e.g., "trading_knowledge.strategy_core.fibonacci_trading")
- **Intelligent Classification**: Auto-assigns scope based on content analysis

**Usage Pattern**:
```python
# Store trading knowledge
scope = "trading_knowledge.strategy_core.fibonacci_trading"
metadata = {
    "scope": scope,
    "data_type": "structured_knowledge", 
    "tags": ["fibonacci", "retracement", "entry_strategy"],
    "importance": 8,
    "confidence": 0.95
}

# Store stock concept information  
scope = "stock_info.concept_definition.新能源汽车"
metadata = {
    "scope": scope,
    "data_type": "stock_concept",
    "tags": ["concept", "automotive", "clean_energy"]
}
```

**Claude Agent Usage**:
- When user says "记忆这个知识/策略/分析" → Use OpenMemory with appropriate scope
- When user asks "查询关于XX的知识" → Search OpenMemory with scope filters
- Best for: Complex knowledge, strategies, insights, contextual information

### Memory Tool Selection Guide

**Use MCP/Memory when**:
- Simple entity-relationship pairs
- Building knowledge graphs
- Need explicit relationship types
- Storing structured business connections

**Use OpenMemory when**:
- Rich content with context
- Need hierarchical organization
- Complex metadata requirements
- Long-form knowledge and insights

**Integration Pattern**:
Both systems work together - MCP/Memory for the "what" (entities/relations), OpenMemory for the "how/why" (knowledge/context).

### Memory Command Patterns

```bash
# Test MCP/Memory connectivity
docker ps | grep mcp/memory

# Test OpenMemory system
python -c "
from utils.memory_manager import MemoryManager
import asyncio
async def test():
    mm = MemoryManager()
    print('OpenMemory system ready')
asyncio.run(test())
"

# Query memory status
curl -X GET "http://localhost:6333/collections" -H "api-key: bUjqem-8wyhpi-kejcuw" | jq '.'
```

## MCP Database Structures and Query Strategies

### Complete MCP Configuration
The system has **7 active MCP servers** configured in `/Users/impharaonjin/.config/claude/mcp_servers.json`:
- **openmemory** - Python-based long-term knowledge memory
- **memory** - Docker-based entity-relationship memory 
- **postgres** - PostgreSQL database access
- **redis** - Redis cache and time-series data
- **qdrant** - Vector database for semantic search
- **neo4j** - Graph database for relationship analysis  
- **mongodb** - Document database for knowledge storage

### Database-Specific Data Structures and Optimal Query Methods

#### 🗃️ PostgreSQL (Supabase) - Structured Business Data
**Connection**: `postgresql://postgrest:qadkaq-zegxyc-Xeqme3@192.168.18.10:54322/postgres`

**Core Tables (16 tables, 1562 signals, 14564 stocks)**:
- **signals** - Trading signal records
  - Fields: `symbol, signal_type, direction, confidence, score, strength, metadata(JSONB)`
  - Indexes: symbol, signal_type, status, direction, priority, risk_level
  - Use for: Signal history analysis, performance statistics, risk assessment
- **stock** - Stock master data  
  - Fields: `symbol, name, market, meta_data(JSONB)`
  - Use for: Stock information lookup, market filtering
- **factors/factor_scores** - Factor analysis data
  - Use for: Quantitative factor analysis, signal scoring
- **positions/position_transactions** - Trading position records
  - Use for: Portfolio analysis, transaction history
- **risk_audit_logs** - Risk management audit trails
  - Use for: Risk decision tracking, compliance reporting

**Query Strategies**:
```sql
-- Signal analysis
SELECT signal_type, COUNT(*), AVG(confidence) FROM signals GROUP BY signal_type;

-- Stock filtering  
SELECT * FROM stock WHERE market = 'A股' AND symbol LIKE 'SZ.%';

-- Risk analytics
SELECT * FROM risk_audit_logs WHERE event_type = 'SIGNAL_EVALUATION' ORDER BY timestamp DESC;
```

#### 🍃 MongoDB - Knowledge Base and Unstructured Data  
**Connection**: `mongodb://admin:pixdow-2padVi-qewguk@localhost:27017/mongo_db?authSource=admin`

**Collections (915 documents)**:
- **atomic_knowledge** - Trading knowledge repository
  - Structure: `scope, content, tags, metadata, strategy, created_at`
  - Scope hierarchy: `trading_knowledge.pattern_recognition.gap_trading_strategy`
  - Content types: Trading strategies, pattern recognition, technical analysis
  - Tags: Pattern types, indicators, timeframes, market types

**Query Strategies**:
```javascript
// Strategy search
db.atomic_knowledge.find({tags: "breakout_strategy"})

// Pattern analysis
db.atomic_knowledge.find({content: /缺口交易/i})

// Scope-based queries
db.atomic_knowledge.find({level1_scope: "trading_knowledge"})

// Metadata filtering
db.atomic_knowledge.find({"metadata.importance": "high"})
```

#### 🔴 Redis - Time-Series Data and Caching
**Connection**: `redis://:pivfo8-dukCof-biccur@192.168.18.10:6379/0`

**Key Patterns (105,865 keys)**:
- **Time-series metrics**: `metric:A_STOCK:1D:SZ.300994:ema10` (TSDB-TYPE)
- **insight states**: `insight:state:SH.603198:1D`  
- **Stock lists**: `a1_stocks`, `total_stocks`
- **Technical indicators**: EMA, KDJ, ATR, ADX, DI_PLUS, DI_MINUS

**Query Strategies**:
```bash
# Technical indicator queries
redis-cli KEYS "metric:A_STOCK:1D:*:ema10"
redis-cli TS.RANGE metric:A_STOCK:1D:SZ.300994:ema10 - +

# Stock state queries  
redis-cli GET "insight:state:SH.603198:1D"
redis-cli SMEMBERS "a1_stocks"

# Pattern matching
redis-cli KEYS "*kdj*" | head -10
```

#### 🟣 Qdrant - Vector Database for Semantic Search
**Connection**: `http://localhost:6333` (API Key: `bUjqem-8wyhpi-kejcuw`)

**Current Status**: No collections (empty database)
**Intended Use**: Semantic search, vector similarity, AI-powered retrieval

**Query Strategies** (when populated):
```bash
# Collection management
curl -X GET "http://localhost:6333/collections" -H "api-key: bUjqem-8wyhpi-kejcuw"

# Vector search
curl -X POST "http://localhost:6333/collections/knowledge/points/search" \
  -H "api-key: bUjqem-8wyhpi-kejcuw" \
  -d '{"vector": [0.1, 0.2], "limit": 10}'
```

#### 🔵 Neo4j - Graph Database for Relationships
**Connection**: `bolt://localhost:7687` (neo4j/moDruw-1kynqy-bywqan)

**Graph Structure (47,588 nodes)**:
- **Node Labels**: Signal (trading signals as graph nodes)
- **Relationships**: None currently defined
- **Use Cases**: Signal dependency analysis, relationship discovery

**Signal Node Properties**:
- `symbol` - 股票代码 (e.g., 'SZ.301193', 'SH.600519')
- `type` - 信号类型 (e.g., 'BULLISH_FVG', 'BEARISH_ENGULFING', 'BULLISH_MSS')
- `time` - 信号时间 (ISO 8601格式: '2025-08-18T00:00:00+08:00')
- `level` - 时间级别 (e.g., '1D')
- `direction` - 方向 (1=看多, -1=看空)
- `status` - 状态 (e.g., 'created')
- `metadata` - JSON元数据 (包含confidence, strength, support_level, resistance_level等)
- `id` - 唯一标识符 (UUID)

**Query Strategies**:
```bash
# Neo4j连接测试和基本信息查询
NEO4J_URI=bolt://localhost:7687 NEO4J_USERNAME=neo4j NEO4J_PASSWORD=moDruw-1kynqy-bywqan /Users/impharaonjin/miniconda3/bin/python -c "
from neo4j import GraphDatabase
driver = GraphDatabase.driver('bolt://localhost:7687', auth=('neo4j', 'moDruw-1kynqy-bywqan'))
with driver.session() as session:
    # 查看总节点数
    result = session.run('MATCH (n:Signal) RETURN count(n) as total_nodes')
    total_nodes = result.single()['total_nodes']
    print(f'总Signal节点数: {total_nodes}')
    
    # 查询特定股票的信号
    result = session.run('MATCH (s:Signal) WHERE s.symbol = \"SZ.301193\" RETURN s ORDER BY s.time DESC LIMIT 10')
    signals = list(result)
    print(f'找到SZ.301193的信号数量: {len(signals)}')
    
    for i, record in enumerate(signals):
        signal = record['s']
        print(f'信号{i+1}: 类型={signal[\"type\"]}, 时间={signal[\"time\"]}, 方向={signal[\"direction\"]}')
        
driver.close()
"

# 查询股票近期信号的Cypher语句
MATCH (s:Signal) WHERE s.symbol = 'SZ.301193' RETURN s ORDER BY s.time DESC LIMIT 10

# 按信号类型统计
MATCH (s:Signal) RETURN s.type, count(*) as signal_count ORDER BY signal_count DESC

# 查询特定时间范围的信号
MATCH (s:Signal) WHERE s.time >= '2025-08-01T00:00:00+08:00' AND s.symbol = 'SZ.301193' RETURN s ORDER BY s.time DESC

# 查看信号的支撑阻力位信息 (从metadata JSON中提取)
MATCH (s:Signal) WHERE s.symbol = 'SZ.301193' 
RETURN s.symbol, s.type, s.time, 
       apoc.convert.fromJsonMap(s.metadata).support_level as support,
       apoc.convert.fromJsonMap(s.metadata).resistance_level as resistance
ORDER BY s.time DESC LIMIT 5
```

#### 🧠 Memory Systems - Knowledge Graphs and Entity Relations

**MCP/Memory (Docker)** - Entity-Relationship Storage:
- **Data Format**: JSONL with entity/relation objects
- **Structure**: `{"type": "entity", "name": "三一重工", "entityType": "股票"}`
- **Relations**: `{"type": "relation", "from": "墨脱水电工程", "to": "三一重工"}`
- **Use Cases**: Stock-concept relationships, industry chain mapping

**OpenMemory (Python)** - Long-term Knowledge Storage:
- **Scope System**: Hierarchical organization (8 major domains)
- **Content Types**: Trading strategies, analysis insights, user preferences  
- **Metadata**: Importance scores, confidence levels, tags
- **Use Cases**: Complex knowledge storage, contextual information retrieval

### Smart Query Selection Guide

#### 📈 **Trading Signal Analysis**
- **PostgreSQL MCP**: Historical analysis, statistics, compliance reporting
- **Neo4j MCP**: Signal relationships, dependency tracking  
- **Redis MCP**: Real-time indicators, current market state

#### 📚 **Knowledge and Strategy Queries**
- **MongoDB MCP**: Trading strategies, pattern recognition, technical knowledge
- **Memory MCP**: Entity relationships, concept mappings, industry chains
- **OpenMemory MCP**: Complex insights, contextual knowledge, user learning

#### 📊 **Data Analytics and Research**  
- **PostgreSQL MCP**: Structured data analysis, SQL aggregations, joins
- **Redis MCP**: Time-series analysis, real-time metrics, caching
- **Qdrant MCP**: Semantic search, similarity analysis (when populated)

#### 🔍 **Relationship and Entity Queries**
- **Memory MCP**: Stock-concept relationships, industry mappings
- **Neo4j MCP**: Complex graph relationships, path analysis  
- **MongoDB MCP**: Tag-based knowledge discovery, content relationships

## Development Guidelines

### Core Development Rules (from .cursorrules)
1. **File Operations**: Always edit files directly, avoid displaying code in conversations
2. **Minimal Output**: Only explain what was changed and where
3. **Testing Required**: Every method must pass unit tests using CLI patterns
4. **Documentation Updates**: Update changelog.md with semantic versioning [x.x.x]
5. **Core Code Protection**: Never modify core directories without explicit permission

### Logger Usage Guidelines

**IMPORTANT: 必须使用 utils 中的统一日志系统，禁止直接使用 Python logging 模块**

#### 标准Logger导入和使用
```python
# 正确的Logger导入方式
from utils import get_logger

# 为特定组件创建专用Logger
class MyComponent:
    def __init__(self):
        self.logger = get_logger(f"factor_scorer_{self.__class__.__name__}")
        
    def process_data(self):
        try:
            # 业务逻辑
            pass
        except Exception as e:
            # 错误日志 - 包含详细调试信息
            self.logger.error(f"连接失败: {str(e)}, 错误类型: {type(e).__name__}")
            self.logger.error(f"错误详情: {repr(e)}")
            if hasattr(e, '__traceback__'):
                import traceback
                self.logger.error(f"堆栈信息: {traceback.format_exc()}")
```

#### 调试信息标准格式
连接/操作失败时必须记录以下信息：
- **错误原因**: `str(e)` 
- **错误类型**: `type(e).__name__`
- **上下文信息**: 相关参数、状态
- **堆栈跟踪**: `traceback.format_exc()` (如果需要)

#### Logger功能特性
- **自动文件输出**: 日志自动保存到 `.logs/` 目录
- **文件轮转**: 单文件最大1MB，保留100个备份
- **控制台输出**: 同时输出到控制台便于调试
- **UTF-8编码**: 支持中文日志
- **线程安全**: 支持多线程环境

### Strategy Development Pattern
```python
# Inherit from BaseStrategy with Redis state management
class NewStrategy(BaseStrategy):
    def process(self) -> Dict[str, Any]:
        # Implement with confidence scoring
        # Use event tracking for performance monitoring  
        # Leverage top-K ranking for signal filtering
        pass
```

### AI Agent Development Pattern
```python
# Extend base agent classes
# Use template management for dynamic prompts
# Implement proper error handling and state management
# Leverage multi-database coordination patterns
```

### Signal Development
Choose between:
- **Legacy system** - Simple implementation in `signals/`
- **New plugin system** - Advanced implementation in `services/signals/` with caching and configuration management

### Factor Generation Rules

**因子生成必须遵循数学模型原则，严禁使用区间评分方式：**

#### 核心原则
1. **数学模型驱动**：
   - 所有因子评分必须基于数学函数计算
   - 使用连续数学函数（如高斯、Sigmoid、峰值函数等）
   - 避免分段式区间评分（如if x > 0.8 return 1.0的方式）

2. **支持机器学习**：
   - 数学模型输出连续值，便于梯度计算
   - 参数可调整，支持模型优化
   - 函数平滑可导，便于反向传播

3. **标准建模类型**：
   - **PEAK（峰值型）**：高斯分布，适用于最优值在中间的场景
   - **BINARY（二值型）**：阈值函数，适用于明确分类场景
   - **SIGMOID（S型）**：logistic函数，适用于渐变场景
   - **CONTINUOUS（连续型）**：线性或幂函数，适用于单调关系

#### 实现要求
```python
# ✅ 正确做法：使用数学模型
def calculate_gap_score(gap_ratio: float, swing_position: int) -> float:
    """峰值型数学模型：gap_ratio峰值为5"""
    return MathUtils.gaussian_score(gap_ratio, center=5.0, spread=2.0)

def calculate_trend_score(swing_position: int) -> float:
    """二值型数学模型：BINARY分类"""
    return 1.0 if swing_position == 1 else -1.0 if swing_position == -1 else 0.0

# ❌ 错误做法：区间评分
def bad_calculate_score(value: float) -> float:
    if value > 0.8:
        return 1.0
    elif value > 0.6:
        return 0.8
    elif value > 0.4:
        return 0.6
    else:
        return 0.2  # 这种分段评分方式被禁止
```

#### 建模选择指南
- **跳空分析**：PEAK型，峰值在理想跳空幅度
- **趋势确认**：BINARY型，明确多空分类
- **实体强度**：SIGMOID型，强度渐变关系
- **价格位置**：CONTINUOUS型，位置连续映射
- **影线分析**：PEAK型，理想影线比例为峰值

#### 参数配置
- 使用`services/factor_engine/core/math_utils.py`提供的数学函数
- 通过`FactorConfig`的`modeling_type`和`parameters`配置模型
- 避免硬编码阈值，改用数学函数参数控制
## 统一信号对接架构 (Signal Integration Architecture)

### 核心设计原则
- **统一信号模型**: 所有系统使用`schemas/signal_schema.py`中的`Signal`类
- **直接导入对接**: services内部通过直接import进行集成，无需HTTP接口
- **标准化处理流程**: 信号评估→风控决策→仓位管理→审计追踪

### 信号入口系统支持
系统支持多个信号来源的统一对接：

1. **`services/quants/`** - 量化策略系统
   - BaseStrategy及其子类策略
   - 工作流引擎节点信号
   - MongoDB信号存储管理

2. **`services/digital_currencies/`** - 数字货币系统
   - 加密货币信号生成器
   - ICT技术分析信号
   - Discord通知集成

3. **`services/signal_engine/`** - 信号引擎系统v2.0
   - 插件架构信号检测
   - 价格行为信号生成
   - 缓存优化信号处理

### 统一对接接口
```python
from services.risk_center.interfaces.signal_integration_api import (
    get_signal_integration, 
    process_quants_signal,
    process_crypto_signal,
    process_signal_engine_signal
)

# Quants系统对接
result = await process_quants_signal(signal, "breakout_strategy", 1000000.0)

# 数字货币系统对接  
result = await process_crypto_signal(signal, "crypto_strategy", 500000.0)

# 信号引擎系统对接
result = await process_signal_engine_signal(signal, "signal_engine_strategy", 800000.0)
```

### Risk Center测试命令
```bash
# Risk Center基本功能测试
python -c "
from services.risk_center.interfaces.signal_integration_api import get_signal_integration
from schemas.signal_schema import Signal, SignalDirection, Priority, RiskLevel
import asyncio

async def test():
    integration = get_signal_integration()
    
    # 创建测试信号
    signal = Signal(
        symbol='000001.SZ',
        signal_type='breakout',
        time_key='2025-08-22 14:30:00',
        level='1D',
        direction=SignalDirection.BULLISH,
        price=15.50,
        confidence=0.85,
        priority=Priority.HIGH,
        risk_level=RiskLevel.MEDIUM
    )
    
    # 测试信号处理
    result = await integration.process_signal(signal, 'test_strategy', 1000000.0)
    print(f'处理结果: {result.success}, 消息: {result.message}')
    
    # 测试状态查询
    status = await integration.get_strategy_status('test_strategy')
    print(f'策略状态: {status}')

asyncio.run(test())
"

# Risk Center健康检查
python -c "
from services.risk_center.interfaces.signal_integration_api import get_signal_integration
import asyncio

async def health_check():
    integration = get_signal_integration()
    health = await integration.get_risk_center_health()
    print(f'Risk Center状态: {health}')

asyncio.run(health_check())
"
```

### Example & Test Script Placement Policy

> **All example scripts and test scripts must be placed in the `tmp/` directory.**
>
> - Do **NOT** add example or test scripts to any core application directories (such as `scripts/`, `services/`, `models/`, `routes/`, etc).
> - The `tmp/` directory is reserved for temporary, experimental, and testing code. It is safe to modify or delete.
> - This rule ensures the core project structure remains clean and production-ready.
> - Any violation (placing test/example scripts outside `tmp/`) will be considered a breach of repository policy.

**Example:**

### Testing Commands from GEMINI.md
The project follows specific CLI testing patterns for rapid validation:
- Use `python -c "..."` for quick function tests
- Use `psql`, `mongosh`, `redis-cli` for database connectivity
- Use `curl` with `jq` for API endpoint testing
- Follow async patterns with `asyncio.run()` for async functions

### Docker Development
```bash
# Development with hot reload
docker-compose up -d

# Check logs
docker logs stock-api -f

# Execute commands in container
docker exec -it stock-api python -c "import models.postgres_model"
```

> **完成任何编码任务后，在编写总结前，必须执行以下操作：**
>
> 1. **自动更新 `changelog.md`：**
>    - 读取当前 `changelog.md` 的最新版本号（如 `1.2.3`），将最后一位数字加1（如变为 `1.2.4`）。
>    - 在新版本号下添加本次变更的简要描述。
>    - 示例自动化脚本（可放在 `tmp/` 目录）：
>      ```python
>      import re
>      changelog = "changelog.md"
>      with open(changelog, "r+", encoding="utf-8") as f:
>          content = f.read()
>          m = re.search(r"(\d+\.\d+\.\d+)", content)
>          if m:
>              version = m.group(1)
>              parts = version.split(".")
>              parts[-1] = str(int(parts[-1]) + 1)
>              new_version = ".".join(parts)
>              entry = f"\n## {new_version}\n- 本次变更简述\n"
>              content = content.replace(version, new_version, 1)
>              content = entry + content
>              f.seek(0)
>              f.write(content)
>      ```
>    - 请根据实际变更内容补充描述。
>
> 1. **Add a clear update entry to `changelog.md`** describing the changes made.
> 2. **Run lint checks** to ensure there are no linting errors in the codebase.
>
> This process is mandatory for all code contributions to maintain project quality and traceability.


## Specs Documentation Standards

### 规范化文档结构要求

**所有新功能和需求必须在 `specs/` 目录下进行标准化文档编写：**

#### 1. 目录组织规范
- **服务级文档**: `specs/services/[service-name]/`
- **功能级文档**: `specs/services/[service-name]/[feature-name]/`
- **每个功能必须独立文件夹**: 避免功能文档混合在同一目录

#### 2. 标准文档结构
每个功能文件夹必须包含以下标准文档：

```
specs/services/[service-name]/[feature-name]/
├── requirements.md     # 用户需求规格书
├── design.md          # 技术设计方案
├── todolist.md        # 分阶段实施计划
└── README.md          # 功能概述和状态跟踪
```

#### 3. 文档内容要求

**requirements.md - 需求规格书**
- 项目概述和背景
- 系统现状分析
- 功能需求和非功能需求
- 技术约束和依赖
- 验收标准和风险评估

**design.md - 技术设计方案**
- 架构设计和数据流
- 核心组件设计
- API接口设计
- 数据模型设计
- 配置和部署方案

**todolist.md - 实施计划**
- 分阶段实施roadmap（P0/P1/P2优先级）
- 具体任务清单和检查点
- 工期估算和风险缓解
- 验收标准和测试计划

**README.md - 功能概述**
- 功能简介和核心价值
- 当前开发状态
- 已完成的里程碑
- 下一步计划

#### 4. README.md 同步更新要求

**强制性规则**: 完成任何新功能需求文档后，必须立即更新对应的 README.md

- **服务级README**: `specs/services/[service-name]/README.md`
- **功能完成后**: 在README中标记功能状态为"已完成"或"开发中"
- **里程碑记录**: 更新重要里程碑和完成时间
- **文档索引**: 提供功能文档的快速导航链接

#### 5. 文档示例结构

```markdown
# Service Name 服务规格文档

## 功能列表

### ✅ 已完成功能
- [因子集成系统](./factor-integration/) - 2025-08-26 完成设计
  - Requirements: ✅ 已完成
  - Design: ✅ 已完成  
  - Implementation: 🚧 开发中

### 🚧 开发中功能
- [新功能名称](./new-feature/) - 预计完成时间
  - Requirements: ✅ 已完成
  - Design: ⏳ 进行中
  - Implementation: ⏸️ 未开始

### 📋 计划功能
- 功能名称3 - 计划开始时间
```

#### 6. 标准化流程

1. **需求分析**: 在适当目录创建功能文件夹
2. **文档编写**: 按照标准结构编写 requirements.md
3. **设计阶段**: 完成 design.md 技术方案
4. **计划制定**: 编写 todolist.md 实施计划
5. **README更新**: ⚠️ **强制步骤** - 更新服务README状态
6. **实施跟踪**: 实施过程中同步更新文档状态

#### 7. 质量标准

- **完整性**: 所有必需文档齐全
- **准确性**: 技术细节准确，无遗漏关键信息
- **可操作性**: todolist具体可执行
- **可追溯性**: README准确反映当前状态
- **时效性**: 文档与实际开发状态同步

### Environment Variables
Key configuration variables (set in docker-compose.yml or locally):
- `RUNNING_IN_DOCKER=true` - Enables Docker-specific configurations
- `SERVER_PORT=5002` - Application port
- `MCP_SSE_MOUNT_PATH=/mcp` - MCP server mount path

## Important Files and Directories

### Critical Configuration
- `configs/global_config.yaml` - Main configuration file
- `GEMINI.md` - Development rules and CLI testing patterns
- `.cursorrules` - Strict development guidelines and code protection rules

### Core Application Files  
- `app.py` - FastAPI application with middleware and routing
- `orchestrator.py` - System coordinator and event manager
- `requirements.txt` - Python dependencies

### Key Service Directories
- `aigo/` - AI analysis framework with multi-agent architecture
- `services/quants/` - Quantitative trading strategies and workflow
- `services/signals/` - Signal detection system v2.0
- `services/risk_center/` - Risk management and position control system
- `models/` - Database models for all 5 databases
- `routes/` - FastAPI route handlers organized by domain

### Scripts and Utilities
- `scripts/scheduled_tasks/` - Background job schedulers
- `utils/` - Common utilities including eventbus, logging, Redis client
- `tmp/` - Temporary development and testing scripts (safe to modify)