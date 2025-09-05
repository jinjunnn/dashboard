/**
 * 交易信号配置文件
 * 用于管理所有信号类型的配置信息
 */

export interface SignalConfig {
  id: string;
  name: string; // 数据库中的信号字段名
  displayName: string; // 前端显示的友好名称
  description: string;
  category: "intraday" | "daily";
  enabled: boolean;
  riskLevel: "R1" | "R2" | "R3" | "R4"; // 风险等级
  direction: "bullish" | "bearish" | "neutral"; // 做多/做空/中性
  color?: string;
  icon?: string;
}

/**
 * 日内信号配置（基于实际数据库数据更新）
 */
export const intradaySignals: SignalConfig[] = [
  // 实时突破类信号
  {
    id: "intraday_realtime_breakout",
    name: "REALTIME_BREAKOUT",
    displayName: "实时突破",
    description: "实时监控的价格突破信号",
    category: "intraday",
    enabled: true,
    riskLevel: "R1",
    direction: "bullish",
    color: "#dc2626",
    icon: "Zap",
  },
  // ICT 相关信号
  {
    id: "intraday_ict_breakout",
    name: "ICT_BREAKOUT",
    displayName: "ICT 突破",
    description: "ICT 突破交易信号",
    category: "intraday",
    enabled: true,
    riskLevel: "R2",
    direction: "bullish",
    color: "#7c3aed",
    icon: "Activity",
  },
  // 订单块信号
  {
    id: "intraday_bullish_ob",
    name: "BULLISH_OB",
    displayName: "看涨订单块",
    description: "机构看涨订单块支撑位信号",
    category: "intraday",
    enabled: true,
    riskLevel: "R2",
    direction: "bullish",
    color: "#10b981",
    icon: "Shield",
  },
  {
    id: "intraday_bearish_ob",
    name: "BEARISH_OB",
    displayName: "看跌订单块",
    description: "机构看跌订单块阻力位信号",
    category: "intraday",
    enabled: true,
    riskLevel: "R2",
    direction: "bearish",
    color: "#ef4444",
    icon: "Shield",
  },
  {
    id: "intraday_order_block_pullback",
    name: "ORDER_BLOCK_PULLBACK",
    displayName: "订单块回调",
    description: "订单块回调确认信号",
    category: "intraday",
    enabled: true,
    riskLevel: "R3",
    direction: "neutral",
    color: "#f59e0b",
    icon: "RefreshCw",
  },
  // 突破信号
  {
    id: "intraday_breakout",
    name: "BREAKOUT",
    displayName: "突破",
    description: "价格突破关键位信号",
    category: "intraday",
    enabled: true,
    riskLevel: "R2",
    direction: "bullish",
    color: "#059669",
    icon: "TrendingUp",
  },
  // 缺口信号
  {
    id: "intraday_up_gap",
    name: "UP_GAP",
    displayName: "向上缺口",
    description: "价格向上跳空缺口信号",
    category: "intraday",
    enabled: true,
    riskLevel: "R2",
    direction: "bullish",
    color: "#22c55e",
    icon: "ArrowUp",
  },
  // 吞没形态
  {
    id: "intraday_bullish_engulfing",
    name: "BULLISH_ENGULFING",
    displayName: "看涨吞没",
    description: "看涨吞没K线形态信号",
    category: "intraday",
    enabled: true,
    riskLevel: "R2",
    direction: "bullish",
    color: "#16a34a",
    icon: "TrendingUp",
  },
  {
    id: "intraday_bearish_engulfing",
    name: "BEARISH_ENGULFING",
    displayName: "看跌吞没",
    description: "看跌吞没K线形态信号",
    category: "intraday",
    enabled: true,
    riskLevel: "R2",
    direction: "bearish",
    color: "#dc2626",
    icon: "TrendingDown",
  },
];

/**
 * 日线信号配置（基于实际数据库数据更新）
 */
export const dailySignals: SignalConfig[] = [
  // FVG (Fair Value Gap) 信号
  {
    id: "daily_bullish_fvg",
    name: "BULLISH_FVG",
    displayName: "看涨公允价值缺口",
    description: "日线时间框架的看涨FVG信号",
    category: "daily",
    enabled: true,
    riskLevel: "R2",
    direction: "bullish",
    color: "#2563eb",
    icon: "BarChart3",
  },
  {
    id: "daily_bearish_fvg",
    name: "BEARISH_FVG",
    displayName: "看跌公允价值缺口",
    description: "日线时间框架的看跌FVG信号",
    category: "daily",
    enabled: true,
    riskLevel: "R2",
    direction: "bearish",
    color: "#dc2626",
    icon: "BarChart3",
  },
  // BOS (Break of Structure) 信号
  {
    id: "daily_bullish_bos",
    name: "BULLISH_BOS",
    displayName: "看涨结构突破",
    description: "日线时间框架的看涨结构突破信号",
    category: "daily",
    enabled: true,
    riskLevel: "R2",
    direction: "bullish",
    color: "#16a34a",
    icon: "TrendingUp",
  },
  {
    id: "daily_bearish_bos",
    name: "BEARISH_BOS",
    displayName: "看跌结构突破",
    description: "日线时间框架的看跌结构突破信号",
    category: "daily",
    enabled: true,
    riskLevel: "R2",
    direction: "bearish",
    color: "#dc2626",
    icon: "TrendingDown",
  },
  // MSS (Market Structure Shift) 信号
  {
    id: "daily_bullish_mss",
    name: "BULLISH_MSS",
    displayName: "看涨结构转换",
    description: "日线时间框架的看涨市场结构转换",
    category: "daily",
    enabled: true,
    riskLevel: "R3",
    direction: "bullish",
    color: "#059669",
    icon: "Activity",
  },
  {
    id: "daily_bearish_mss",
    name: "BEARISH_MSS",
    displayName: "看跌结构转换",
    description: "日线时间框架的看跌市场结构转换",
    category: "daily",
    enabled: true,
    riskLevel: "R3",
    direction: "bearish",
    color: "#7c3aed",
    icon: "Activity",
  },
  // SSL 通道信号
  {
    id: "daily_bullish_ssl",
    name: "BULLISH_SSL",
    displayName: "看涨SSL通道",
    description: "SSL通道显示看涨趋势信号",
    category: "daily",
    enabled: true,
    riskLevel: "R2",
    direction: "bullish",
    color: "#059669",
    icon: "TrendingUp",
  },
  {
    id: "daily_bearish_ssl",
    name: "BEARISH_SSL",
    displayName: "看跌SSL通道",
    description: "SSL通道显示看跌趋势信号",
    category: "daily",
    enabled: true,
    riskLevel: "R2",
    direction: "bearish",
    color: "#dc2626",
    icon: "TrendingDown",
  },
  // 订单块信号
  {
    id: "daily_bullish_ob",
    name: "BULLISH_OB",
    displayName: "看涨订单块",
    description: "日线时间框架的看涨订单块信号",
    category: "daily",
    enabled: true,
    riskLevel: "R2",
    direction: "bullish",
    color: "#10b981",
    icon: "Shield",
  },
  {
    id: "daily_bearish_ob",
    name: "BEARISH_OB",
    displayName: "看跌订单块",
    description: "日线时间框架的看跌订单块信号",
    category: "daily",
    enabled: true,
    riskLevel: "R2",
    direction: "bearish",
    color: "#ef4444",
    icon: "Shield",
  },
  // 吞没形态
  {
    id: "daily_bullish_engulfing",
    name: "BULLISH_ENGULFING",
    displayName: "看涨吞没",
    description: "日线时间框架的看涨吞没形态",
    category: "daily",
    enabled: true,
    riskLevel: "R2",
    direction: "bullish",
    color: "#22c55e",
    icon: "TrendingUp",
  },
  {
    id: "daily_bearish_engulfing",
    name: "BEARISH_ENGULFING",
    displayName: "看跌吞没",
    description: "日线时间框架的看跌吞没形态",
    category: "daily",
    enabled: true,
    riskLevel: "R2",
    direction: "bearish",
    color: "#dc2626",
    icon: "TrendingDown",
  },
  // 支撑阻力突破
  {
    id: "daily_support_zone_breakdown",
    name: "SUPPORT_ZONE_BREAKDOWN",
    displayName: "支撑区域跌破",
    description: "价格跌破重要支撑区域的信号",
    category: "daily",
    enabled: true,
    riskLevel: "R3",
    direction: "bearish",
    color: "#dc2626",
    icon: "TrendingDown",
  },
  {
    id: "daily_resistance_breakout",
    name: "RESISTANCE_BREAKOUT",
    displayName: "阻力位突破",
    description: "价格突破重要阻力位的信号",
    category: "daily",
    enabled: true,
    riskLevel: "R2",
    direction: "bullish",
    color: "#16a34a",
    icon: "TrendingUp",
  },
  // ICT 相关
  {
    id: "daily_ict_breakout",
    name: "ICT_BREAKOUT",
    displayName: "ICT 突破",
    description: "日线时间框架的 ICT 突破信号",
    category: "daily",
    enabled: true,
    riskLevel: "R2",
    direction: "bullish",
    color: "#8b5cf6",
    icon: "Activity",
  },
  // 订单块回调
  {
    id: "daily_order_block_pullback",
    name: "ORDER_BLOCK_PULLBACK",
    displayName: "订单块回调",
    description: "日线时间框架的订单块回调信号",
    category: "daily",
    enabled: true,
    riskLevel: "R3",
    direction: "neutral",
    color: "#f59e0b",
    icon: "RefreshCw",
  },
];

/**
 * 获取所有信号配置
 */
export function getAllSignals(): SignalConfig[] {
  return [...intradaySignals, ...dailySignals];
}

/**
 * 根据类别获取信号配置
 */
export function getSignalsByCategory(category: "intraday" | "daily"): SignalConfig[] {
  return category === "intraday" ? intradaySignals : dailySignals;
}

/**
 * 根据信号名称获取配置
 */
export function getSignalByName(name: string): SignalConfig | undefined {
  const allSignals = getAllSignals();
  return allSignals.find((signal) => signal.name === name);
}

/**
 * 获取启用的信号配置
 */
export function getEnabledSignals(category?: "intraday" | "daily"): SignalConfig[] {
  const signals = category ? getSignalsByCategory(category) : getAllSignals();
  return signals.filter((signal) => signal.enabled);
}

/**
 * 信号类型映射 (数据库字段名 -> 配置ID)
 */
export const signalTypeMapping = {
  // 日内信号映射
  SWING_HIGH_REBREAKOUT: "intraday_swing_high_rebreakout",
  SWING_HIGH_BREAKOUT: "intraday_swing_high_breakout",
  INNERDAY_BULLISH_MSS: "intraday_bullish_mss",
  INNERDAY_BULLISH_BOS: "intraday_bullish_bos",
  PL_REVERTED: "intraday_pl_reverted",
  OTHER: "intraday_other",
  BULLISH_OB: "intraday_bullish_ob",
  REALTIME_BREAKOUT: "intraday_realtime_breakout",

  // 日线信号映射
  BULLISH_SSL: "daily_bullish_ssl",
  SupportZoneBreakdown: "daily_support_zone_breakdown",
  BULLISH_FVG: "daily_bullish_fvg",
  BEARISH_MSS: "daily_bearish_mss",
  LIMIT_UP: "daily_limit_up",
  ResistanceBreakout: "daily_resistance_breakout",
  ER: "daily_er",
  PL: "daily_pl",
  PPL: "daily_ppl",
};

/**
 * URL路由名称到数据库字段名的映射 (URL signalType -> 数据库字段名)
 * 用于从URL参数准确映射到数据库查询字段
 */
export const urlToDbMapping = {
  // 日内信号的URL映射
  swing_high_rebreakout: "SWING_HIGH_REBREAKOUT",
  swing_high_breakout: "SWING_HIGH_BREAKOUT",
  bullish_mss: "INNERDAY_BULLISH_MSS",
  bullish_bos: "INNERDAY_BULLISH_BOS",
  pl_reverted: "PL_REVERTED",
  other: "OTHER",
  bullish_ob: "BULLISH_OB",
  realtime_breakout: "REALTIME_BREAKOUT",

  // 日线信号的URL映射
  bullish_ssl: "BULLISH_SSL",
  support_zone_breakdown: "SupportZoneBreakdown",
  bullish_fvg: "BULLISH_FVG",
  bearish_mss: "BEARISH_MSS",
  limit_up: "LIMIT_UP",
  resistance_breakout: "ResistanceBreakout",
  er: "ER",
  pl: "PL",
  ppl: "PPL",
};

/**
 * 根据配置ID获取信号配置
 */
export function getSignalConfigById(id: string): SignalConfig | undefined {
  const allSignals = getAllSignals();
  return allSignals.find((signal) => signal.id === id);
}

/**
 * 基于映射表的信号查找 - 准确且高效
 * 优先使用精确映射，避免大小写转换的不准确性
 */
export function findSignalConfig(identifier: string, category?: "intraday" | "daily"): SignalConfig | undefined {
  const allSignals = getAllSignals();

  // 1. 首先尝试完整ID匹配（如 "intraday_swing_high_rebreakout"）
  let signal = allSignals.find((s) => s.id === identifier);
  if (signal) return signal;

  // 2. 使用URL到数据库字段名的映射（如 "swing_high_rebreakout" -> "SWING_HIGH_REBREAKOUT"）
  const dbFieldName = urlToDbMapping[identifier as keyof typeof urlToDbMapping];
  if (dbFieldName) {
    signal = allSignals.find((s) => s.name === dbFieldName);
    if (signal) return signal;
  }

  // 3. 使用数据库字段名到配置ID的映射（如 "SWING_HIGH_REBREAKOUT" -> "intraday_swing_high_rebreakout"）
  const mappedId = signalTypeMapping[identifier as keyof typeof signalTypeMapping];
  if (mappedId) {
    signal = allSignals.find((s) => s.id === mappedId);
    if (signal) return signal;
  }

  // 4. 尝试数据库字段名直接匹配
  signal = allSignals.find((s) => s.name === identifier);
  if (signal) return signal;

  // 5. 如果指定了类别，尝试添加前缀匹配
  if (category) {
    const prefixedId = `${category}_${identifier}`;
    signal = allSignals.find((s) => s.id === prefixedId);
    if (signal) return signal;
  }

  return undefined;
}

/**
 * 将URL中的signalType转换为数据库字段名
 * 用于API查询时的准确字段匹配
 */
export function getDbFieldNameFromUrl(urlSignalType: string): string | undefined {
  return urlToDbMapping[urlSignalType as keyof typeof urlToDbMapping];
}

/**
 * 将数据库字段名转换为URL中的signalType
 * 用于生成前端路由链接
 */
export function getUrlFromDbFieldName(dbFieldName: string): string | undefined {
  const entry = Object.entries(urlToDbMapping).find(([url, db]) => db === dbFieldName);
  return entry ? entry[0] : undefined;
}

/**
 * 根据风险等级获取信号
 */
export function getSignalsByRiskLevel(riskLevel: "R1" | "R2" | "R3" | "R4"): SignalConfig[] {
  const allSignals = getAllSignals();
  return allSignals.filter((signal) => signal.riskLevel === riskLevel);
}

/**
 * 获取风险等级统计
 */
export function getRiskLevelStats(): Record<string, number> {
  const allSignals = getAllSignals();
  const stats = { R1: 0, R2: 0, R3: 0, R4: 0 };

  allSignals.forEach((signal) => {
    if (signal.enabled) {
      stats[signal.riskLevel]++;
    }
  });

  return stats;
}

/**
 * 根据方向获取信号
 */
export function getSignalsByDirection(direction: "bullish" | "bearish" | "neutral"): SignalConfig[] {
  const allSignals = getAllSignals();
  return allSignals.filter((signal) => signal.direction === direction);
}

/**
 * 获取方向统计
 */
export function getDirectionStats(): Record<string, number> {
  const allSignals = getAllSignals();
  const stats: Record<string, number> = {
    bullish: 0,
    bearish: 0,
    neutral: 0,
  };

  allSignals.forEach((signal) => {
    if (signal.enabled) {
      stats[signal.direction]++;
    }
  });

  return stats;
}

/**
 * 转换数据库方向值到配置方向值
 */
export function convertDbDirectionToConfig(dbDirection: "long" | "short"): "bullish" | "bearish" {
  const mapping = {
    long: "bullish" as const,
    short: "bearish" as const,
  };
  return mapping[dbDirection];
}

/**
 * 获取方向显示名称
 */
export function getDirectionLabel(direction: "bullish" | "bearish" | "neutral" | "long" | "short"): string {
  // 如果是数据库格式，先转换
  if (direction === "long") {
    direction = "bullish";
  } else if (direction === "short") {
    direction = "bearish";
  }
  
  const labels = {
    bullish: "看涨",
    bearish: "看跌",
    neutral: "中性",
  };
  return labels[direction as "bullish" | "bearish" | "neutral"];
}

/**
 * 获取方向颜色
 */
export function getDirectionColor(direction: "bullish" | "bearish" | "neutral" | "long" | "short"): string {
  // 如果是数据库格式，先转换
  if (direction === "long") {
    direction = "bullish";
  } else if (direction === "short") {
    direction = "bearish";
  }
  
  const colors = {
    bullish: "text-green-600",
    bearish: "text-red-600",
    neutral: "text-gray-600",
  };
  return colors[direction as "bullish" | "bearish" | "neutral"];
}

/**
 * 获取风险等级显示名称
 */
export function getRiskLevelLabel(riskLevel: "R1" | "R2" | "R3" | "R4"): string {
  const labels = {
    R1: "低风险",
    R2: "中低风险",
    R3: "中高风险",
    R4: "高风险",
  };
  return labels[riskLevel];
}

/**
 * 获取风险等级颜色
 */
export function getRiskLevelColor(riskLevel: "R1" | "R2" | "R3" | "R4"): string {
  const colors = {
    R1: "text-green-600 border-green-200 bg-green-50",
    R2: "text-blue-600 border-blue-200 bg-blue-50",
    R3: "text-orange-600 border-orange-200 bg-orange-50",
    R4: "text-red-600 border-red-200 bg-red-50",
  };
  return colors[riskLevel];
}
