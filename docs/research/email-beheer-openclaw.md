# Email beheer via OpenClaw (info@hazier.be)

**Doel:** inbox monitoren + leads opvolgen + mails (concept) antwoorden. Bart wil dat Lisa dit kan doen via OpenClaw.

> TL;DR: Als `info@hazier.be` op Google Workspace draait → **Gmail Pub/Sub (push)** is de meest “native”/supported route in OpenClaw. Als het Microsoft 365 is → **Microsoft Graph subscriptions (push)**. Als het “gewone hosting IMAP/SMTP” is → **polling via heartbeat/cron + custom script**.

---

## Optie 1 — Gmail (Google Workspace) via **Gmail Pub/Sub → OpenClaw Webhooks** (aanbevolen als het Gmail is)

OpenClaw heeft documentatie + helper CLI voor Gmail watch → Pub/Sub push → webhook ingest.

### Pro
- **Push-based** (quasi realtime), geen polling.
- OpenClaw ondersteunt dit expliciet via `openclaw webhooks gmail setup/run`.
- Netjes te combineren met `hooks.mappings` zodat elke mail een geïsoleerde agent-run triggert en een samenvatting naar Discord/WhatsApp kan sturen.
- Credentials: OAuth tokens live in OpenClaw state (`auth-profiles.json`), niet in je repo.

### Contra
- Setup is wat zwaarder: Google Cloud project + Pub/Sub + Gmail watch.
- Vereist tooling (`gcloud`, `gogcli`, vaak ook Tailscale Funnel in de supported path).

### Stap-voor-stap setup (high level)
1. **Enable hooks in OpenClaw config** (Gateway):

```json5
{
  hooks: {
    enabled: true,
    token: "${OPENCLAW_HOOK_TOKEN}",
    path: "/hooks",
    presets: ["gmail"],
  },
}
```

2. **Gebruik de wizard (recommended):**

```bash
openclaw webhooks gmail setup --account info@hazier.be
```

3. **Run de watcher/daemon:**

```bash
openclaw webhooks gmail run
```

4. **(Optioneel) Deliver naar een vaste surface (bv. Discord #seo):** override de preset mapping:

```json5
{
  hooks: {
    enabled: true,
    token: "${OPENCLAW_HOOK_TOKEN}",
    presets: ["gmail"],
    mappings: [
      {
        match: { path: "gmail" },
        action: "agent",
        wakeMode: "now",
        name: "Gmail",
        sessionKey: "hook:gmail:{{messages[0].id}}",
        messageTemplate:
          "New email from {{messages[0].from}}\nSubject: {{messages[0].subject}}\n{{messages[0].snippet}}\n{{messages[0].body}}",
        model: "openai/gpt-5.2-mini",
        deliver: true,
        channel: "discord",
        to: "1470813756874555567" // #seo
      },
    ],
  },
}
```

5. **Draft + approval flow (veilig):** laat de agent **drafts maken**, maar pas versturen na expliciete OK.
   - Best practice: agent antwoordt met:
     - Samenvatting
     - Voorstel reply
     - Vragen/ontbrekende info
     - “Wil je verzenden? (ja/nee)”

### Inbox monitoring: heartbeat vs cron
- Gmail Pub/Sub = **push**, dus monitoring gebeurt door triggers → hoeft niet in HEARTBEAT.md.
- Heartbeat kan wel nuttig zijn voor: “check open threads / follow-ups / geen antwoord na 48u”.

### Bronnen
- OpenClaw docs: `/usr/local/lib/node_modules/openclaw/docs/automation/gmail-pubsub.md`
- Webhooks docs: `/usr/local/lib/node_modules/openclaw/docs/automation/webhook.md`

---

## Optie 2 — Microsoft 365 / Outlook via **Microsoft Graph API** (subscriptions → webhook)

Als `info@hazier.be` op Microsoft 365 zit, is de “proper” enterprise route: Graph API.

### Pro
- **Push-based** mogelijk via Graph subscriptions (webhooks).
- Goede security story (app registration, scopes, rotating secrets/certs).
- Je kan “send as”/“send on behalf” regelen via tenant policies.

### Contra
- Meer enterprise-setup: Azure App Registration, permissions, admin consent.
- Implementatie is DIY: OpenClaw heeft generieke webhooks, maar geen “Graph mail preset” zoals Gmail.

### Aanpak (concept)
1. Azure App Registration:
   - Permissions: `Mail.Read`, eventueel `Mail.Send` + `offline_access`.
   - Kies auth flow: client secret of (liefst) certificate.
2. Bouw een kleine webhook service die:
   - Graph subscription validation (validationToken) afhandelt.
   - Event payload omzet naar een OpenClaw webhook call (`POST /hooks/agent`).
3. OpenClaw config:

```json5
{ hooks: { enabled: true, token: "${OPENCLAW_HOOK_TOKEN}", path: "/hooks" } }
```

4. Deliver in OpenClaw: via `hooks.mappings` voor `/hooks/agent` of `/hooks/<custom>`.

### Monitoring
- Graph subscriptions zijn push; renewal (meestal max ~4230 min) moet je automatiseren.
- Dat kan via **cron** (isolated) of een aparte service.

---

## Optie 3 — Generieke mailbox (cPanel/hoster) via **IMAP (poll) + SMTP (send)** met custom script

Als het “klassieke hosting mail” is (IMAP/SMTP credentials), dan is polling de realistische weg.

### Pro
- Werkt met *eender welke* mailbox die IMAP/SMTP aanbiedt.
- Geen cloud vendor lock-in.
- Snel te implementeren.

### Contra
- **Polling** (minder realtime, meer calls).
- Je moet zelf deduping/state (laatst gezien UID) bijhouden.
- SMTP versturen vereist extra voorzichtigheid (spoofing, DKIM/SPF, rate limits).

### Aanbevolen monitoring pattern
- **Heartbeat** (main session) als je meerdere checks wil bundelen (email + calendar + followups).
- **Cron** als je exacte timing wil (bv. elke 5 min) of isolated runs.

OpenClaw guidance: zie `Cron vs Heartbeat` doc.

### Minimal Node script (voorbeeld)
- IMAP library: `imapflow`
- SMTP library: `nodemailer`

Pseudo-setup (schets):

```ts
// scripts/mail-poll.ts
import { ImapFlow } from 'imapflow';

const client = new ImapFlow({
  host: process.env.IMAP_HOST!,
  port: Number(process.env.IMAP_PORT ?? 993),
  secure: true,
  auth: {
    user: process.env.IMAP_USER!,
    pass: process.env.IMAP_PASS!,
  },
});

await client.connect();
let lock = await client.getMailboxLock('INBOX');
try {
  // Fetch unseen or newer-than UID logic
  for await (let msg of client.fetch('1:*', { uid: true, envelope: true, flags: true })) {
    // filter unseen, build summary
  }
} finally {
  lock.release();
  await client.logout();
}
```

Vervolgens stuur je de samenvatting naar OpenClaw via webhook:

```bash
curl -X POST http://127.0.0.1:18789/hooks/agent \
  -H "Authorization: Bearer $OPENCLAW_HOOK_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Email","message":"Nieuwe mails: ...","deliver":true,"channel":"discord","to":"1470813756874555567"}'
```

### SMTP send (namens info@hazier.be)
Ja, kan, via `nodemailer`:

```ts
import nodemailer from 'nodemailer';

const tx = nodemailer.createTransport({
  host: process.env.SMTP_HOST!,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: false,
  auth: { user: process.env.SMTP_USER!, pass: process.env.SMTP_PASS! },
});

await tx.sendMail({
  from: 'info@hazier.be',
  to: 'lead@example.com',
  subject: 'Re: ...',
  text: '...'
});
```

**Safety:** laat OpenClaw eerst een draft genereren, en verstuur pas na OK (approval gate).

---

## Security: credentials veilig bewaren in OpenClaw

### 1) Gebruik **environment variables** + substitutie in config
OpenClaw ondersteunt `${VAR_NAME}` substitutie in config strings.

Voorbeeld:
```json5
{
  hooks: { token: "${OPENCLAW_HOOK_TOKEN}" }
}
```

Rules (belangrijk):
- Alleen uppercase env vars.
- Missing/empty → config load error (goed, fail fast).

### 2) OAuth + API keys via OpenClaw auth-profiles
OpenClaw bewaart per-agent OAuth/API keys in:
- `~/.openclaw/agents/<agentId>/agent/auth-profiles.json`

Dus: **niet committen**, niet in prompts plakken.

### 3) Redaction / log hygiene
- Vermijd `?token=` query tokens (deprecated/warning); gebruik `Authorization: Bearer ...`.
- Deel geen logs/config dumps zonder redaction.

Bron: `docs/gateway/configuration.md` + `docs/gateway/security/index.md`.

---

## Aanbevolen aanpak (voor Bart/Lisa)

1. **Eerst bepalen waar mailbox draait**:
   - Google Workspace (Gmail) → **Optie 1**.
   - Microsoft 365 → **Optie 2**.
   - “Hoster IMAP/SMTP” → **Optie 3**.

2. Functionele scope “safe” houden:
   - Agent doet **triage + draft**.
   - Versturen pas na menselijk akkoord (Lisa/Bart).

3. Monitoring:
   - Gmail/Graph push: events → webhooks → isolated run + summary to #seo.
   - IMAP polling: heartbeat (30m) of cron (5–10m) afhankelijk van urgency.

4. Routing:
   - Deliver naar Discord `#seo` of DM (afhankelijk van noise).

---

## Setup checklist (kort)

- [ ] `hooks.enabled=true` + `hooks.token` gezet (via env var)
- [ ] Gmail: `openclaw webhooks gmail setup/run` (of Graph/IMAP alternatief)
- [ ] Mapping: `deliver=true` + `channel/to` naar #seo
- [ ] Policies: no auto-send zonder approval
- [ ] Secrets: enkel env vars / auth-profiles, nooit in repo

