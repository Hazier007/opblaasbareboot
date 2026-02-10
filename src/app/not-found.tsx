import Link from "next/link";
import { Container } from "@/components/Container";

export default function NotFound() {
  return (
    <main className="py-20">
      <Container>
        <h1 className="text-3xl font-semibold text-white">Pagina niet gevonden</h1>
        <p className="mt-2 text-zinc-300">Die URL bestaat niet (meer).</p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-full bg-aqua-gradient px-5 py-3 text-sm font-semibold text-navy hover:brightness-110"
        >
          Terug naar home
        </Link>
      </Container>
    </main>
  );
}
