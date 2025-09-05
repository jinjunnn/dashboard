import { Suspense } from "react";
import { notFound } from "next/navigation";
import { findSignalConfig, getSignalsByCategory, getDirectionLabel, getDirectionColor } from "@/config/signals-config";
import { getSignalsFromDatabase, getSignalStatsFromDatabase } from "@/lib/database/signals-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LoadingCard } from "@/components/ui/loading-spinner";
import { SignalsTable } from "@/components/signals/signals-table";
import { TrendingUp, Activity, BarChart3, Target, Shield, Square, Zap, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";

// 图标映射
const iconMap = {
  TrendingUp,
  Activity,
  BarChart3,
  Target,
  Shield,
  Square,
  Zap,
  RefreshCw,
};

// 风险等级颜色映射
const riskLevelColors = {
  R1: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  R2: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  R3: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
  R4: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
};

interface SignalTypePageProps {
  params: Promise<{
    signalType: string;
  }>;
}

// 获取信号类型数据
async function getSignalTypeData(signalType: string) {
  try {
    // 验证信号类型是否存在
    const signalConfig = findSignalConfig(signalType, "intraday");
    if (!signalConfig) {
      return null;
    }

    // 获取该类型的所有信号
    const signals = await getSignalsFromDatabase({
      category: "intraday",
      signalName: signalType.toUpperCase(),
      limit: 100,
    });

    // 获取统计信息
    const stats = await getSignalStatsFromDatabase("intraday");

    return {
      signalConfig,
      signals,
      stats,
    };
  } catch (error) {
    console.error("获取信号类型数据失败:", error);
    return null;
  }
}

// Loading组件
function SignalTypeLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="h-8 w-24 animate-pulse rounded bg-gray-200" />
        <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <LoadingCard key={i} title="正在加载统计..." />
        ))}
      </div>
      <LoadingCard title="正在加载信号列表..." />
    </div>
  );
}

// 主页面组件
async function SignalTypeContent({ params }: SignalTypePageProps) {
  const resolvedParams = await params;
  const signalType = resolvedParams.signalType;

  // 获取信号类型数据
  const data = await getSignalTypeData(signalType);

  if (!data) {
    notFound();
  }

  const { signalConfig, signals, stats } = data;
  const IconComponent = signalConfig.icon ? iconMap[signalConfig.icon as keyof typeof iconMap] : Target;

  return (
    <div className="space-y-6">
      {/* 返回按钮和标题 */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/signals/intraday">
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回日内信号
          </Link>
        </Button>
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold">
            <div
              className="rounded-lg p-2"
              style={{
                backgroundColor: `${signalConfig.color}20`,
                color: signalConfig.color,
              }}
            >
              <IconComponent className="h-6 w-6" />
            </div>
            {signalConfig.displayName}
          </h1>
          <div className="mt-2 flex items-center gap-2">
            <Badge variant="secondary" className={riskLevelColors[signalConfig.riskLevel]}>
              风险等级: {signalConfig.riskLevel}
            </Badge>
            <Badge variant="outline" className={getDirectionColor(signalConfig.direction)}>
              {getDirectionLabel(signalConfig.direction)}
            </Badge>
            <Badge variant="outline">日内信号</Badge>
          </div>
          {signalConfig.description && <p className="text-muted-foreground mt-2">{signalConfig.description}</p>}
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总信号数</CardTitle>
            <BarChart3 className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{signals.length}</div>
            <p className="text-muted-foreground text-xs">该类型的所有信号</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">今日新增</CardTitle>
            <TrendingUp className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                signals.filter((s) => {
                  const today = new Date().toDateString();
                  return new Date(s.created_at).toDateString() === today;
                }).length
              }
            </div>
            <p className="text-muted-foreground text-xs">今日产生的信号数</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">平均置信度</CardTitle>
            <Target className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {signals.length > 0 ? Math.round(signals.reduce((sum, s) => sum + s.confidence, 0) / signals.length) : 0}%
            </div>
            <p className="text-muted-foreground text-xs">信号质量指标</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">活跃股票</CardTitle>
            <Activity className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(signals.map((s) => s.symbol)).size}</div>
            <p className="text-muted-foreground text-xs">涉及的股票数量</p>
          </CardContent>
        </Card>
      </div>

      {/* 信号列表 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            {signalConfig.displayName} 信号列表
          </CardTitle>
          <CardDescription>查看所有 {signalConfig.displayName} 类型的信号详情</CardDescription>
        </CardHeader>
        <CardContent>
          <SignalsTable signals={signals} title={`${signalConfig.displayName} 信号列表`} category="intraday" />
        </CardContent>
      </Card>
    </div>
  );
}

// 导出主页面
export default function SignalTypePage({ params }: SignalTypePageProps) {
  return (
    <Suspense fallback={<SignalTypeLoading />}>
      <SignalTypeContent params={params} />
    </Suspense>
  );
}
