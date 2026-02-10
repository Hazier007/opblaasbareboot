export function LiquidEther() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-navy" />

      {/* Liquid blobs */}
      <div className="liquid-blob absolute -left-24 -top-24 h-[520px] w-[520px] rounded-full bg-primary/25 blur-3xl" />
      <div className="liquid-blob2 absolute -bottom-28 left-1/3 h-[620px] w-[620px] rounded-full bg-secondary/25 blur-3xl" />
      <div className="liquid-blob3 absolute -right-24 top-1/4 h-[520px] w-[520px] rounded-full bg-blue-600/20 blur-3xl" />

      {/* Subtle sheen */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(6,182,212,0.18),transparent_45%),radial-gradient(circle_at_80%_40%,rgba(14,165,233,0.16),transparent_50%),radial-gradient(circle_at_50%_90%,rgba(37,99,235,0.12),transparent_55%)]" />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,transparent_0%,rgba(10,22,40,0.65)_60%,rgba(10,22,40,0.95)_100%)]" />
    </div>
  );
}
