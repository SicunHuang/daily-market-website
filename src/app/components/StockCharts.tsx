"use client";

import { useState } from "react";
import { TradingViewChart } from "./TradingViewChart";
import { SymbolInfo } from "./SymbolInfo";

interface Company {
  name: string;
  ticker: string;
  exchange: string;
  reason: string;
  direction: string;
}

interface Story {
  headline: string;
  tickers: string[];
}

interface StockChartsProps {
  companies: Company[];
  stories: Story[];
  tickerDescriptions?: Record<string, string>;
}

function StoryRefs({ ticker, stories }: { ticker: string; stories: Story[] }) {
  const refs = stories.filter((s) => s.tickers.includes(ticker));
  if (refs.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1 mt-2">
      {refs.map((s, i) => (
        <span
          key={i}
          className="text-[10px] text-muted bg-card-border/40 rounded px-1.5 py-0.5 leading-tight"
          title={s.headline}
        >
          {s.headline.length > 40 ? s.headline.slice(0, 40) + "…" : s.headline}
        </span>
      ))}
    </div>
  );
}

export function StockCharts({ companies, stories, tickerDescriptions }: StockChartsProps) {
  const [expandedTicker, setExpandedTicker] = useState<string | null>(null);

  const headlineTickers = new Set(stories.flatMap((s) => s.tickers));
  const companyTickers = new Set(companies.map((c) => c.ticker));
  const extraTickers = [...headlineTickers].filter((t) => !companyTickers.has(t));

  return (
    <section id="stocks" className="space-y-6">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <span className="text-accent-green">●</span> Companies to Watch
      </h2>

      <div className="space-y-4">
        {companies.map((company) => {
          const isExpanded = expandedTicker === company.ticker;
          const tvSymbol = `${company.exchange}:${company.ticker}`;

          return (
            <div
              key={company.ticker}
              id={`stock-${company.ticker}`}
              className="rounded-xl border border-card-border bg-card-bg overflow-hidden transition-all"
            >
              <button
                onClick={() => setExpandedTicker(isExpanded ? null : company.ticker)}
                className="w-full text-left p-5 hover:bg-card-border/20 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-blue"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xl ${
                        company.direction === "↑" ? "text-accent-green" : "text-accent-red"
                      }`}
                    >
                      {company.direction}
                    </span>
                    <div>
                      <h3 className="font-semibold">
                        {company.name}{" "}
                        <span className="text-muted font-mono text-sm">({company.ticker})</span>
                      </h3>
                      <p className="text-sm text-muted mt-0.5 leading-relaxed">{company.reason}</p>
                    </div>
                  </div>
                  <span className="text-muted text-sm">{isExpanded ? "▲" : "▼"}</span>
                </div>
              </button>

              {isExpanded && (
                <div className="px-5 pb-5 space-y-4">
                  <SymbolInfo symbol={tvSymbol} />
                  <TradingViewChart symbol={tvSymbol} height={500} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {extraTickers.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-muted">Also Mentioned in Headlines</h3>
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
            {extraTickers.map((ticker) => {
              const isExpanded = expandedTicker === ticker;
              const isETF = ["SPY", "QQQ", "DIA", "TLT", "IEF", "USO", "XRT", "XLY", "FXI", "KWEB"].includes(ticker);
              return (
                <div key={ticker} id={`stock-${ticker}`} className={isExpanded ? "col-span-full" : ""}>
                  <button
                    onClick={() => setExpandedTicker(isExpanded ? null : ticker)}
                    className={`w-full text-left rounded-lg border bg-card-bg p-4 hover:border-accent-blue/50 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue ${
                      isExpanded
                        ? "border-accent-blue"
                        : isETF
                          ? "border-l-2 border-l-accent-blue border-card-border"
                          : "border-l-2 border-l-accent-green border-card-border"
                    }`}
                  >
                    <p className="font-mono font-bold">${ticker}</p>
                    {tickerDescriptions?.[ticker] && (
                      <p className="text-xs text-muted mt-1 font-sans font-normal leading-snug">
                        {tickerDescriptions[ticker]}
                      </p>
                    )}
                    <StoryRefs ticker={ticker} stories={stories} />
                  </button>
                  {isExpanded && (
                    <div className="mt-3 space-y-3">
                      <SymbolInfo symbol={ticker} />
                      <TradingViewChart symbol={ticker} height={500} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
