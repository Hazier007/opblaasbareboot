# Lokale LLM als content writer op VPS — research

**Context:** Bart wil een “4e teamlid”: dedicated content writer die **op eigen VPS** draait (liefst gratis/unlimited) en **Engelse SEO longform** kan schrijven.

Belangrijkste realiteit-check: “gratis & onbeperkt” kan enkel als je **zelf compute** betaalt. Zonder GPU op je VPS ga je meestal eindigen op **kleinere modellen (7B–14B)** of **zware quantized modellen met lage snelheid**.

---

## 1) Beste open-source modellen voor lange Engelse SEO content (2026-ish shortlist)

### A. Llama 3.1/3.x Instruct (Meta)
- **Sterktes:** stabiele algemene schrijfkwaliteit, goed voor longform structuur.
- **Aanrader:**
  - **8B Instruct** (CPU-friendly; “goed genoeg” voor bulk SEO met strakke templates)
  - **70B Instruct** (kwaliteit hoger, maar praktisch vaak **GPU** of veel RAM nodig)

### B. Qwen 2.5 Instruct (Alibaba)
- **Sterktes:** vaak zeer sterke instruct-following + lange output; goed voor “productie-achtige” tekst.
- **Aanrader:**
  - **Qwen2.5 14B/32B Instruct** als je meer kwaliteit wil maar nog enigszins runtimes haalbaar wil houden.

### C. Mixtral / Mistral (Mixture-of-Experts)
- **Sterktes:** goede kwaliteit/creativiteit; kan snel zijn op GPU.
- **Opmerking:** MoE modellen zijn niet altijd ideaal op CPU-only; runtime support is wel goed in vLLM.

### D. DeepSeek (R1 e.d.)
- **Sterktes:** reasoning/analysis.
- **Voor SEO-writer:** nuttig voor outline/briefing/QA, minder “default choice” puur voor prose.

### Praktische aanbeveling voor Hazier-SEO longform
- **CPU-only VPS:** start met **Llama 3.x 8B Instruct** of **Qwen2.5 7B/14B Instruct** (quantized).
- **Met GPU (of veel RAM):** mik op **Qwen2.5 32B** of **Llama 70B** (quantized), voor duidelijk betere copy.

---

## 2) Ollama vs vLLM vs llama.cpp — wat is het makkelijkst & performant?

### Optie 1 — **Ollama** (makkelijkst, “batteries included”)
**Wanneer kiezen:** snel online, simpele model pulls, makkelijk beheer op één host.

**Pro**
- Super simpel: `ollama pull …` en klaar.
- **OpenAI-compatible API** beschikbaar (`http://<host>:11434/v1`).
- OpenClaw heeft **native provider docs** voor Ollama + auto-discovery.

**Contra**
- Performance is oké, maar voor high-throughput productie op GPU is vLLM vaak beter.
- Streaming heeft in sommige stacks quirks; OpenClaw zet streaming voor Ollama doorgaans default uit voor tool-capable modellen (zie doc).

### Optie 2 — **vLLM** (beste throughput op GPU)
**Wanneer kiezen:** je hebt een GPU (of GPU-server) en wil veel tokens/sec.

**Pro**
- Zeer performant serving (paged attention, batching).
- OpenAI-compatible endpoints mogelijk (`/v1`).
- Ideaal voor “veel artikels/uur”.

**Contra**
- GPU is praktisch vereist voor de sweet spot.
- Iets meer DevOps (CUDA, drivers, model weights, start command, memory tuning).

### Optie 3 — **llama.cpp** (meest controle + CPU koning)
**Wanneer kiezen:** CPU-only VPS, maximale efficiency per core/RAM, quantized GGUF.

**Pro**
- Heel sterk op CPU met quantization (GGUF).
- Veel controle over context, threads, kv-cache.
- Kan als server draaien met OpenAI-compatible API (afhankelijk van build/flags).

**Contra**
- Setup is meer DIY dan Ollama.
- Minder “one command pulls”; je beheert GGUF files zelf.

### TL;DR keuze
- **Snelste “werkt altijd”**: **Ollama**.
- **Beste productie throughput (GPU)**: **vLLM**.
- **Beste CPU-only tuning**: **llama.cpp**.

---

## 3) Minimale VPS specs per model (RAM/VRAM/CPU)

> Ruwe richtlijnen voor **quantized** modellen. Exact hangt af van quant level (Q4/Q5/Q8), context window, batch size, en runtime.

### CPU-only (meest realistisch op standaard VPS)
- **7B–8B (Q4/Q5):**
  - **RAM:** 8–16 GB
  - **CPU:** 4–8 vCPU
  - **Gebruik:** bulk SEO artikelen met strakke prompts/templates.

- **13B–14B (Q4/Q5):**
  - **RAM:** 16–32 GB
  - **CPU:** 8–16 vCPU
  - **Gebruik:** merkbaar betere coherentie; nog oké qua speed.

- **30B–34B (Q4):**
  - **RAM:** 48–64 GB (soms meer)
  - **CPU:** 16+ vCPU
  - **Gebruik:** kwaliteit nice, maar throughput op CPU zakt hard.

- **70B (Q4):**
  - **RAM:** 96–128 GB (praktisch)
  - **CPU:** 24+ vCPU
  - **Gebruik:** op CPU vaak té traag voor “writer in productie”, tenzij je volume laag is.

### Met GPU (als je ooit overschakelt)
- **8B:** GPU 8–12 GB VRAM is vaak genoeg.
- **14B:** GPU 16–24 GB VRAM.
- **32B:** GPU 48 GB VRAM (of meerdere GPU’s), afhankelijk van quant + context.
- **70B:** GPU 80 GB (A100/H100) of multi-GPU.

---

## 4) Hoe koppel je een lokaal model aan OpenClaw?

Er zijn 2 praktische routes:

### Route A — **Gebruik de ingebouwde Ollama provider** (aanbevolen)
OpenClaw kan Ollama auto-discoveren als je `OLLAMA_API_KEY` zet (any value).

**Voorbeeld:**
```bash
export OLLAMA_API_KEY="ollama-local"
```

Dan in OpenClaw config:
```json5
{
  agents: {
    defaults: {
      model: { primary: "ollama/llama3.3" }
    }
  }
}
```

Bron: OpenClaw docs `/providers/ollama`.

### Route B — **Custom provider** (OpenAI-compatible server)
Als je vLLM / llama.cpp server / LiteLLM gebruikt, wijs je OpenClaw naar een OpenAI-compatible `/v1` baseUrl.

**Voorbeeld config:**
```json5
{
  agents: {
    defaults: {
      model: { primary: "local-writer/llama-3.1-8b" }
    }
  },
  models: {
    mode: "merge",
    providers: {
      "local-writer": {
        baseUrl: "http://127.0.0.1:4000/v1",
        apiKey: "${LOCAL_LLM_API_KEY}",
        api: "openai-completions",
        models: [
          {
            id: "llama-3.1-8b",
            name: "Llama 3.1 8B (local)",
            reasoning: false,
            input: ["text"],
            cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
            contextWindow: 128000,
            maxTokens: 32000
          }
        ]
      }
    }
  }
}
```

Bron: OpenClaw docs `/gateway/configuration` (custom providers + baseUrl).

---

## 5) Geschatte output: hoeveel artikelen/uur per model?

We nemen als “SEO artikel” grofweg:
- **1500–2500 woorden** ≈ **2000–3500 tokens output**
- plus prompt/outline overhead.

### CPU-only (indicatieve ranges)
- **8B Q4 op 8–16 vCPU:** ~**10–25 tokens/sec**
  - ~36k–90k tokens/uur → **8–25 artikels/uur** (theorie)
  - Realistisch met overhead/QA: **4–12 artikels/uur**.

- **14B Q4 op 16 vCPU:** ~**5–15 tokens/sec**
  - Realistisch: **2–8 artikels/uur**.

- **32B+ op CPU:** vaak **1–5 tokens/sec**
  - Realistisch: **<1–3 artikels/uur** (te traag voor “dedicated writer” tenzij low volume).

### GPU (vLLM, batching)
- Sterk model + GPU kan makkelijk **50–200+ tokens/sec** halen (afhankelijk van model/VRAM/batching).
- Dan wordt “artikels/uur” vooral beperkt door **kwaliteit gating** (fact-check, internal links, schema, etc.), niet door pure tokens/sec.

---

## 6) Kwaliteit: lokaal model vs Claude/GPT voor SEO content

### Waar lokale modellen vaak nog achterlopen
- **Consistency & factuality** op moeilijke topics (hallucinaties).
- “Writer voice” + conversion copy (CTA, nuance) zonder heavy prompting.
- Betrouwbare compliance (geen rare claims) zonder guardrails.

### Waar lokale modellen prima scoren
- **Template-driven content** (programmatic SEO):
  - vaste outline
  - vaste tone-of-voice
  - beperkte factual claims
  - sterke interne structuur (H2/H3), FAQ, snippets
- Bulk “good-enough” drafts die je later refine’t met Claude/GPT voor top pages.

### Aanbevolen hybride workflow
- Local LLM = **draft machine** (outline + first draft + variants).
- Claude/GPT = **editor/QA** voor money pages / E-E-A-T pages.

---

## 7) Aanbevolen setup voor Bart (pragmatisch)

### Scenario 1 — Standaard VPS zonder GPU (meest waarschijnlijk)
1. **Ollama** installeren
2. Model: **Llama 8B** of **Qwen2.5 7B/14B** (quantized)
3. OpenClaw: `OLLAMA_API_KEY=ollama-local`
4. Maak in OpenClaw een “writer agent” prompt/skill die:
   - Keyword + search intent + outline
   - Draft (EN-only)
   - Title/meta/H tags
   - FAQ + schema suggestions
   - Internal link suggestions (vanuit site map / slug list)
5. Output gaat naar Discord, en pas daarna naar CMS pipeline.

### Scenario 2 — VPS met GPU (of aparte GPU box)
1. vLLM server met OpenAI-compatible `/v1`
2. Model: **Qwen2.5 32B Instruct** of **Llama 70B Instruct** (quantized indien nodig)
3. OpenClaw custom provider met `baseUrl` naar die server
4. Voeg batching toe voor throughput

---

## 8) Open vragen (om ’t scherp te maken)

1) Welke VPS hebben we in gedachten (RAM/vCPU)? En is GPU een optie?  
2) Doel-output: hoeveel artikels/dag/week?  
3) Hoe “risk tolerant” is Bart qua factual claims? (local models → meer QA nodig)  
4) Moet dit rechtstreeks publishen (gevaarlijk) of enkel drafts + review?  

---

## Bronnen (OpenClaw intern)
- Ollama provider: `/usr/local/lib/node_modules/openclaw/docs/providers/ollama.md`
- Custom providers + OpenAI-compatible baseUrl: `/usr/local/lib/node_modules/openclaw/docs/gateway/configuration.md` (sectie `models`)
