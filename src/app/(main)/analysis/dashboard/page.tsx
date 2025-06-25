import { Suspense } from "react";

import { SignalStatsCard } from "@/components/signals/signal-stats-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getSignalsByCategory } from "@/config/signals-config";
import { getSignalStats } from "@/lib/services/signals-service";

// 获取真实的信号统计数据
async function getSignalStatsData(category: "intraday" | "daily") {
  try {
    const stats = await getSignalStats(category);
    return stats;
  } catch (error) {
    console.error(`获取${category}信号统计失败:`, error);
    // 返回空数组而不是模拟数据
    return [];
  }
}

async function SignalStatsSection({ category }: { category: "intraday" | "daily" }) {
  const statsData = await getSignalStatsData(category);

  if (statsData.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-muted-foreground">
          {category === "daily" ? "暂无日线信号数据" : "暂无日内信号数据"}
        </div>
        <div className="text-xs text-muted-foreground mt-2">
          {category === "daily" 
            ? "当前数据库中仅包含日内信号数据" 
            : "请检查数据库连接或数据源配置"
          }
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {statsData.map((stats) => (
        <SignalStatsCard
          key={stats.id}
          title={stats.displayName}
          description={stats.description}
          totalCount={stats.count}
          activeCount={stats.activeCount}
          bullishCount={stats.bullishCount}
          bearishCount={stats.bearishCount}
          color={stats.color}
        />
      ))}
    </div>
  );
}

function OverallStatsCard() {
  const intradaySignals = getSignalsByCategory("intraday");
  const dailySignals = getSignalsByCategory("daily");

  // 总体统计数据
  const totalSignalTypes = intradaySignals.length + dailySignals.length;
  const enabledSignalTypes =
    intradaySignals.filter((s) => s.enabled).length + dailySignals.filter((s) => s.enabled).length;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-muted-foreground text-sm font-medium">信号类型总数</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalSignalTypes}</div>
          <div className="text-muted-foreground text-xs">
            日内 {intradaySignals.length} | 日线 {dailySignals.length}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-muted-foreground text-sm font-medium">启用的信号类型</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{enabledSignalTypes}</div>
          <div className="text-muted-foreground text-xs">
            活跃率 {Math.round((enabledSignalTypes / totalSignalTypes) * 100)}%
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-muted-foreground text-sm font-medium">数据源状态</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">实时</div>
          <div className="text-muted-foreground text-xs">Supabase数据库</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-muted-foreground text-sm font-medium">数据覆盖</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">部分</div>
          <div className="text-muted-foreground text-xs">仅日内信号有数据</div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SignalDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">信号仪表板</h1>
        <p className="text-muted-foreground">全面的交易信号监控和分析面板，基于Supabase实时数据。</p>
      </div>

      {/* 总体统计卡片 */}
      <OverallStatsCard />

      {/* 分类信号统计 */}
      <Tabs defaultValue="intraday" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="intraday">日内信号</TabsTrigger>
            <TabsTrigger value="daily">日线信号</TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <Badge variant="outline">实时数据</Badge>
            <Badge variant="secondary">Supabase</Badge>
          </div>
        </div>

        <TabsContent value="intraday" className="space-y-4">
          <div>
            <h3 className="mb-2 text-lg font-semibold">日内信号统计</h3>
            <p className="text-muted-foreground mb-4 text-sm">短期交易信号的实时统计和分析数据</p>
          </div>
          <Suspense fallback={<div>加载中...</div>}>
            <SignalStatsSection category="intraday" />
          </Suspense>
        </TabsContent>

        <TabsContent value="daily" className="space-y-4">
          <div>
            <h3 className="mb-2 text-lg font-semibold">日线信号统计</h3>
            <p className="text-muted-foreground mb-4 text-sm">中长期交易信号的统计和趋势分析</p>
          </div>
          <Suspense fallback={<div>加载中...</div>}>
            <SignalStatsSection category="daily" />
          </Suspense>
        </TabsContent>
      </Tabs>

      {/* 数据源说明 */}
      <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20">
        <CardHeader>
          <CardTitle className="text-blue-800 dark:text-blue-400">
            数据源说明
          </CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700 dark:text-blue-300">
          <ul className="space-y-2 text-sm">
            <li>• <strong>日内信号</strong>：来自Supabase数据库的实时数据</li>
            <li>• <strong>日线信号</strong>：当前数据库中暂无数据，显示为空</li>
            <li>• <strong>统计更新</strong>：每次页面加载时从数据库实时获取</li>
            <li>• <strong>数据完整性</strong>：建议添加日线信号数据源以获得完整分析</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
