import Link from "next/link";
import { Container } from "@/components/Container";
import { CategoryCard } from "@/components/CategoryCard";
import { ProductCard } from "@/components/ProductCard";
import { CATEGORIES, PRODUCTS } from "@/lib/data";

export default function HomePage() {
  const topProducts = [...PRODUCTS]
    .sort((a, b) => b.rating * b.reviewCount - a.rating * a.reviewCount)
    .slice(0, 6);

  return (
    <main>
      <section className="relative overflow-hidden py-14">
        <div className="pointer-events-none absolute inset-0 opacity-70">
          <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-accent/20 blur-3xl" />
          <div className="absolute -bottom-40 right-0 h-[420px] w-[420px] rounded-full bg-white/10 blur-3xl" />
        </div>

        <Container>
          <div className="relative grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <p className="text-sm font-semibold text-accent">Amazon NL affiliate</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white md:text-5xl">
                Opblaasbare boten, kayaks & SUP —
                <span className="text-accent"> clean gekozen</span>
              </h1>
              <p className="mt-4 text-lg text-zinc-300">
                Een snelle gids om de juiste opblaasbare boot te kiezen. Categorie → product →
                Amazon.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/categorie/kayaks"
                  className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-zinc-950 hover:brightness-110"
                >
                  Start met Kayaks
                </Link>
                <Link
                  href="#categories"
                  className="rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
                >
                  Bekijk categorieën
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-soft">
              <div className="text-sm text-zinc-300">Snel kiezen</div>
              <ul className="mt-3 grid gap-3">
                {CATEGORIES.slice(0, 4).map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/categorie/${c.slug}`}
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-zinc-950/40 px-4 py-3 hover:border-white/20"
                    >
                      <span className="font-semibold text-white">{c.name}</span>
                      <span className="text-accent">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-zinc-400">
                MVP data is dummy. Later koppelen we echte productfeeds.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section id="categories" className="py-10">
        <Container>
          <div className="flex items-end justify-between gap-6">
            <div>
              <h2 className="text-2xl font-semibold text-white">Categorieën</h2>
              <p className="mt-1 text-zinc-300">
                Programmatic SEO structuur: <code className="text-accent">/categorie/[slug]</code>
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((c) => (
              <CategoryCard key={c.slug} category={c} />
            ))}
          </div>
        </Container>
      </section>

      <section id="topproducten" className="py-10">
        <Container>
          <div className="flex items-end justify-between gap-6">
            <div>
              <h2 className="text-2xl font-semibold text-white">Top producten</h2>
              <p className="mt-1 text-zinc-300">
                Product detail: <code className="text-accent">/product/[slug]</code>
              </p>
            </div>
            <span className="hidden text-sm text-zinc-400 md:block">Dummy ranking (rating × reviews)</span>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {topProducts.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </Container>
      </section>

      <section className="py-10">
        <Container>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-soft">
            <h3 className="text-xl font-semibold text-white">Waarom deze site?</h3>
            <p className="mt-2 max-w-3xl text-zinc-300">
              Clean, modern, productfoto centraal. Coolblue-vibes maar dan voor boten.
              Programmatic pages + later echte data.
            </p>
          </div>
        </Container>
      </section>
    </main>
  );
}
