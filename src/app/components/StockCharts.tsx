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
  tickers: string[];
}

interface StockChartsProps {
  companies: Company[];
  stories: Story[];
}

export function StockCharts({ companies, stories }: StockChartsProps) {
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
                className="w-full text-left p-5 hover:bg-card-border/20 transition-colors cursor-pointer"
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
                      <p className="text-sm text-muted mt-0.5">{company.reason}</p>
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
              return (
                <div key={ticker} id={`stock-${ticker}`} className={isExpanded ? "col-span-full" : ""}>
                  <button
                    onClick={() => setExpandedTicker(isExpanded ? null : ticker)}
                    className={`w-full text-left rounded-lg border border-card-border bg-card-bg p-4 hover:border-accent-blue/50 transition-all cursor-pointer ${
                      isExpanded ? "border-accent-blue" : ""
                    }`}
                  >
                    <p className="font-mono font-bold">${ticker}</p>
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
