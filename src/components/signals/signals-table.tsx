"use client"

import { Signal } from "@/lib/services/signals-service"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LoadingTable } from "@/components/ui/loading-spinner"
import Link from "next/link"
import { ExternalLink, TrendingUp, TrendingDown } from "lucide-react"

interface SignalsTableProps {
  signals: Signal[]
  title: string
  isLoading?: boolean
  signalType?: string // 信号类型 (如 swing_high_breakout)
  category?: "intraday" | "daily" // 信号类别
  isStockPage?: boolean // 是否为股票页面，影响显示的列
  isSignalPage?: boolean // 是否为信号页面，影响显示的列
}

export function SignalsTable({ 
  signals, 
  title, 
  isLoading = false, 
  signalType, 
  category, 
  isStockPage = false,
  isSignalPage = false 
}: SignalsTableProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {title}
            <Badge variant="outline" className="ml-2">
              加载中...
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingTable />
        </CardContent>
      </Card>
    )
  }

  if (signals.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            暂无信号数据
          </div>
        </CardContent>
      </Card>
    )
  }

  // 格式化meta_data为可读文本
  const formatMetaData = (metaData: Record<string, unknown>) => {
    if (!metaData || Object.keys(metaData).length === 0) {
      return "-"
    }
    
    return Object.entries(metaData)
      .map(([key, value]) => `${key}: ${value}`)
      .join(", ")
  }

  // 格式化价格显示
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
    }).format(price)
  }

  // 格式化涨跌幅显示
  const formatChangeRate = (metaData: Record<string, unknown>) => {
    const changeRate = metaData?.change_rate;
    if (changeRate === null || changeRate === undefined) {
      return "-";
    }
    
    const rate = Number(changeRate);
    const isPositive = rate > 0;
    const isNegative = rate < 0;
    
    return (
      <div className={`flex items-center gap-1 ${isPositive ? 'text-red-600' : isNegative ? 'text-green-600' : 'text-gray-600'}`}>
        {isPositive && <TrendingUp className="w-3 h-3" />}
        {isNegative && <TrendingDown className="w-3 h-3" />}
        <span className="font-medium">{isPositive ? '+' : ''}{rate.toFixed(2)}%</span>
      </div>
    );
  }

  // 获取触发时价格（从meta_data中）
  const getTriggerPrice = (metaData: Record<string, unknown>, signalPrice: number) => {
    const triggerPrice = metaData?.price;
    if (triggerPrice !== null && triggerPrice !== undefined) {
      return formatPrice(Number(triggerPrice));
    }
    // 如果meta_data中没有price，使用signal的price字段
    return formatPrice(signalPrice);
  }

  // 格式化方向显示 - 修复数字到文字的转换
  const formatDirection = (direction: any) => {
    // 处理数字形式的方向
    if (typeof direction === 'number') {
      if (direction === 1) return "看涨";
      if (direction === -1) return "看跌";
      return "未知";
    }
    
    // 处理字符串形式的方向
    if (typeof direction === 'string') {
      if (direction === "BULLISH" || direction === "bullish") return "看涨";
      if (direction === "BEARISH" || direction === "bearish") return "看跌";
      return direction;
    }
    
    return "未知";
  }

  // 获取方向文字颜色
  const getDirectionColor = (direction: any) => {
    if (typeof direction === 'number') {
      return direction === 1 ? "text-green-600" : direction === -1 ? "text-red-600" : "text-gray-600";
    }
    
    if (typeof direction === 'string') {
      if (direction === "BULLISH" || direction === "bullish") return "text-green-600";
      if (direction === "BEARISH" || direction === "bearish") return "text-red-600";
    }
    
    return "text-gray-600";
  }



  // 获取行业信息
  const getIndustry = (stock: any) => {
    return stock?.meta_data?.industry || "-";
  }

  // 格式化日期显示
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {title}
          <Badge variant="outline" className="ml-2">
            {signals.length} 条记录
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[100px]">ID</TableHead>
                {/* 股票页面简化显示列 */}
                {isStockPage ? (
                  <>
                    <TableHead>信号类型</TableHead>
                    <TableHead>触发时价格</TableHead>
                    <TableHead>涨跌幅</TableHead>
                    <TableHead>方向</TableHead>
                    <TableHead>创建时间</TableHead>
                    <TableHead className="text-right">状态</TableHead>
                  </>
                ) : isSignalPage ? (
                  /* 信号页面显示列 - 去掉市场、置信度、meta_data列 */
                  <>
                    <TableHead>股票代码</TableHead>
                    <TableHead>股票名称</TableHead>
                    <TableHead>行业</TableHead>
                    <TableHead>价格</TableHead>
                    <TableHead>触发时价格</TableHead>
                    <TableHead>涨跌幅</TableHead>
                    <TableHead>方向</TableHead>
                    <TableHead>创建时间</TableHead>
                    <TableHead className="text-right">状态</TableHead>
                  </>
                ) : (
                  /* 默认显示所有列 */
                  <>
                    <TableHead>股票代码</TableHead>
                    <TableHead>股票名称</TableHead>
                    <TableHead>行业</TableHead>
                    <TableHead>价格</TableHead>
                    <TableHead>方向</TableHead>
                    <TableHead>置信度</TableHead>
                    <TableHead>创建时间</TableHead>
                    <TableHead>元数据</TableHead>
                    <TableHead className="text-right">状态</TableHead>
                  </>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {signals.map((signal) => {
                // 构建详情页面链接 - 使用新的嵌套路由
                const detailLink = category && signalType
                  ? `/signals/${category}/${signalType}/${signal.id}`
                  : null

                return (
                  <TableRow 
                    key={signal.id} 
                    className={`hover:bg-muted/50 ${detailLink ? 'cursor-pointer' : ''}`}
                    onClick={detailLink ? () => window.location.href = detailLink : undefined}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        #{signal.id}
                        {detailLink && <ExternalLink className="w-3 h-3 text-muted-foreground" />}
                      </div>
                    </TableCell>
                    
                    {/* 股票页面简化显示 */}
                    {isStockPage ? (
                      <>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs">
                            {signal.signal_type}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono">
                          {getTriggerPrice(signal.meta_data, signal.price)}
                        </TableCell>
                        <TableCell>
                          {formatChangeRate(signal.meta_data)}
                        </TableCell>
                        <TableCell>
                          <span className={`font-medium ${getDirectionColor(signal.direction)}`}>
                            {formatDirection(signal.direction)}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(signal.created_at)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge 
                            variant={signal.status === "active" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {signal.status === "active" ? "活跃" : "已过期"}
                          </Badge>
                        </TableCell>
                      </>
                    ) : isSignalPage ? (
                      /* 信号页面显示 - 去掉市场、置信度、meta_data列 */
                      <>
                        <TableCell>
                          <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                            {signal.symbol}
                          </code>
                        </TableCell>
                        <TableCell className="font-medium">
                          {signal.stock?.name || "未知"}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {getIndustry(signal.stock)}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono">
                          {formatPrice(signal.price)}
                        </TableCell>
                        <TableCell className="font-mono">
                          {getTriggerPrice(signal.meta_data, signal.price)}
                        </TableCell>
                        <TableCell>
                          {formatChangeRate(signal.meta_data)}
                        </TableCell>
                        <TableCell>
                          <span className={`font-medium ${getDirectionColor(signal.direction)}`}>
                            {formatDirection(signal.direction)}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(signal.created_at)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge 
                            variant={signal.status === "active" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {signal.status === "active" ? "活跃" : "已过期"}
                          </Badge>
                        </TableCell>
                      </>
                    ) : (
                      /* 默认显示所有列 */
                      <>
                        <TableCell>
                          <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                            {signal.symbol}
                          </code>
                        </TableCell>
                        <TableCell className="font-medium">
                          {signal.stock?.name || "未知"}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {getIndustry(signal.stock)}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono">
                          {formatPrice(signal.price)}
                        </TableCell>
                        <TableCell>
                          <span className={`font-medium ${getDirectionColor(signal.direction)}`}>
                            {formatDirection(signal.direction)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="text-sm font-medium">{signal.confidence}%</div>
                            <div className="w-16 bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${signal.confidence}%` }}
                              ></div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(signal.created_at)}
                        </TableCell>
                        <TableCell className="max-w-[200px]">
                          <div className="text-xs text-muted-foreground truncate" title={formatMetaData(signal.meta_data)}>
                            {formatMetaData(signal.meta_data)}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge 
                            variant={signal.status === "active" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {signal.status === "active" ? "活跃" : "已过期"}
                          </Badge>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
} 