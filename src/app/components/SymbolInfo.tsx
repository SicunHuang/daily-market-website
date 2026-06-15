"use client";

import { useEffect, useRef, memo } from "react";

interface SymbolInfoProps {
  symbol: string;
}

function SymbolInfoInner({ symbol }: SymbolInfoProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-info.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbol: symbol,
      width: "100%",
      locale: "en",
      colorTheme: document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark",
      isTransparent: true,
    });

    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [symbol]);

  return (
    <div className="tradingview-widget-container">
      <div ref={containerRef} />
    </div>
  );
}

export const SymbolInfo = memo(SymbolInfoInner);
