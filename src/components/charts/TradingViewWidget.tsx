"use client";

import React, { useEffect, useRef, memo } from 'react';

interface TradingViewWidgetProps {
  symbol: string;
  theme?: 'light' | 'dark';
  height?: string;
  interval?: string;
  timezone?: string;
}

function TradingViewWidget({ 
  symbol, 
  theme = 'dark', // 默认使用深色主题
  height = '1000px', // 默认高度增加到1000px (400px * 2.5)
  interval = 'D',
  timezone = 'Asia/Shanghai'
}: TradingViewWidgetProps) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;

    // 清理之前的脚本
    container.current.innerHTML = '';

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "allow_symbol_change": true,
      "calendar": false,
      "details": false,
      "hide_side_toolbar": true,
      "hide_top_toolbar": false,
      "hide_legend": false,
      "hide_volume": false,
      "hotlist": false,
      "interval": interval,
      "locale": "zh_CN",
      "save_image": true,
      "style": "1",
      "symbol": symbol,
      "theme": "dark",
      "timezone": timezone,
      "backgroundColor": "#0F0F0F",
      "gridColor": "rgba(242, 242, 242, 0.06)",
      "watchlist": [],
      "withdateranges": false,
      "compareSymbols": [],
      "studies": [],
      "autosize": true,
      "width": "100%",
      "height": "100%"
    });

    const widgetDiv = document.createElement('div');
    widgetDiv.className = 'tradingview-widget-container__widget';
    widgetDiv.style.height = 'calc(100% - 32px)';
    widgetDiv.style.width = '100%';

    const copyrightDiv = document.createElement('div');
    copyrightDiv.className = 'tradingview-widget-copyright';
    copyrightDiv.innerHTML = `<a href="https://cn.tradingview.com/symbols/${symbol.replace(':', '-')}/?exchange=${symbol.split(':')[0]}" rel="noopener nofollow" target="_blank"><span class="text-blue-400 text-xs">Track all markets on TradingView</span></a>`;

    container.current.appendChild(widgetDiv);
    container.current.appendChild(copyrightDiv);
    widgetDiv.appendChild(script);

  }, [symbol, theme, interval, timezone]);

  return (
    <div 
      className="tradingview-widget-container w-full bg-[#0F0F0F] rounded-lg overflow-hidden" 
      ref={container} 
      style={{ height }}
    />
  );
}

export default memo(TradingViewWidget);