"use client";

import { useState, useEffect, useRef } from "react";
import { TradingViewChart } from "./TradingViewChart";

interface MarketItem {
  name: string;
  symbol: string;
}

interface BondYields {
  us10y: number;
  us30y: number;
  asOf: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  equities: "Equities",
  fx: "Foreign Exchange",
  commodities: "Commodities",
  crypto: "Crypto",
};

const TV_SYMBOL_MAP: Record<string, string> = {
  SPX: "FOREXCOM:SPXUSD",
  QQQ: "NASDAQ:QQQ",
  NKY: "PEPPERSTONE:JPN225",
  HSI: "PEPPERSTONE:HK50",
  SHCOMP: "SSE:000001",
  DXY: "PEPPERSTONE:USDX",
  USDCNH: "OANDA:USDCNH",
  USDJPY: "FX:USDJPY",
  EURUSD: "FX:EURUSD",
  XAUUSD: "TVC:GOLD",
  USOIL: "TVC:USOIL",
  XAGUSD: "TVC:SILVER",
  BTCUSD: "COINBASE:BTCUSD",
  ETHUSD: "COINBASE:ETHUSD",
};

function LiveTickerCard({ item, isExpanded, onToggle }: { item: MarketItem; isExpanded: boolean; onToggle: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const tvSymbol = TV_SYMBOL_MAP[item.symbol] || item.symbol;

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-single-quote.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbol: tvSymbol,
      width: "100%",
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
  }, [item.symbol]);

  return (
    <div className={isExpanded ? "col-span-full" : ""}>
      <button
        onClick={onToggle}
        className={`w-full text-left rounded-lg border border-card-border bg-card-bg p-3 hover:border-accent-blue/50 transition-all cursor-pointer ${
          isExpanded ? "border-accent-blue" : ""
        }`}
      >
        <p className="text-xs text-muted font-mono mb-1">{item.name}</p>
        <div ref={containerRef} className="pointer-events-none h-[91px] overflow-hidden" />
      </button>
      {isExpanded && (
        <div className="mt-3">
          <TradingViewChart symbol={tvSymbol} height={500} />
        </div>
      )}
    </div>
  );
}

const MACRO_SYMBOLS = {
  equities: [
    { name: "S&P 500", symbol: "SPX" },
    { name: "Nasdaq 100 (QQQ)", symbol: "QQQ" },
    { name: "Nikkei 225", symbol: "NKY" },
    { name: "Hang Seng", symbol: "HSI" },
    { name: "Shanghai Composite", symbol: "SHCOMP" },
  ],
  fx: [
    { name: "US Dollar Index", symbol: "DXY" },
    { name: "USD/CNH", symbol: "USDCNH" },
    { name: "USD/JPY", symbol: "USDJPY" },
    { name: "EUR/USD", symbol: "EURUSD" },
  ],
  commodities: [
    { name: "Gold", symbol: "XAUUSD" },
    { name: "Crude Oil", symbol: "USOIL" },
    { name: "Silver", symbol: "XAGUSD" },
  ],
  crypto: [
    { name: "Bitcoin", symbol: "BTCUSD" },
    { name: "Ethereum", symbol: "ETHUSD" },
  ],
};

export function MacroIndexes({ bondYields }: { bondYields?: BondYields }) {
  const [expandedSymbol, setExpandedSymbol] = useState<string | null>(null);

  const categories = Object.entries(MACRO_SYMBOLS) as [string, MarketItem[]][];

  return (
    <section id="macro" className="space-y-6">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <span className="text-accent-blue">●</span> Markets at a Glance
      </h2>
      <p className="text-xs text-muted">Live data from TradingView. Click any card to expand the full chart.</p>

      {categories.filter(([c]) => c !== "crypto").map(([category, items]) => (
        <div key={category} className="space-y-3">
          <h3 className="text-lg font-semibold text-muted">
            {CATEGORY_LABELS[category]}
          </h3>
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {items.map((item) => {
              const isExpanded = expandedSymbol === item.symbol;
              return (
                <LiveTickerCard
                  key={item.symbol}
                  item={item}
                  isExpanded={isExpanded}
                  onToggle={() => setExpandedSymbol(isExpanded ? null : item.symbol)}
                />
              );
            })}
          </div>
        </div>
      ))}

      {bondYields && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-muted">Bonds</h3>
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            <div className="rounded-lg border border-card-border bg-card-bg p-4">
              <p className="text-xs text-muted font-mono mb-2">US 10-Year Yield</p>
              <p className="text-3xl font-bold tracking-tight">{bondYields.us10y.toFixed(2)}%</p>
              <p className="text-xs text-muted mt-1">As of {bondYields.asOf}</p>
            </div>
            <div className="rounded-lg border border-card-border bg-card-bg p-4">
              <p className="text-xs text-muted font-mono mb-2">US 30-Year Yield</p>
              <p className="text-3xl font-bold tracking-tight">{bondYields.us30y.toFixed(2)}%</p>
              <p className="text-xs text-muted mt-1">As of {bondYields.asOf}</p>
            </div>
          </div>
        </div>
      )}

      {categories.filter(([c]) => c === "crypto").map(([category, items]) => (
        <div key={category} className="space-y-3">
          <h3 className="text-lg font-semibold text-muted">
            {CATEGORY_LABELS[category]}
          </h3>
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {items.map((item) => {
              const isExpanded = expandedSymbol === item.symbol;
              return (
                <LiveTickerCard
                  key={item.symbol}
                  item={item}
                  isExpanded={isExpanded}
                  onToggle={() => setExpandedSymbol(isExpanded ? null : item.symbol)}
                />
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
}
