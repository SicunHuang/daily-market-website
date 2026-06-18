"use client";

export function MarketMood({ mood }: { mood: string }) {
  return (
    <div className="rounded-xl border border-accent-blue/30 bg-accent-blue/5 px-5 py-4 animate-fade-in">
      <p className="text-sm font-medium text-foreground/90 leading-relaxed">
        <span className="text-accent-blue font-bold mr-2">Market Mood</span>
        {mood}
      </p>
    </div>
  );
}
