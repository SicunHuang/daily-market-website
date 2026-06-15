"use client";

import { useEffect, useRef, useState, memo } from "react";

interface TradingViewChartProps {
  symbol: string;
  height?: number;
  showToolbar?: boolean;
}

const TIMEFRAME_OPTIONS = [
  { label: "1D", range: "1D" },
  { label: "5D", range: "5D" },
  { label: "1M", range: "1M" },
  { label: "6M", range: "6M" },
  { label: "YTD", range: "YTD" },
  { label: "1Y", range: "12M" },
  { label: "5Y", range: "60M" },
  { label: "All", range: "ALL" },
];

function TradingViewChartInner({ symbol, height = 400, showToolbar = true }: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeRange, setActiveRange] = useState("1M");

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: symbol,
      interval: "D",
      timezone: "Etc/UTC",
      theme: document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark",
      style: "1",
      locale: "en",
      allow_symbol_change: false,
      hide_top_toolbar: !showToolbar,
      hide_legend: false,
      save_image: false,
      calendar: false,
      support_host: "https://www.tradingview.com",
      range: activeRange,
    });

    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [symbol, showToolbar, activeRange]);

  return (
    <div className="space-y-2">
      <div className="flex gap-1 flex-wrap">
        {TIMEFRAME_OPTIONS.map((tf) => (
          <button
            key={tf.range}
            onClick={() => setActiveRange(tf.range)}
            className={`px-3 py-1 text-xs font-mono rounded-md border transition-colors cursor-pointer ${
              activeRange === tf.range
                ? "bg-accent-blue text-white border-accent-blue"
                : "border-card-border text-muted hover:border-accent-blue/50 hover:text-foreground"
            }`}
          >
            {tf.label}
          </button>
        ))}
      </div>
      <div
        className="tradingview-widget-container rounded-lg overflow-hidden border border-card-border"
        style={{ height }}
      >
        <div ref={containerRef} style={{ height: "100%", width: "100%" }} />
      </div>
    </div>
  );
}

export const TradingViewChart = memo(TradingViewChartInner);
