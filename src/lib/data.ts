import categories from "@/data/categorieen.json";
import products from "@/data/producten.json";
import type { Category, Product } from "@/lib/types";

export const CATEGORIES = categories as Category[];
export const PRODUCTS = products as Product[];

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getProductsByCategory(slug: string): Product[] {
  return PRODUCTS.filter((p) => p.categorySlug === slug);
}

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function amazonAffiliateUrl(asin: string) {
  return `https://www.amazon.nl/dp/${asin}?tag=bootjes-21`;
}
