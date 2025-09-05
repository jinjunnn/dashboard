import { Suspense } from "react";
import { notFound } from "next/navigation";
import { findSignalConfig, getDirectionLabel, getDirectionColor } from "@/config/signals-config";
import { getSignalsFromDatabase } from "@/lib/database/signals-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LoadingCard } from "@/components/ui/loading-spinner";
import { SignalsTable } from "@/components/signals/signals-table";
import {
  TrendingUp,
  Activity,
  BarChart3,
  Target,
  Shield,
  Square,
  Zap,
  ArrowLeft,
  TrendingDown,
  ArrowUp,
  Minus,
  LineChart,
  RefreshCw,
  Share2,
  BookmarkPlus,
  AlertCircle,
  Download,
} from "lucide-react";
import Link from "next/link";
import TradingViewWrapper from "@/components/charts/TradingViewWrapper";

// 图标映射
const iconMap = {
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  Target,
  Shield,
  Square,
  Zap,
  ArrowUp,
  Minus,
  LineChart,
  RefreshCw,
};

// 风险等级颜色映射
const riskLevelColors = {
  R1: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  R2: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  R3: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
  R4: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
};

interface SignalDetailPageProps {
  params: Promise<{
    signalType: string;
    id: string;
  }>;
}

// 获取单个信号的详细数据
async function getSignalDetailData(signalId: string, signalType: string) {
  try {
    // 验证信号类型是否存在
    const signalConfig = findSignalConfig(signalType, "daily");
    if (!signalConfig) {
      return null;
    }

    // 首先获取所有日线信号来找到这个信号
    const allSignals = await getSignalsFromDatabase({
      category: "daily",
      limit: 1000,
    });

    // 查找指定ID的信号
    const signal = allSignals.find((s) => s.id.toString() === signalId);

    if (!signal) {
      return null;
    }

    // 验证信号类型是否匹配
    const actualSignalConfig = findSignalConfig(signal.signal_type, "daily");
    if (!actualSignalConfig || actualSignalConfig.name !== signalConfig.name) {
      return null;
    }

    // 获取相同类型的其他信号
    const relatedSignals = allSignals
      .filter((s) => s.signal_type === signal.signal_type && s.id !== signal.id)
      .slice(0, 10);

    return {
      signal,
      signalConfig,
      relatedSignals,
    };
  } catch (error) {
    console.error("获取信号详情失败:", error);
    return null;
  }
}

// Loading组件
function SignalDetailLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="h-8 w-24 animate-pulse rounded bg-gray-200" />
        <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <LoadingCard key={i} title="正在加载信号信息..." />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <LoadingCard key={i} title="正在加载分析数据..." />
        ))}
      </div>
      <LoadingCard title="正在加载交易建议..." />
    </div>
  );
}

// 信号详情页面组件
async function SignalDetailContent({ params }: SignalDetailPageProps) {
  const resolvedParams = await params;
  const { signalType, id } = resolvedParams;

  // 获取信号详情数据
  const data = await getSignalDetailData(id, signalType);

  if (!data) {
    notFound();
  }

  const { signal, signalConfig, relatedSignals } = data;
  const IconComponent = signalConfig.icon ? iconMap[signalConfig.icon as keyof typeof iconMap] : Target;

  // 格式化价格显示
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("zh-CN", {
      style: "currency",
      currency: "CNY",
      minimumFractionDigits: 2,
    }).format(price);
  };

  // 格式化日期显示
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("zh-CN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 生成模拟的技术分析数据（日线级别）
  const generateTechnicalData = (signal: any) => {
    const basePrice = signal.price;
    const priceVariation = basePrice * 0.15;

    return {
      supportLevel: Math.round((basePrice - priceVariation * 0.4) * 100) / 100,
      resistanceLevel: Math.round((basePrice + priceVariation * 0.5) * 100) / 100,
      targetPrice: Math.round((basePrice + priceVariation * 0.8) * 100) / 100,
      stopLoss: Math.round((basePrice - priceVariation * 0.25) * 100) / 100,
      riskRewardRatio: "1:3.2",
      volatility: Math.round((20 + Math.random() * 25) * 10) / 10,
      trendStrength: Math.round((75 + Math.random() * 20) * 10) / 10,
      volume: Math.round(signal.id * 1500 + Math.random() * 80000),
      avgVolume: Math.round(signal.id * 1200 + Math.random() * 60000),
    };
  };

  // 生成模拟的历史表现数据（日线级别）
  const generatePerformanceData = (signalConfig: any) => {
    return {
      successRate: Math.round((78 + Math.random() * 17) * 10) / 10,
      avgReturn: Math.round((12 + Math.random() * 20) * 10) / 10,
      maxDrawdown: Math.round((4 + Math.random() * 10) * 10) / 10,
      totalTrades: Math.round(80 + Math.random() * 120),
      winningTrades: 0,
      losingTrades: 0,
      avgHoldingPeriod: Math.round(5 + Math.random() * 15),
      sharpeRatio: Math.round((1.4 + Math.random() * 1.8) * 100) / 100,
    };
  };

  // 转换股票代码为 TradingView 格式
  const convertToTradingViewSymbol = (symbol: string) => {
    // 移除点号，统一处理
    const cleanSymbol = symbol.replace(/\./g, '');
    
    if (cleanSymbol.startsWith('SZ')) {
      // 深圳股票：SZ000001 -> SZSE:000001
      return `SZSE:${cleanSymbol.substring(2)}`;
    } else if (cleanSymbol.startsWith('SH')) {
      // 上海股票：SH600000 -> SSE:600000
      return `SSE:${cleanSymbol.substring(2)}`;
    } else if (/^\d{6}$/.test(cleanSymbol)) {
      // 纯数字6位，根据开头判断市场
      if (cleanSymbol.startsWith('0') || cleanSymbol.startsWith('3')) {
        return `SZSE:${cleanSymbol}`;
      } else if (cleanSymbol.startsWith('6')) {
        return `SSE:${cleanSymbol}`;
      }
    }
    
    // 默认返回原始符号，可能是港股或美股
    return cleanSymbol;
  };

  const technicalData = generateTechnicalData(signal);
  const performanceData = generatePerformanceData(signalConfig);
  performanceData.winningTrades = Math.round((performanceData.totalTrades * performanceData.successRate) / 100);
  performanceData.losingTrades = performanceData.totalTrades - performanceData.winningTrades;

  return (
    <div className="space-y-6">
      {/* 固定顶部栏 */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b pb-4">
        <div className="flex items-center justify-between">
          {/* 左侧：返回按钮和标题 */}
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/signals/daily/${signalType}`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                返回 {signalConfig.displayName} 列表
              </Link>
            </Button>
            <div className="flex items-center gap-3">
              <div
                className="rounded-lg p-2"
                style={{
                  backgroundColor: `${signalConfig.color}20`,
                  color: signalConfig.color,
                }}
              >
                <IconComponent className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold">信号详情 #{signal.id.slice(-8)}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className={riskLevelColors[signalConfig.riskLevel]} size="sm">
                    {signalConfig.displayName}
                  </Badge>
                  <Badge variant="outline" className={getDirectionColor(signalConfig.direction)} size="sm">
                    {getDirectionLabel(signalConfig.direction)}
                  </Badge>
                  <Badge variant="outline" size="sm">风险: {signalConfig.riskLevel}</Badge>
                </div>
              </div>
            </div>
          </div>
          
          {/* 右侧：功能按钮 */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" title="分享信号">
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">分享</span>
            </Button>
            <Button variant="outline" size="sm" title="收藏信号">
              <BookmarkPlus className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">收藏</span>
            </Button>
            <Button variant="outline" size="sm" title="设置提醒">
              <AlertCircle className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">提醒</span>
            </Button>
            <Button variant="outline" size="sm" title="导出报告">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">导出</span>
            </Button>
          </div>
        </div>
      </div>

      {/* 信号基本信息卡片 */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* 股票信息 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              股票信息
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-muted-foreground text-sm">股票代码</div>
                <code className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                  {signal.symbol}
                </code>
              </div>
              <div>
                <div className="text-muted-foreground text-sm">股票名称</div>
                <div className="font-medium">{signal.stock?.name || "未知"}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-sm">市场</div>
                <Badge variant="outline">{signal.stock?.market || "-"}</Badge>
              </div>
              <div>
                <div className="text-muted-foreground text-sm">信号价格</div>
                <div className="font-mono text-lg font-semibold">{formatPrice(signal.price)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 信号详情 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              信号详情
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-muted-foreground text-sm">信号类型</div>
                <Badge variant="outline">{signal.signal_type}</Badge>
              </div>
              <div>
                <div className="text-muted-foreground text-sm">方向</div>
                <Badge variant={signal.direction === "1" ? "default" : signal.direction === "-1" ? "destructive" : "secondary"}>
                  {signal.direction === "1" ? "看涨" : signal.direction === "-1" ? "看跌" : "未知"}
                </Badge>
              </div>
              <div>
                <div className="text-muted-foreground text-sm">置信度</div>
                <div className="flex items-center gap-2">
                  <div className="font-semibold">{signal.confidence}%</div>
                  <div className="h-2 w-16 rounded-full bg-gray-200 dark:bg-gray-700">
                    <div className="h-2 rounded-full bg-blue-600" style={{ width: `${signal.confidence}%` }}></div>
                  </div>
                </div>
              </div>
              <div>
                <div className="text-muted-foreground text-sm">创建时间</div>
                <div className="text-sm">{formatDate(signal.created_at)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 市场环境 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              市场环境
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-muted-foreground text-sm">趋势强度</div>
                <div className="flex items-center gap-2">
                  <div className="font-semibold">{technicalData.trendStrength}%</div>
                  <div className="h-2 w-16 rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className="h-2 rounded-full bg-green-600"
                      style={{ width: `${technicalData.trendStrength}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div>
                <div className="text-muted-foreground text-sm">波动率</div>
                <div className="font-semibold">{technicalData.volatility}%</div>
              </div>
              <div>
                <div className="text-muted-foreground text-sm">成交量</div>
                <div className="font-mono text-sm">{technicalData.volume.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-sm">平均成交量</div>
                <div className="font-mono text-sm">{technicalData.avgVolume.toLocaleString()}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 技术分析和风险管理 */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* 技术分析 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              技术分析
            </CardTitle>
            <CardDescription>基于日线技术指标的关键价位分析</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-muted-foreground text-sm">支撑位</div>
                <div className="font-mono font-semibold text-green-600">{formatPrice(technicalData.supportLevel)}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-sm">阻力位</div>
                <div className="font-mono font-semibold text-red-600">{formatPrice(technicalData.resistanceLevel)}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-sm">目标价位</div>
                <div className="font-mono font-semibold text-blue-600">{formatPrice(technicalData.targetPrice)}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-sm">止损位</div>
                <div className="font-mono font-semibold text-orange-600">{formatPrice(technicalData.stopLoss)}</div>
              </div>
            </div>
            <div className="border-t pt-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">风险收益比</span>
                <Badge variant="outline" className="font-mono">
                  {technicalData.riskRewardRatio}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 历史表现 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              历史表现
            </CardTitle>
            <CardDescription>该日线信号类型的历史统计数据</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-muted-foreground text-sm">成功率</div>
                <div className="flex items-center gap-2">
                  <div className="font-semibold text-green-600">{performanceData.successRate}%</div>
                  <div className="h-2 w-16 rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className="h-2 rounded-full bg-green-600"
                      style={{ width: `${performanceData.successRate}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div>
                <div className="text-muted-foreground text-sm">平均收益</div>
                <div className="font-semibold text-blue-600">+{performanceData.avgReturn}%</div>
              </div>
              <div>
                <div className="text-muted-foreground text-sm">最大回撤</div>
                <div className="font-semibold text-red-600">-{performanceData.maxDrawdown}%</div>
              </div>
              <div>
                <div className="text-muted-foreground text-sm">夏普比率</div>
                <div className="font-semibold">{performanceData.sharpeRatio}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-sm">总交易次数</div>
                <div className="font-semibold">{performanceData.totalTrades}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-sm">平均持仓</div>
                <div className="font-semibold">{performanceData.avgHoldingPeriod}天</div>
              </div>
            </div>
            <div className="border-t pt-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-green-600">盈利: {performanceData.winningTrades}次</span>
                <span className="text-red-600">亏损: {performanceData.losingTrades}次</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 交易建议 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            交易建议
          </CardTitle>
          <CardDescription>基于日线信号的中长期交易策略建议</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-3">
              <h4 className="font-semibold text-green-600">入场策略</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">建议入场价</span>
                  <span className="font-mono">{formatPrice(signal.price * 0.995)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">最佳入场区间</span>
                  <span className="font-mono">
                    {formatPrice(signal.price * 0.99)} - {formatPrice(signal.price * 1.005)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">建议仓位</span>
                  <Badge variant="outline">
                    {signalConfig.riskLevel === "R1"
                      ? "40-50%"
                      : signalConfig.riskLevel === "R2"
                        ? "30-40%"
                        : signalConfig.riskLevel === "R3"
                          ? "20-30%"
                          : "10-20%"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-blue-600">持仓管理</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">止损位</span>
                  <span className="font-mono text-red-600">{formatPrice(technicalData.stopLoss)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">第一目标</span>
                  <span className="font-mono text-green-600">{formatPrice(technicalData.targetPrice * 0.6)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">最终目标</span>
                  <span className="font-mono text-blue-600">{formatPrice(technicalData.targetPrice)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-purple-600">风险提示</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className={riskLevelColors[signalConfig.riskLevel]}>
                    {signalConfig.riskLevel}
                  </Badge>
                  <span className="text-muted-foreground">风险等级</span>
                </div>
                <div className="text-muted-foreground">
                  {signalConfig.riskLevel === "R1"
                    ? "低风险，适合长期持有"
                    : signalConfig.riskLevel === "R2"
                      ? "中低风险，适合中期投资"
                      : signalConfig.riskLevel === "R3"
                        ? "中高风险，需要密切关注"
                        : "高风险，建议分批建仓"}
                </div>
                <div className="text-muted-foreground text-xs">* 日线信号适合中长期投资策略，建议结合基本面分析</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* TradingView 图表 */}
      <TradingViewWrapper
        symbol={convertToTradingViewSymbol(signal.symbol)}
        stockName={signal.stock?.name || signal.symbol}
        interval="D"
      />

      {/* 相关信号 */}
      {relatedSignals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              相关信号
            </CardTitle>
            <CardDescription>同类型的其他信号</CardDescription>
          </CardHeader>
          <CardContent>
            <SignalsTable
              signals={relatedSignals}
              title="相关信号列表"
              category="daily"
              signalType={signalType}
              isSignalPage={true}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// 导出主页面
export default function SignalDetailPage({ params }: SignalDetailPageProps) {
  return (
    <Suspense fallback={<SignalDetailLoading />}>
      <SignalDetailContent params={params} />
    </Suspense>
  );
}
