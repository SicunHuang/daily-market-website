"use client";

interface Story {
  headline: string;
  source: string;
  summary: string;
  marketImpact: string;
  tickers: string[];
  url?: string;
}

interface MarketHeadlinesProps {
  stories: Story[];
}

function ColoredMarketImpact({ text }: { text: string }) {
  const parts = text.split(/(↑|↓)/g);
  return (
    <p className="text-sm font-medium text-accent-yellow">
      {parts.map((part, i) => {
        if (part === "↑") return <span key={i} className="text-accent-green font-bold">↑</span>;
        if (part === "↓") return <span key={i} className="text-accent-red font-bold">↓</span>;
        return <span key={i}>{part}</span>;
      })}
    </p>
  );
}

export function MarketHeadlines({ stories }: MarketHeadlinesProps) {
  const scrollToTicker = (ticker: string) => {
    const el = document.getElementById(`stock-${ticker}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("ring-2", "ring-accent-blue");
      setTimeout(() => el.classList.remove("ring-2", "ring-accent-blue"), 2000);
    }
  };

  return (
    <section id="headlines" className="space-y-4">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <span className="text-accent-red">●</span> Market Headlines
      </h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stories.map((story, i) => (
          <article
            key={i}
            className="rounded-xl border border-card-border bg-card-bg p-5 space-y-3 hover:border-accent-blue/50 transition-colors focus-within:ring-2 focus-within:ring-accent-blue"
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold leading-snug">
                {story.url ? (
                  <a
                    href={story.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-accent-blue transition-colors focus-visible:outline-none focus-visible:text-accent-blue"
                  >
                    {story.headline}
                    <span className="text-accent-blue ml-1 text-xs">↗</span>
                  </a>
                ) : (
                  story.headline
                )}
              </h3>
            </div>
            <p className="text-xs text-muted font-mono">
              {story.source}
              {story.url && (
                <>
                  {" · "}
                  <a
                    href={story.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent-blue hover:underline"
                  >
                    Read full article ↗
                  </a>
                </>
              )}
            </p>
            <p className="text-sm text-foreground/80 leading-relaxed">{story.summary}</p>
            <div className="pt-2 border-t border-card-border">
              <ColoredMarketImpact text={story.marketImpact} />
            </div>
            {story.tickers.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {story.tickers.map((ticker) => (
                  <button
                    key={ticker}
                    onClick={() => scrollToTicker(ticker)}
                    className="px-2 py-0.5 text-xs font-mono rounded bg-accent-blue/10 text-accent-blue hover:bg-accent-blue/20 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
                  >
                    ${ticker}
                  </button>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
