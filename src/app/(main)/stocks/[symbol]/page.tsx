import React, { Suspense } from "react";
import { notFound } from "next/navigation";
import { Building2, TrendingUp, Calendar, Activity } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SignalsTable } from "@/components/signals/signals-table";
import { Signal } from "@/lib/services/signals-service";

interface StockPageProps {
  params: Promise<{
    symbol: string;
  }>;
}

interface StockInfo {
  symbol: string;
  name: string;
  market: string;
  meta_data?: any;
  updated_at: string;
}

interface StockSignal {
  id: number;
  symbol: string;
  signal_type: string;
  category: "intraday" | "daily";
  direction: "long" | "short";
  price: number;
  confidence: number;
  status: string;
  created_at: string;
  expires_at: string;
  meta_data?: any;
}

async function getStockInfo(symbol: string): Promise<StockInfo | null> {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from('stock')
      .select('symbol, name, market, meta_data, updated_at')
      .eq('symbol', symbol)
      .single();

    if (error || !data) {
      return null;
    }

    return data;
  } catch (error) {
    console.error('获取股票信息失败:', error);
    return null;
  }
}

async function getStockSignals(symbol: string): Promise<StockSignal[]> {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from('signals')
      .select('id, symbol, signal_type, category, direction, price, confidence, status, created_at, expires_at, meta_data')
      .eq('symbol', symbol)
      .order('created_at', { ascending: false })
      .limit(20); // 限制查询最近20条数据

    if (error) {
      console.error('获取股票信号失败:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('获取股票信号失败:', error);
    return [];
  }
}

// 转换函数：将StockSignal转换为Signal格式，为股票页面特制
function convertToSignalFormat(stockSignals: StockSignal[], stockInfo?: StockInfo): Signal[] {
  return stockSignals.map(signal => ({
    ...signal,
    direction: signal.direction, // direction已经是"long" | "short"，直接使用
    meta_data: signal.meta_data || {},
    stock: {
      name: stockInfo?.name || "未知股票",
      market: stockInfo?.market || "未知市场",
      meta_data: stockInfo?.meta_data || {}
    }
  }));
}

function StockInfoCard({ stock }: { stock: StockInfo }) {
  // 从meta_data中获取行业信息
  const industry = stock.meta_data?.industry || "未知行业";
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Building2 className="h-6 w-6 text-blue-500" />
          <div>
            <CardTitle className="text-xl">{stock.symbol}</CardTitle>
            <CardDescription>{stock.name || "股票名称未知"}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-sm text-muted-foreground">股票代码</div>
            <div className="font-medium">{stock.symbol}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">行业</div>
            <Badge variant="outline">{industry}</Badge>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">数据更新</div>
            <div className="text-sm">{new Date(stock.updated_at).toLocaleDateString()}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">状态</div>
            <Badge variant="default">活跃</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SignalStatsCard({ signals }: { signals: StockSignal[] }) {
  const totalSignals = signals.length;
  const activeSignals = signals.filter(s => s.status === 'active').length;
  const longSignals = signals.filter(s => s.direction === 'long').length;
  const intradaySignals = signals.filter(s => s.category === 'intraday').length;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">信号数量</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalSignals}</div>
          <div className="text-xs text-muted-foreground">最近20条</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">活跃信号</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{activeSignals}</div>
          <div className="text-xs text-muted-foreground">当前有效</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">做多信号</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{longSignals}</div>
          <div className="text-xs text-muted-foreground">做多方向</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">日内信号</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">{intradaySignals}</div>
          <div className="text-xs text-muted-foreground">短期交易</div>
        </CardContent>
      </Card>
    </div>
  );
}

export default async function StockPage({ params }: StockPageProps) {
  const { symbol } = await params;
  const decodedSymbol = decodeURIComponent(symbol);
  
  const [stock, signals] = await Promise.all([
    getStockInfo(decodedSymbol),
    getStockSignals(decodedSymbol)
  ]);

  if (!stock) {
    notFound();
  }

  const intradaySignals = signals.filter(s => s.category === 'intraday');
  const dailySignals = signals.filter(s => s.category === 'daily');

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-3xl font-bold">股票详情</h1>
        <p className="text-muted-foreground">查看股票基本信息和相关交易信号（最近20条）</p>
      </div>

      {/* 股票信息卡片 */}
      <StockInfoCard stock={stock} />

      {/* 信号统计 */}
      <SignalStatsCard signals={signals} />

      {/* 信号列表 */}
      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">全部信号 ({signals.length})</TabsTrigger>
            <TabsTrigger value="intraday">日内信号 ({intradaySignals.length})</TabsTrigger>
            <TabsTrigger value="daily">日线信号 ({dailySignals.length})</TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <Badge variant="outline" className="gap-1">
              <Activity className="h-3 w-3" />
              最新20条
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <Calendar className="h-3 w-3" />
              Supabase
            </Badge>
          </div>
        </div>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                所有交易信号
              </CardTitle>
              <CardDescription>
                {decodedSymbol} 的最新20条交易信号
              </CardDescription>
            </CardHeader>
            <CardContent>
              {signals.length > 0 ? (
                <Suspense fallback={<div>加载中...</div>}>
                  <SignalsTable 
                    signals={convertToSignalFormat(signals, stock)} 
                    title="所有交易信号"
                    category={undefined}
                    signalType={undefined}
                    isStockPage={true}
                  />
                </Suspense>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  暂无信号数据
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="intraday" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                日内交易信号
              </CardTitle>
              <CardDescription>
                {decodedSymbol} 的短期交易信号，适用于日内交易策略
              </CardDescription>
            </CardHeader>
            <CardContent>
              {intradaySignals.length > 0 ? (
                <Suspense fallback={<div>加载中...</div>}>
                  <SignalsTable 
                    signals={convertToSignalFormat(intradaySignals, stock)} 
                    title="日内交易信号"
                    category="intraday"
                    signalType={undefined}
                    isStockPage={true}
                  />
                </Suspense>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  暂无日内信号数据
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="daily" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                日线交易信号
              </CardTitle>
              <CardDescription>
                {decodedSymbol} 的中长期交易信号，适用于波段和趋势交易
              </CardDescription>
            </CardHeader>
            <CardContent>
              {dailySignals.length > 0 ? (
                <Suspense fallback={<div>加载中...</div>}>
                  <SignalsTable 
                    signals={convertToSignalFormat(dailySignals, stock)} 
                    title="日线交易信号"
                    category="daily"
                    signalType={undefined}
                    isStockPage={true}
                  />
                </Suspense>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  暂无日线信号数据
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 