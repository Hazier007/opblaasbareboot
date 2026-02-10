export type Category = {
  slug: string;
  name: string;
  description: string;
};

export type Product = {
  slug: string;
  title: string;
  categorySlug: string;
  priceEUR: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  asin: string;
  bullets: string[];
};
