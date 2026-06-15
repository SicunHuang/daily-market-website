import { Navbar } from "./components/Navbar";
import { MarketHeadlines } from "./components/MarketHeadlines";
import { MacroIndexes } from "./components/MacroIndexes";
import { StockCharts } from "./components/StockCharts";
import { SerenityUpdate } from "./components/SerenityUpdate";
import fs from "fs";
import path from "path";

interface BriefingData {
  date: string;
  topStories: {
    headline: string;
    source: string;
    summary: string;
    marketImpact: string;
    tickers: string[];
    url?: string;
  }[];
  companiesToWatch: {
    name: string;
    ticker: string;
    exchange: string;
    reason: string;
    direction: string;
  }[];
  serenity: {
    latestPicks: { ticker: string; company: string; thesis: string }[];
    priorPickMoves: { ticker: string; move: string }[];
    sentiment: string;
    noActivity: boolean;
  };
  bondYields?: {
    us10y: number;
    us30y: number;
    asOf: string;
  };
  quickHits: string[];
}

function loadBriefingData(): BriefingData {
  const filePath = path.join(process.cwd(), "data", "latest.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

export default function Home() {
  const data = loadBriefingData();

  return (
    <>
      <Navbar date={data.date} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        <MarketHeadlines stories={data.topStories} />
        <MacroIndexes bondYields={data.bondYields} />
        <StockCharts companies={data.companiesToWatch} stories={data.topStories} />
        <SerenityUpdate data={data.serenity} />

        {data.quickHits.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span className="text-muted">●</span> Quick Hits
            </h2>
            <div className="rounded-xl border border-card-border bg-card-bg divide-y divide-card-border">
              {data.quickHits.map((hit, i) => (
                <div key={i} className="p-4">
                  <p className="text-sm text-foreground/80">⚡ {hit}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <footer className="border-t border-card-border pt-6 pb-8 text-center text-xs text-muted">
          <p>
            Market data is live from TradingView. News and analysis sourced from major financial outlets.
            Not investment advice.
          </p>
          <p className="mt-1">Briefing date: {data.date}</p>
        </footer>
      </main>
    </>
  );
}
