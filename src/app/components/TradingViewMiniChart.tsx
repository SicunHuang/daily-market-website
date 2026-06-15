"use client";

import { useEffect, useRef, memo } from "react";

interface TradingViewMiniChartProps {
  symbol: string;
  width?: string;
  height?: number;
}

function TradingViewMiniChartInner({ symbol, width = "100%", height = 220 }: TradingViewMiniChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbol: symbol,
      width: width,
      height: height,
      locale: "en",
      dateRange: "1M",
      colorTheme: document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark",
      isTransparent: true,
      autosize: false,
      largeChartUrl: "",
      noTimeScale: false,
      chartOnly: false,
    });

    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [symbol, width, height]);

  return (
    <div className="tradingview-widget-container overflow-hidden" style={{ height, width }}>
      <div ref={containerRef} style={{ height: "100%", width: "100%" }} />
    </div>
  );
}

export const TradingViewMiniChart = memo(TradingViewMiniChartInner);
