"use client";

import { useEffect, useRef, memo } from "react";

interface TradingViewTickerProps {
  symbol: string;
  width?: string;
  height?: number;
}

function TradingViewTickerInner({ symbol, width = "100%", height = 180 }: TradingViewTickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-single-quote.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbol: symbol,
      width: width,
      isTransparent: true,
      colorTheme: document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark",
      locale: "en",
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

export const TradingViewTicker = memo(TradingViewTickerInner);
