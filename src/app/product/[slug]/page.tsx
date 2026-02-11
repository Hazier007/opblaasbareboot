import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { PRODUCTS, amazonAffiliateUrl, getCategory, getProduct, getProductsByCategory } from "@/lib/data";

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
    title: `${product.title} | Opblaasbareboot.be`,
    description: `Bekijk specs, voor- en nadelen, FAQ en prijzen voor ${product.title}. Inclusief Amazon link (affiliate).`,
    alternates: { canonical: `/product/${product.slug}` },
  };
}

export default function ProductPage({ params }: { params: Params }) {
  const product = getProduct(params.slug);
  if (!product) return notFound();

  const category = getCategory(product.categorySlug);
  const affiliateUrl = amazonAffiliateUrl(product.asin);

  const related = getProductsByCategory(product.categorySlug)
    .filter((p) => p.slug !== product.slug)
    .slice(0, 4);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: [product.imageUrl],
    description: product.bullets.join(" · "),
    brand: { "@type": "Brand", name: "Amazon" },
    offers: {
      "@type": "Offer",
      url: affiliateUrl,
      priceCurrency: "EUR",
      price: product.priceEUR,
      availability: "https://schema.org/InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
  };

  return (
    <main className="py-10">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
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
            <div className="relative aspect-[3/2] w-full bg-zinc-900">
              <Image
                src={product.imageUrl}
                alt={product.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
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

        <section className="mt-10 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-white">Specs (MVP)</h2>
            <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              <table className="w-full text-sm">
                <tbody className="divide-y divide-white/10">
                  <tr>
                    <th className="w-44 bg-white/5 px-4 py-3 text-left font-semibold text-zinc-200">Categorie</th>
                    <td className="px-4 py-3 text-zinc-300">{category?.name ?? product.categorySlug}</td>
                  </tr>
                  <tr>
                    <th className="bg-white/5 px-4 py-3 text-left font-semibold text-zinc-200">Prijs (indicatie)</th>
                    <td className="px-4 py-3 text-zinc-300">{euro(product.priceEUR)}</td>
                  </tr>
                  <tr>
                    <th className="bg-white/5 px-4 py-3 text-left font-semibold text-zinc-200">ASIN</th>
                    <td className="px-4 py-3 text-zinc-300">{product.asin}</td>
                  </tr>
                  <tr>
                    <th className="bg-white/5 px-4 py-3 text-left font-semibold text-zinc-200">Highlights</th>
                    <td className="px-4 py-3 text-zinc-300">{product.bullets.join(" · ")}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <h3 className="font-semibold text-white">Pluspunten</h3>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-zinc-300">
                  {product.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <h3 className="font-semibold text-white">Minpunten (MVP)</h3>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-zinc-300">
                  <li>Check afmetingen/gewicht op Amazon (productdata volgt).</li>
                  <li>Vergelijk altijd met 1-2 alternatieven uit dezelfde categorie.</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-xl font-semibold text-white">FAQ</h2>
              <div className="mt-4 grid gap-4">
                <div>
                  <h3 className="font-semibold text-zinc-200">Is dit geschikt voor beginners?</h3>
                  <p className="mt-1 text-sm text-zinc-300">
                    In de meeste gevallen wel — check vooral stabiliteit (breedte) en draagkracht. Zodra we echte productdata
                    hebben, maken we dit objectief.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-200">Wat heb ik nodig naast de boot/kayak/SUP?</h3>
                  <p className="mt-1 text-sm text-zinc-300">
                    Minimum: pomp, peddel, (zwem)vest. Voor touring: drybag + leash. We linken later automatisch relevante
                    accessoires.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-200">Hoe kies ik de juiste maat?</h3>
                  <p className="mt-1 text-sm text-zinc-300">
                    Kijk naar aantal personen, max. draaggewicht en type gebruik (meer stabiliteit vs meer snelheid).
                  </p>
                </div>
              </div>
            </div>
          </div>

          <aside className="lg:col-span-1">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h2 className="text-lg font-semibold text-white">Gerelateerde producten</h2>
              {related.length === 0 ? (
                <p className="mt-3 text-sm text-zinc-300">Nog geen gerelateerde items in deze categorie.</p>
              ) : (
                <ul className="mt-4 grid gap-3">
                  {related.map((p) => (
                    <li key={p.slug}>
                      <Link
                        href={`/product/${p.slug}`}
                        className="block rounded-xl border border-white/10 bg-navy/40 px-4 py-3 text-sm text-white hover:border-white/20"
                      >
                        <div className="font-semibold">{p.title}</div>
                        <div className="mt-1 text-xs text-zinc-300">{euro(p.priceEUR)} · Rating {p.rating.toFixed(1)}</div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-6 border-t border-white/10 pt-5">
                <h3 className="text-sm font-semibold text-zinc-200">Meer in {category?.name ?? "deze categorie"}</h3>
                <Link
                  href={`/categorie/${product.categorySlug}`}
                  className="mt-3 inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
                >
                  Bekijk alle producten
                </Link>
              </div>
            </div>
          </aside>
        </section>
      </Container>
    </main>
  );
}
