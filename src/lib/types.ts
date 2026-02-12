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

  // Optional fields for real productdata (Wout dump).
  // Keep optional so the current dummy JSON keeps working.
  brand?: string;
  capacityPersons?: number;
  maxLoadKg?: number;
  lengthCm?: number;
  widthCm?: number;
  weightKg?: number;
  motorCompatible?: boolean;
};
