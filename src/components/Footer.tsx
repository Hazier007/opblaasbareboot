import { Container } from "@/components/Container";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 py-10 text-sm text-zinc-400">
      <Container>
        <div className="flex flex-col gap-2">
          <p>
            © {new Date().getFullYear()} opblaasbareboot.be — Amazon affiliate MVP.
          </p>
          <p>
            Disclaimer: Prijzen & beschikbaarheid kunnen wijzigen. Links kunnen affiliate links zijn.
          </p>
        </div>
      </Container>
    </footer>
  );
}
