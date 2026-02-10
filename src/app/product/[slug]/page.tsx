import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { PRODUCTS, amazonAffiliateUrl, getCategory, getProduct } from "@/lib/data";

type Params = { slug: string };

function euro(priceEUR: number) {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(priceEUR);
}

export function generateStaticParams(): Params[] {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const product = getProduct(params.slug);
  if (!product) return {};

  return {
    title: product.title,
    description: `Bekijk info, specs en een Amazon link voor: ${product.title}.`,
    alternates: { canonical: `/product/${product.slug}` },
  };
}

export default function ProductPage({ params }: { params: Params }) {
  const product = getProduct(params.slug);
  if (!product) return notFound();

  const category = getCategory(product.categorySlug);
  const affiliateUrl = amazonAffiliateUrl(product.asin);

  return (
    <main className="py-10">
      <Container>
        <div className="text-sm text-zinc-400">
          <Link href="/" className="hover:text-white">
            Home
          </Link>
          <span className="px-2">/</span>
          <Link href={`/categorie/${product.categorySlug}`} className="hover:text-white">
            {category?.name ?? "Categorie"}
          </Link>
          <span className="px-2">/</span>
          <span className="text-zinc-200">{product.title}</span>
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-soft">
            <div className="aspect-[3/2] w-full bg-zinc-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.imageUrl}
                alt={product.title}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-white">{product.title}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-zinc-300">
              <span>
                Rating: {product.rating.toFixed(1)} ({product.reviewCount} reviews)
              </span>
              <span className="font-semibold text-primary">{euro(product.priceEUR)}</span>
            </div>

            <ul className="mt-6 list-disc space-y-2 pl-5 text-zinc-200">
              {product.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={affiliateUrl}
                target="_blank"
                rel="nofollow sponsored noopener"
                className="rounded-full bg-aqua-gradient px-6 py-3 text-sm font-semibold text-navy hover:brightness-110"
              >
                Bekijk op Amazon
              </a>
              <Link
                href={`/categorie/${product.categorySlug}`}
                className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                Terug naar categorie
              </Link>
            </div>

            <p className="mt-4 text-xs text-zinc-400">
              Affiliate placeholder: tag=hazier-21. Dit is dummy data.
            </p>
          </div>
        </div>
      </Container>
    </main>
  );
}
