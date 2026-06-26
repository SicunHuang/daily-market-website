import { Navbar } from "./components/Navbar";
import { MarketMood } from "./components/MarketMood";
import { MarketHeadlines } from "./components/MarketHeadlines";
import { MacroIndexes } from "./components/MacroIndexes";
import { SectorHeatmap } from "./components/SectorHeatmap";
import { StockCharts } from "./components/StockCharts";
import { UpcomingEvents } from "./components/UpcomingEvents";
import { BackToTop } from "./components/BackToTop";
import { ScrollAnimator } from "./components/ScrollAnimator";
import fs from "fs";
import path from "path";

interface UpcomingEvent {
  date: string;
  event: string;
  significance: "high" | "medium" | "low";
}

interface BriefingData {
  date: string;
  marketMood?: string;
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
  bondYields?: {
    us10y: number;
    us30y: number;
    asOf: string;
  };
  tickerDescriptions?: Record<string, string>;
  upcomingEvents?: UpcomingEvent[];
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
        {data.marketMood && <MarketMood mood={data.marketMood} />}

        <ScrollAnimator>
          <MarketHeadlines stories={data.topStories} />
        </ScrollAnimator>

        <ScrollAnimator>
          <MacroIndexes bondYields={data.bondYields} />
        </ScrollAnimator>

        <ScrollAnimator>
          <SectorHeatmap />
        </ScrollAnimator>

        <ScrollAnimator>
          <StockCharts companies={data.companiesToWatch} stories={data.topStories} tickerDescriptions={data.tickerDescriptions} />
        </ScrollAnimator>

        {data.upcomingEvents && data.upcomingEvents.length > 0 && (
          <ScrollAnimator>
            <UpcomingEvents events={data.upcomingEvents} />
          </ScrollAnimator>
        )}

        {data.quickHits.length > 0 && (
          <ScrollAnimator>
            <section className="space-y-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <span className="text-muted">●</span> Quick Hits
              </h2>
              <div className="rounded-xl border border-card-border bg-card-bg divide-y divide-card-border">
                {data.quickHits.map((hit, i) => (
                  <div key={i} className="p-4 flex items-start gap-2">
                    <span className="text-accent-yellow text-sm mt-0.5">⚡</span>
                    <p className="text-sm text-foreground/80 leading-relaxed">{hit}</p>
                  </div>
                ))}
              </div>
            </section>
          </ScrollAnimator>
        )}

        <footer className="border-t border-card-border pt-8 pb-10 text-center text-sm text-muted space-y-1">
          <p>
            Market data is live from TradingView. News and analysis sourced from major financial outlets.
            Not investment advice.
          </p>
          <p>Briefing date: {data.date}</p>
        </footer>
      </main>
      <BackToTop />
    </>
  );
}
