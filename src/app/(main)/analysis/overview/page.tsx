export default function MarketOverviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Market Overview</h1>
        <p className="text-muted-foreground">Real-time market analysis and trading opportunities.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border p-4">
          <h3 className="font-semibold">Market Trend</h3>
          <div className="mt-2 text-2xl font-bold text-green-600">BULLISH</div>
          <p className="text-muted-foreground text-sm">Strong upward momentum</p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-semibold">Active Signals</h3>
          <div className="mt-2 text-2xl font-bold">24</div>
          <p className="text-muted-foreground text-sm">Currently monitoring</p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-semibold">Success Rate</h3>
          <div className="mt-2 text-2xl font-bold text-blue-600">87%</div>
          <p className="text-muted-foreground text-sm">Last 30 days</p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-semibold">Risk Level</h3>
          <div className="mt-2 text-2xl font-bold text-yellow-600">MEDIUM</div>
          <p className="text-muted-foreground text-sm">Current market risk</p>
        </div>
      </div>
    </div>
  );
}
