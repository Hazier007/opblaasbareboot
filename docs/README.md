# Docs structuur (opblaasbareboot)

Deze repo is onze **shared folder**. Git = single source of truth.

## Mappen

### `docs/research/`
**Doel:** research notes, analyses, verkenningen.

- WIP is ok.
- Gebruik duidelijke bestandsnamen (kebab-case).
- Voeg links/assumptions toe (wat heb je gebruikt, wat is onzeker?).

Voorbeelden:
- `docs/research/email-beheer-openclaw.md`
- `docs/research/lokale-llm-content-writer.md`

### `deliverables/`
**Doel:** finale output klaar om te publiceren/door te sturen.

- Geen “ruwe notities” hier.
- Hou dit clean: dit is wat Bart/Lisa kan copy-pasten.

Voorbeelden:
- `deliverables/preppedia-keywords-en.md`
- `deliverables/briefing-<klant>-<datum>.md`

### `projects/<project>/`
**Doel:** project-specifieke data, exports, scripts, dumps.

- Grote exports (CSV’s) liefst gecomprimeerd.
- Zet er een korte `README.md` bij als het niet obvious is.

Voorbeelden:
- `projects/preppedia/keywords/`
- `projects/hazier/`

## Werkwijze

- Post in Discord meestal enkel: **pad + commit hash + korte samenvatting**.
- Als iets “final” is, zet het in `deliverables/` en verwijs daarnaar.

