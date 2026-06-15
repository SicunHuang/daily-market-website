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
            className="rounded-xl border border-card-border bg-card-bg p-5 space-y-3 hover:border-accent-blue/50 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold leading-snug">
                {story.url ? (
                  <a
                    href={story.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-accent-blue transition-colors"
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
            <p className="text-sm text-foreground/80">{story.summary}</p>
            <div className="pt-2 border-t border-card-border">
              <p className="text-sm font-medium text-accent-yellow">{story.marketImpact}</p>
            </div>
            {story.tickers.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {story.tickers.map((ticker) => (
                  <button
                    key={ticker}
                    onClick={() => scrollToTicker(ticker)}
                    className="px-2 py-0.5 text-xs font-mono rounded bg-accent-blue/10 text-accent-blue hover:bg-accent-blue/20 transition-colors cursor-pointer"
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
