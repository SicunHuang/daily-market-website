"use client";

import { useEffect, useState } from "react";

const NAV_ITEMS = [
  { id: "headlines", label: "Headlines" },
  { id: "macro", label: "Markets" },
  { id: "stocks", label: "Stocks" },
  { id: "serenity", label: "Serenity" },
];

export function Navbar({ date }: { date: string }) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [activeSection, setActiveSection] = useState("headlines");

  useEffect(() => {
    const saved = localStorage.getItem("theme") as "dark" | "light" | null;
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );

    NAV_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-nav-bg/80 backdrop-blur-xl border-b border-card-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-bold tracking-tight">
              <span className="text-accent-blue">◆</span> Market Briefing
            </h1>
            <span className="text-xs text-muted font-mono hidden sm:inline">
              {new Date(date + "T00:00:00").toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {/* Desktop nav */}
            <div className="hidden sm:flex items-center gap-1 mr-4">
              {NAV_ITEMS.map(({ id, label }) => (
                <a
                  key={id}
                  href={`#${id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className={`px-3 py-1.5 rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue ${
                    activeSection === id
                      ? "bg-accent-blue/15 text-accent-blue"
                      : "text-muted hover:text-foreground hover:bg-card-border/30"
                  }`}
                >
                  {label}
                </a>
              ))}
            </div>

            {/* Mobile nav */}
            <div className="flex sm:hidden items-center gap-0.5 mr-2 overflow-x-auto scrollbar-none">
              {NAV_ITEMS.map(({ id, label }) => (
                <a
                  key={id}
                  href={`#${id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className={`px-2.5 py-1 rounded-full text-xs whitespace-nowrap transition-colors ${
                    activeSection === id
                      ? "bg-accent-blue/15 text-accent-blue"
                      : "text-muted"
                  }`}
                >
                  {label}
                </a>
              ))}
            </div>

            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-md text-muted hover:text-foreground hover:bg-card-border/30 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
