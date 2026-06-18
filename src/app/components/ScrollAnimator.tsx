"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function ScrollAnimator({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function update() {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;

      const fadeZone = vh * 0.25;

      let opacity = 1;
      let translateY = 0;

      if (rect.top > vh - fadeZone) {
        const progress = Math.min((rect.top - (vh - fadeZone)) / fadeZone, 1);
        opacity = 1 - progress;
        translateY = progress * 24;
      } else if (rect.bottom < fadeZone) {
        const progress = Math.min((fadeZone - rect.bottom) / fadeZone, 1);
        opacity = 1 - progress;
        translateY = -progress * 24;
      }

      el.style.opacity = String(Math.max(0, Math.min(1, opacity)));
      el.style.transform = `translateY(${translateY}px)`;
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div ref={ref} className="will-change-[opacity,transform] transition-none">
      {children}
    </div>
  );
}
