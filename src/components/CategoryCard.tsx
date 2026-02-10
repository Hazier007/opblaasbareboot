import Link from "next/link";
import type { Category } from "@/lib/types";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/categorie/${category.slug}`}
      className="group rounded-2xl border border-white/10 bg-white/5 p-5 shadow-soft transition hover:border-white/20 hover:bg-white/10"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-white">{category.name}</h3>
          <p className="mt-1 text-sm text-zinc-300">{category.description}</p>
        </div>
        <span className="mt-1 text-accent transition group-hover:translate-x-0.5">→</span>
      </div>
    </Link>
  );
}
