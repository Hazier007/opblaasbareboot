"use client";

import { useEffect, useRef } from "react";

export function LiquidEther() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let mx = 0;
    let my = 0;

    function onMove(e: PointerEvent) {
      if (!el) return;
      const r = el.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width;
      my = (e.clientY - r.top) / r.height;
    }

    function tick() {
      if (el) {
        // Clamp + set CSS vars
        const x = Math.max(0, Math.min(1, mx));
        const y = Math.max(0, Math.min(1, my));
        el.style.setProperty("--mx", x.toFixed(4));
        el.style.setProperty("--my", y.toFixed(4));
      }
      raf = requestAnimationFrame(tick);
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-navy" />

      {/* Liquid blobs */}
      <div className="liquid-blob absolute -left-24 -top-24 h-[520px] w-[520px] rounded-full bg-primary/25 blur-3xl" />
      <div className="liquid-blob2 absolute -bottom-28 left-1/3 h-[620px] w-[620px] rounded-full bg-secondary/25 blur-3xl" />
      <div className="liquid-blob3 absolute -right-24 top-1/4 h-[520px] w-[520px] rounded-full bg-blue-600/20 blur-3xl" />

      {/* Subtle sheen (moves with cursor) */}
      <div
        className="absolute inset-0 opacity-90"
        style={{
          backgroundImage:
            "radial-gradient(circle at calc(var(--mx, 0.5) * 100%) calc(var(--my, 0.5) * 100%), rgba(6,182,212,0.22), transparent 45%), radial-gradient(circle at calc((1 - var(--mx, 0.5)) * 100%) 35%, rgba(14,165,233,0.18), transparent 52%), radial-gradient(circle at 50% 90%, rgba(37,99,235,0.14), transparent 55%)",
        }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,transparent_0%,rgba(10,22,40,0.65)_60%,rgba(10,22,40,0.95)_100%)]" />
    </div>
  );
}
