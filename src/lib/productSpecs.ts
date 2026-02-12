import type { Product } from "@/lib/types";

export function inferCapacityPersons(product: Product): number | undefined {
  const haystack = `${product.title} ${product.bullets.join(" ")}`.toLowerCase();

  // Common Dutch patterns
  // - "2 persoons", "2-persoons", "2p", "voor 2 personen"
  const patterns: Array<[RegExp, number | undefined]> = [
    [/\b1\s*[- ]?persoons\b/, 1],
    [/\b2\s*[- ]?persoons\b/, 2],
    [/\b3\s*[- ]?persoons\b/, 3],
    [/\b4\s*[- ]?persoons\b/, 4],
    [/\b1\s*p\b/, 1],
    [/\b2\s*p\b/, 2],
    [/\b3\s*p\b/, 3],
    [/\b4\s*p\b/, 4],
    [/\bvoor\s+1\s+personen?\b/, 1],
    [/\bvoor\s+2\s+personen?\b/, 2],
    [/\bvoor\s+3\s+personen?\b/, 3],
    [/\bvoor\s+4\s+personen?\b/, 4],
  ];

  for (const [re, value] of patterns) {
    if (re.test(haystack)) return value;
  }

  return undefined;
}

export function inferLengthFeet(product: Product): number | undefined {
  const haystack = `${product.title} ${product.bullets.join(" ")}`;
  // SUP notation like 10'6 or 12'6
  const m = haystack.match(/(\d{1,2})\s*'\s*(\d{1,2})/);
  if (!m) return undefined;
  const feet = Number(m[1]);
  const inches = Number(m[2]);
  if (!Number.isFinite(feet) || !Number.isFinite(inches)) return undefined;
  return feet + inches / 12;
}

export function inferPriceBand(priceEUR: number): "budget" | "mid" | "premium" {
  if (priceEUR < 200) return "budget";
  if (priceEUR < 400) return "mid";
  return "premium";
}

export function inferBrand(product: Product): string | undefined {
  // Very naive: first word until space.
  // If titles are standardized later, we can improve.
  const first = product.title.split(" ")[0]?.trim();
  if (!first) return undefined;
  if (first.length < 3) return undefined;
  return first;
}

export function formatCapacity(capacity?: number) {
  if (!capacity) return "—";
  return `${capacity} persoon${capacity === 1 ? "" : "en"}`;
}

export function formatPriceBand(band: "budget" | "mid" | "premium") {
  if (band === "budget") return "Budget";
  if (band === "mid") return "Midden";
  return "Premium";
}

export function scoreSimilarity(a: Product, b: Product): number {
  // Higher is better.
  let score = 0;

  const aCapacity = inferCapacityPersons(a);
  const bCapacity = inferCapacityPersons(b);
  if (aCapacity && bCapacity && aCapacity === bCapacity) score += 4;

  const aBand = inferPriceBand(a.priceEUR);
  const bBand = inferPriceBand(b.priceEUR);
  if (aBand === bBand) score += 2;

  const priceDiff = Math.abs(a.priceEUR - b.priceEUR);
  score += Math.max(0, 2 - priceDiff / 200);

  const aBrand = inferBrand(a);
  const bBrand = inferBrand(b);
  if (aBrand && bBrand && aBrand.toLowerCase() === bBrand.toLowerCase()) score += 1;

  const aLen = inferLengthFeet(a);
  const bLen = inferLengthFeet(b);
  if (aLen && bLen) {
    const diff = Math.abs(aLen - bLen);
    score += Math.max(0, 1 - diff / 3);
  }

  return score;
}
