import { Suspense } from "react"
import { notFound } from "next/navigation"
import { findSignalConfig, getDirectionLabel, getDirectionColor } from "@/config/signals-config"
import { getSignals } from "@/lib/services/signals-service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LoadingCard } from "@/components/ui/loading-spinner"
import { SignalsTable } from "@/components/signals/signals-table"

import { TrendingUp, Activity, BarChart3, Target, Shield, Square, Zap } from "lucide-react"

// 图标映射
const iconMap = {
  TrendingUp,
  Activity,
  BarChart3,
  Target,
  Shield,
  Square,
  Zap,
}

// 风险等级颜色映射
const riskLevelColors = {
  R1: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  R2: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400", 
  R3: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
  R4: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
}

interface IntradaySignalTypePageProps {
  params: Promise<{
    signalType: string
  }>
}

// 获取信号类型的数据
async function getSignalTypeData(signalType: string) {
  try {
    // 验证信号类型是否存在
    const signalConfig = findSignalConfig(signalType, "intraday")
    if (!signalConfig) {
      return null
    }

    // 获取该类型的所有信号
    const signals = await getSignals({
      category: "intraday",
      signalName: signalConfig.name,
      limit: 100
    })

    return {
      signalConfig,
      signals
    }
  } catch (error) {
    console.error("获取信号类型数据失败:", error)
    return null
  }
}

// Loading组件
function SignalTypeLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
        <div className="w-64 h-8 bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <LoadingCard key={i} title="正在加载统计数据..." />
        ))}
      </div>
      <LoadingCard title="正在加载信号列表..." />
    </div>
  )
}

// 信号类型页面组件
async function SignalTypeContent({ params }: IntradaySignalTypePageProps) {
  const resolvedParams = await params
  const { signalType } = resolvedParams
  
  // 获取信号类型数据
  const data = await getSignalTypeData(signalType)
  
  if (!data) {
    notFound()
  }
  
  const { signalConfig, signals } = data
  const IconComponent = signalConfig.icon ? iconMap[signalConfig.icon as keyof typeof iconMap] : Target
  
  // 计算统计数据
  const totalSignals = signals.length
  const bullishSignals = signals.filter(s => s.direction === "BULLISH").length
  const bearishSignals = signals.filter(s => s.direction === "BEARISH").length
  const averageConfidence = signals.length > 0 
    ? Math.round(signals.reduce((sum, s) => sum + s.confidence, 0) / signals.length)
    : 0

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center gap-4">
        <div 
          className="p-2 rounded-lg"
          style={{ 
            backgroundColor: `${signalConfig.color}20`,
            color: signalConfig.color 
          }}
        >
          <IconComponent className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">{signalConfig.displayName}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge 
              variant="outline" 
              className={getDirectionColor(signalConfig.direction)}
            >
              {getDirectionLabel(signalConfig.direction)}
            </Badge>
            <Badge 
              variant="secondary" 
              className={riskLevelColors[signalConfig.riskLevel]}
            >
              风险等级: {signalConfig.riskLevel}
            </Badge>
            <Badge variant="outline">
              日内信号
            </Badge>
          </div>
          {signalConfig.description && (
            <p className="text-muted-foreground mt-2">{signalConfig.description}</p>
          )}
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">信号总数</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSignals}</div>
            <p className="text-xs text-muted-foreground">该类型的信号总数</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">看涨信号</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{bullishSignals}</div>
            <p className="text-xs text-muted-foreground">
              占比 {totalSignals > 0 ? Math.round((bullishSignals / totalSignals) * 100) : 0}%
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">看跌信号</CardTitle>
            <Activity className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{bearishSignals}</div>
            <p className="text-xs text-muted-foreground">
              占比 {totalSignals > 0 ? Math.round((bearishSignals / totalSignals) * 100) : 0}%
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">平均置信度</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageConfidence}%</div>
            <p className="text-xs text-muted-foreground">信号的平均置信度</p>
          </CardContent>
        </Card>
      </div>

      {/* 信号配置信息 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            信号配置信息
          </CardTitle>
          <CardDescription>
            该信号类型的详细配置和特征
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">信号类型</div>
              <div className="font-semibold">{signalConfig.displayName}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">信号方向</div>
              <Badge 
                variant="outline" 
                className={getDirectionColor(signalConfig.direction)}
              >
                {getDirectionLabel(signalConfig.direction)}
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">风险等级</div>
              <Badge 
                variant="secondary" 
                className={riskLevelColors[signalConfig.riskLevel]}
              >
                {signalConfig.riskLevel}
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">信号分类</div>
              <Badge variant="outline">日内信号</Badge>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">主题颜色</div>
              <div className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded border"
                  style={{ backgroundColor: signalConfig.color }}
                />
                <span className="font-mono text-sm">{signalConfig.color}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">系统名称</div>
              <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                {signalConfig.name}
              </code>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 信号列表 */}
      <SignalsTable 
        signals={signals} 
        title={`${signalConfig.displayName} - 信号列表`}
        category="intraday"
        signalType={signalType}
        isSignalPage={true}
      />
    </div>
  )
}

// 导出主页面
export default function IntradaySignalTypePage({ params }: IntradaySignalTypePageProps) {
  return (
    <Suspense fallback={<SignalTypeLoading />}>
      <SignalTypeContent params={params} />
    </Suspense>
  )
} 