"use client";

import dynamic from "next/dynamic";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

// 动态导入 TradingView 组件，禁用 SSR
const TradingViewWidget = dynamic(() => import("./TradingViewWidget"), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse bg-gray-900 h-[1000px] rounded-lg flex items-center justify-center">
      <span className="text-gray-300">加载图表中...</span>
    </div>
  )
});

interface TradingViewWrapperProps {
  symbol: string;
  stockName?: string;
  interval?: string;
}

export default function TradingViewWrapper({ 
  symbol, 
  stockName,
  interval = "D"
}: TradingViewWrapperProps) {
  return (
    <Card className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          {stockName || symbol} 实时行情图表
        </CardTitle>
        <CardDescription>
          基于 TradingView 提供的实时数据和技术分析工具
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[1000px]">
          <TradingViewWidget
            symbol={symbol}
            theme="dark"
            height="1000px"
            interval={interval}
            timezone="Asia/Shanghai"
          />
        </div>
      </CardContent>
    </Card>
  );
}