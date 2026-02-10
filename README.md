# opblaasbareboot.be — MVP

Next.js 14 (App Router) + TypeScript + Tailwind CSS (v3).

Amazon NL affiliate MVP voor opblaasbare boten.

## Features

- Dark mode design met accentkleur `#F5911E`
- Homepage met:
  - Hero
  - Categorieën overzicht
  - Top producten sectie
- Programmatic SEO structuur:
  - `/(categorie)/categorie/[slug]`
  - `/(product)/product/[slug]`
- Data uit JSON files:
  - `src/data/categorieen.json`
  - `src/data/producten.json`
- SEO:
  - `metadata` in `src/app/layout.tsx`
  - `sitemap.xml` via `src/app/sitemap.ts`
  - `robots.txt` via `src/app/robots.ts`

## Development

```bash
npm install
npm run dev
```

Open: http://localhost:3000

## Build

```bash
npm run lint
npm run build
```

## Data & affiliate links

- Dummy producten bevatten een placeholder `asin`.
- Affiliate URL wordt opgebouwd als:

```txt
https://www.amazon.nl/dp/<ASIN>?tag=hazier-21
```

## Notes

MVP = simpel gehouden (o.a. product images via `<img>` i.p.v. `next/image` om geen remote image config nodig te hebben).
