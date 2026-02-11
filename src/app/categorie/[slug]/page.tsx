import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { ProductCard } from "@/components/ProductCard";
import { CATEGORIES, getCategory, getProductsByCategory } from "@/lib/data";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const category = getCategory(params.slug);
  if (!category) return {};

  const title = `${category.name} kopen & vergelijken | Opblaasbareboot.be`;
  return {
    title,
    description: category.description,
    alternates: { canonical: `/categorie/${category.slug}` },
  };
}

export default function CategoryPage({ params }: { params: Params }) {
  const category = getCategory(params.slug);
  if (!category) return notFound();

  const products = getProductsByCategory(category.slug);

  return (
    <main className="py-10">
      <Container>
        <div className="flex flex-col gap-2">
          <div className="text-sm text-zinc-400">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <span className="px-2">/</span>
            <span className="text-zinc-200">{category.name}</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-white">{category.name}</h1>
          <p className="max-w-3xl text-zinc-300">{category.description}</p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>

        <section className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-soft">
          <h2 className="text-lg font-semibold text-white">Andere categorieën</h2>
          <p className="mt-2 text-sm text-zinc-300">
            Sneller vergelijken? Spring naar een andere categorie en bekijk de top producten.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {CATEGORIES.filter((c) => c.slug !== category.slug).map((c) => (
              <Link
                key={c.slug}
                href={`/categorie/${c.slug}`}
                className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </section>
      </Container>
    </main>
  );
}
