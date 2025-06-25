import { TrendingUp, TrendingDown, Activity } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface SignalStatsCardProps {
  title: string;
  description: string;
  totalCount: number;
  activeCount: number;
  bullishCount: number;
  bearishCount: number;
  color?: string;
  isLoading?: boolean;
}

export function SignalStatsCard({
  title,
  description,
  totalCount,
  activeCount,
  bullishCount,
  bearishCount,
  color = "#3b82f6",
  isLoading = false,
}: SignalStatsCardProps) {
  const bullishPercentage = activeCount > 0 ? (bullishCount / activeCount) * 100 : 0;
  const bearishPercentage = activeCount > 0 ? (bearishCount / activeCount) * 100 : 0;

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">加载中...</CardTitle>
            <div className="h-3 w-3 animate-pulse rounded-full bg-gray-300" />
          </div>
          <CardDescription>正在获取统计数据...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-4 animate-pulse rounded bg-gray-200" />
            <div className="h-4 animate-pulse rounded bg-gray-200" />
            <div className="h-4 animate-pulse rounded bg-gray-200" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:bg-muted/50 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 总数和活跃数 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{totalCount}</div>
            <div className="text-muted-foreground text-xs">总信号数</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{activeCount}</div>
            <div className="text-muted-foreground text-xs">活跃信号</div>
          </div>
        </div>

        {/* 方向分布 */}
        {activeCount > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">信号方向分布</span>
            </div>

            {/* 看涨信号 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm">看涨</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{bullishCount}</span>
                <Badge variant="secondary" className="text-xs">
                  {bullishPercentage.toFixed(0)}%
                </Badge>
              </div>
            </div>
            <Progress value={bullishPercentage} className="h-2" />

            {/* 看跌信号 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-red-600" />
                <span className="text-sm">看跌</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{bearishCount}</span>
                <Badge variant="secondary" className="text-xs">
                  {bearishPercentage.toFixed(0)}%
                </Badge>
              </div>
            </div>
            <Progress value={bearishPercentage} className="h-2" />
          </div>
        )}

        {/* 活跃度指标 */}
        <div className="flex items-center justify-between border-t pt-2">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-blue-600" />
            <span className="text-muted-foreground text-sm">活跃度</span>
          </div>
          <Badge variant={activeCount > 0 ? "default" : "secondary"} className="text-xs">
            {totalCount > 0 ? Math.round((activeCount / totalCount) * 100) : 0}%
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
