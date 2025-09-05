### 功能/页面

- **文件路径:**
  /stocks/[symbol]
  /analysis/dashboard
  /analysis/overview

### 需求目标

    1. 表格中
        去掉股票名称，市场，置信度，meta_data字段，新增显示meta_data中的change_rate字段和price字段，这个price 表名为’触发时价格‘，change_rate:表名为涨跌幅，
        查询最近20条数据

    2. 在顶部股票信息框，增加股票 industry 行业的显示，这个信息从stock.meta_data中的’industry‘字段中。替换掉市场的位置。

    3. /stocks/[symbol]  /analysis/dashboard  /analysis/overview， 这三个页面都缺少其他页面中的顶部栏，就是搜索哪一行，需要与其他页面保持一致。

### UI 描述

- (请描述需要进行的UI更改。如果方便，可以使用文字、链接到设计图，或者简单的文本图示。)

### 数据需求

- **需要什么数据:** (例如: 从 `signals` 表中获取 `BOS` 类型的信号)
- **数据来源:** (例如: Supabase 数据库)
- **查询条件:** (例如: `category = 'intraday'` 并且 `status = 'active'`)

### 逻辑/行为

- (请分步描述需要实现的功能逻辑。)
  1.  **第一步:**
  2.  **第二步:**
  3.  **第三步:**

### 验收标准

- (请列出如何判断此功能已成功完成的标准。)
  - [ ]
  - [ ]
  - [ ]
