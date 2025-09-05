import {
  getSignalsByCategory,
  getDirectionLabel,
  getDirectionColor,
  getUrlFromDbFieldName,
} from "@/config/signals-config";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  Target,
  Shield,
  Square,
  Minus,
  ArrowUp,
  LineChart,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

// 图标映射
const iconMap = {
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  Target,
  Shield,
  Square,
  Minus,
  ArrowUp,
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

export default function DailySignalsPage() {
  const dailySignals = getSignalsByCategory("daily");
  const enabledSignals = dailySignals.filter((signal) => signal.enabled);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">日线信号</h1>
        <p className="text-muted-foreground">
          中长期投资机会识别，适用于趋势跟踪和波段交易策略。共有 {enabledSignals.length} 种信号类型可用。
        </p>
      </div>

      {/* 信号统计概览 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">总信号类型</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dailySignals.length}</div>
            <div className="text-muted-foreground text-xs">启用 {enabledSignals.length} 个</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">低风险信号 (R1)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {enabledSignals.filter((s) => s.riskLevel === "R1").length}
            </div>
            <div className="text-muted-foreground text-xs">最安全的信号</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">中等风险 (R2-R3)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {enabledSignals.filter((s) => s.riskLevel === "R2" || s.riskLevel === "R3").length}
            </div>
            <div className="text-muted-foreground text-xs">平衡风险收益</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">高风险信号 (R4)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {enabledSignals.filter((s) => s.riskLevel === "R4").length}
            </div>
            <div className="text-muted-foreground text-xs">谨慎使用</div>
          </CardContent>
        </Card>
      </div>

      {/* 信号卡片网格 */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {enabledSignals.map((signal) => {
          const IconComponent = signal.icon ? iconMap[signal.icon as keyof typeof iconMap] : Target;

          return (
            <Card key={signal.id} className="relative overflow-hidden">
              <div className="absolute top-0 left-0 h-full w-1" style={{ backgroundColor: signal.color }} />
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="rounded-lg p-2"
                      style={{
                        backgroundColor: `${signal.color}20`,
                        color: signal.color,
                      }}
                    >
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{signal.displayName}</CardTitle>
                      <div className="mt-1 flex items-center gap-2">
                        <Badge variant="secondary" className={riskLevelColors[signal.riskLevel]}>
                          {signal.riskLevel}
                        </Badge>
                        <Badge variant="outline" className={`text-xs ${getDirectionColor(signal.direction)}`}>
                          {getDirectionLabel(signal.direction)}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {signal.name}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-sm leading-relaxed">{signal.description}</CardDescription>

                {/* 模拟统计数据 */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="space-y-1">
                    <div className="text-lg font-semibold text-green-600">{Math.floor(Math.random() * 15) + 8}</div>
                    <div className="text-muted-foreground text-xs">今日信号</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-lg font-semibold text-blue-600">{Math.floor(Math.random() * 25) + 65}%</div>
                    <div className="text-muted-foreground text-xs">胜率</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-lg font-semibold text-purple-600">{Math.floor(Math.random() * 15) + 8}%</div>
                    <div className="text-muted-foreground text-xs">平均收益</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button asChild size="sm" className="flex-1" style={{ backgroundColor: signal.color }}>
                    <Link href={`/signals/daily/${getUrlFromDbFieldName(signal.name) || signal.name.toLowerCase()}`}>
                      查看信号
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm">
                    技术分析
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 风险提示 */}
      <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20">
        <CardHeader>
          <CardTitle className="text-blue-800 dark:text-blue-400">日线信号特性</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700 dark:text-blue-300">
          <ul className="space-y-2 text-sm">
            <li>
              • <strong>时间周期</strong>：基于日线数据，适合中长期持有
            </li>
            <li>
              • <strong>信号频次</strong>：相对较少但质量较高，适合波段交易
            </li>
            <li>
              • <strong>风险控制</strong>：止损空间较大，适合风险承受能力强的投资者
            </li>
            <li>
              • <strong>收益特征</strong>：单笔收益潜力较大，但需要耐心等待
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
