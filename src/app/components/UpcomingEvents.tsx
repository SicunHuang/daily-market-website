"use client";

interface UpcomingEvent {
  date: string;
  event: string;
  significance: "high" | "medium" | "low";
}

const SIGNIFICANCE_STYLES: Record<string, string> = {
  high: "bg-accent-red/10 text-accent-red border-accent-red/30",
  medium: "bg-accent-yellow/10 text-accent-yellow border-accent-yellow/30",
  low: "bg-muted/10 text-muted border-muted/30",
};

export function UpcomingEvents({ events }: { events: UpcomingEvent[] }) {
  const grouped = events.reduce<Record<string, UpcomingEvent[]>>((acc, ev) => {
    (acc[ev.date] ??= []).push(ev);
    return acc;
  }, {});

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <span className="text-accent-blue">●</span> Coming Up
      </h2>
      <div className="rounded-xl border border-card-border bg-card-bg divide-y divide-card-border">
        {Object.entries(grouped).map(([date, evts]) => (
          <div key={date} className="p-4 space-y-2">
            <p className="text-xs font-mono text-muted">
              {new Date(date + "T00:00:00").toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </p>
            <div className="space-y-1.5">
              {evts.map((ev, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded border ${
                      SIGNIFICANCE_STYLES[ev.significance]
                    }`}
                  >
                    {ev.significance}
                  </span>
                  <span className="text-sm text-foreground/80">{ev.event}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
