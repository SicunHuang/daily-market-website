"use client";

import { useEffect, useRef } from "react";

export function SectorHeatmap() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      exchanges: [],
      dataSource: "SPX500",
      grouping: "sector",
      blockSize: "market_cap_basic",
      blockColor: "change",
      locale: "en",
      symbolUrl: "",
      colorTheme: document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark",
      hasTopBar: false,
      isDataSet498: true,
      isOpenEnabled: false,
      hasSymbolTooltip: true,
      width: "100%",
      height: 400,
    });

    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, []);

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <span className="text-accent-green">●</span> Sector Heatmap
      </h2>
      <p className="text-xs text-muted">S&P 500 sectors by market cap, colored by daily change. Powered by TradingView.</p>
      <div
        ref={containerRef}
        className="rounded-xl border border-card-border overflow-hidden"
        style={{ height: 400 }}
      />
    </section>
  );
}
