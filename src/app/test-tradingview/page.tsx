import TradingViewWrapper from "@/components/charts/TradingViewWrapper";

export default function TestTradingViewPage() {
  return (
    <div className="container mx-auto py-8 space-y-6">
      <h1 className="text-3xl font-bold">TradingView 图表测试页面</h1>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">深证300001 - 特锐德</h2>
        <TradingViewWrapper
          symbol="SZSE:300001"
          stockName="特锐德"
          interval="D"
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">上证600000 - 浦发银行</h2>
        <TradingViewWrapper
          symbol="SSE:600000"
          stockName="浦发银行"
          interval="1D"
        />
      </div>
    </div>
  );
}