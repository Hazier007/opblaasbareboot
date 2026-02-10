import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "Opblaasbare boten kopen (MVP) | opblaasbareboot.be",
    template: "%s | opblaasbareboot.be",
  },
  description:
    "Vergelijk opblaasbare kayaks, SUP boards, vissersboten en accessoires. Amazon NL affiliate MVP.",
  metadataBase: new URL("https://opblaasbareboot.be"),
  openGraph: {
    title: "opblaasbareboot.be",
    description:
      "Clean & modern gids voor opblaasbare boten. Amazon NL affiliate MVP.",
    type: "website",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className="dark">
      <body className="min-h-dvh">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
