import Link from "next/link";
import type { Product } from "@/lib/types";

function euro(priceEUR: number) {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(priceEUR);
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-soft transition hover:border-white/20 hover:bg-white/10"
    >
      <div className="aspect-[3/2] w-full overflow-hidden bg-zinc-900">
        {/* Using <img> keeps MVP simple (no Next remote image config). */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.imageUrl}
          alt={product.title}
          className="h-full w-full object-cover transition group-hover:scale-[1.02]"
          loading="lazy"
        />
      </div>
      <div className="p-5">
        <h3 className="line-clamp-2 text-base font-semibold text-white">{product.title}</h3>
        <div className="mt-2 flex items-center justify-between text-sm">
          <span className="text-zinc-300">Rating: {product.rating.toFixed(1)}</span>
          <span className="font-semibold text-primary">{euro(product.priceEUR)}</span>
        </div>
      </div>
    </Link>
  );
}
