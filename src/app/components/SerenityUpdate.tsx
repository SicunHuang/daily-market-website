"use client";

import { useState } from "react";
import { TradingViewChart } from "./TradingViewChart";
import { SymbolInfo } from "./SymbolInfo";

interface Pick {
  ticker: string;
  company: string;
  thesis: string;
}

interface PriorMove {
  ticker: string;
  move: string;
}

interface SerenityData {
  latestPicks: Pick[];
  priorPickMoves: PriorMove[];
  sentiment: string;
  noActivity: boolean;
}

interface SerenityUpdateProps {
  data: SerenityData;
}

export function SerenityUpdate({ data }: SerenityUpdateProps) {
  const [expandedTicker, setExpandedTicker] = useState<string | null>(null);

  if (data.noActivity) {
    return (
      <section id="serenity" className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <span className="text-accent-yellow">●</span> Serenity Update
        </h2>
        <div className="rounded-xl border border-card-border bg-card-bg p-6 text-center">
          <p className="text-muted">No recent Serenity activity found via web search.</p>
          <a
            href="https://x.com/aleabitoreddit"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-blue hover:underline mt-2 inline-block"
          >
            Check his X feed directly →
          </a>
        </div>
      </section>
    );
  }

  return (
    <section id="serenity" className="space-y-6">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <span className="text-accent-yellow">●</span> Serenity Update
      </h2>
      <p className="text-xs text-muted">
        Source:{" "}
        <a
          href="https://x.com/aleabitoreddit"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent-blue hover:underline"
        >
          @aleabitoreddit
        </a>{" "}
        — Unaudited account. Not investment advice.
      </p>

      {data.latestPicks.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Latest Picks</h3>
          {data.latestPicks.map((pick) => {
            const isExpanded = expandedTicker === pick.ticker;
            return (
              <div
                key={pick.ticker}
                className="rounded-xl border border-card-border bg-card-bg overflow-hidden"
              >
                <button
                  onClick={() => setExpandedTicker(isExpanded ? null : pick.ticker)}
                  className="w-full text-left p-5 hover:bg-card-border/20 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">
                        {pick.company}{" "}
                        <span className="text-muted font-mono text-sm">({pick.ticker})</span>
                      </h4>
                      <p className="text-sm text-muted mt-1">{pick.thesis}</p>
                    </div>
                    <span className="text-muted text-sm">{isExpanded ? "▲" : "▼"}</span>
                  </div>
                </button>
                {isExpanded && (
                  <div className="px-5 pb-5 space-y-4">
                    <SymbolInfo symbol={pick.ticker} />
                    <TradingViewChart symbol={pick.ticker} height={500} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {data.priorPickMoves.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Prior Pick Moves</h3>
          <div className="rounded-xl border border-card-border bg-card-bg divide-y divide-card-border">
            {data.priorPickMoves.map((move) => (
              <div key={move.ticker} className="p-4 flex items-center justify-between">
                <span className="font-mono font-bold text-accent-blue">{move.ticker}</span>
                <span className="text-sm text-foreground/80">{move.move}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.sentiment && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Community Sentiment</h3>
          <div className="rounded-xl border border-card-border bg-card-bg p-5">
            <p className="text-sm text-foreground/80">{data.sentiment}</p>
          </div>
        </div>
      )}
    </section>
  );
}
