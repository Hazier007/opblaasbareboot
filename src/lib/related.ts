import type { Product } from "@/lib/types";
import { scoreSimilarity } from "@/lib/productSpecs";

export function getRelatedProducts(product: Product, products: Product[], limit = 4): Product[] {
  const candidates = products.filter((p) => p.categorySlug === product.categorySlug && p.slug !== product.slug);

  // If we have no candidates in the category, just pick any other products.
  const pool = candidates.length > 0 ? candidates : products.filter((p) => p.slug !== product.slug);

  return pool
    .map((p) => ({ p, s: scoreSimilarity(product, p) }))
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map(({ p }) => p);
}
