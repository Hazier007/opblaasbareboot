import Link from "next/link";
import { Container } from "@/components/Container";

const NAV = [
  { href: "/categorie/kayaks", label: "Kayaks" },
  { href: "/categorie/sup-boards", label: "SUP" },
  { href: "/categorie/vissersboten", label: "Vissers" },
  { href: "/categorie/kinderboten", label: "Kids" },
  { href: "/categorie/zwembaden", label: "Zwembaden" },
  { href: "/categorie/accessoires", label: "Accessoires" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-navy/80 backdrop-blur">
      <Container>
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="text-xl font-semibold tracking-tight md:text-2xl">
            <span className="text-primary">opblaasbare</span>boot.be
          </Link>
          <nav className="hidden gap-6 text-base text-zinc-200 md:flex">
            {NAV.map((i) => (
              <Link key={i.href} href={i.href} className="hover:text-white">
                {i.label}
              </Link>
            ))}
          </nav>
          <a
            href="#topproducten"
            className="rounded-full bg-aqua-gradient px-5 py-2.5 text-base font-semibold text-navy hover:brightness-110"
          >
            Top producten
          </a>
        </div>
      </Container>
    </header>
  );
}
