# TEDxConegliano Copy Agent

## Business
**Client:** TEDx Conegliano (organizzato con Tecnosystemi SpA)
**Industry:** Eventi culturali TEDx, comunità di Conegliano (Treviso)

## User
**End user:** Social media manager del team TEDx + membri del team per email. 2-5 persone, livello tecnico base.
**Need:** Copy social e email che suoni autenticamente TEDxConegliano — poetico, evocativo, mai generico — e che migliori nel tempo grazie al feedback del team.

## Stack
Next.js 15 (App Router), Supabase (database feedback + esempi), Vercel (hosting), shadcn + Tailwind v4, Vercel AI SDK (Anthropic ora, sostituibile), TypeScript

## EIID

### Enrichment (collect)
**Have:** Brand guidelines TEDxConegliano (tono, valori, evitare), tema edizione corrente ("Invisibile — oltre quello che si vede"), regole piattaforma (IG, FB, LI), 6 slider di stile
**Human input:** Topic del post (testo libero), regolazione slider, correzioni sul copy, rating 1-5
**Missing:** Corpus di post passati ad alta valutazione, database speaker (bio + tema talk)
**Connect:** Supabase per storicizzare output valutati e corretti. Import manuale post passati come riferimento.
**Approach:** Brand guidelines e tema: automate (config statica). Corpus feedback: innovate (cresce con l'uso, nessun tool fa questo per un brand singolo). Speaker data: automate (entry manuale).

### Inference (patterns)
**Detect:** Combinazioni stile → rating alto per tipo post e piattaforma
**Predict:** Slider ottimali per tipo contenuto (annuncio speaker, lancio biglietti, dietro le quinte)
**Flag:** Frasi generiche, strutture ripetitive, deviazioni dal tono brand
**Approach:** Innovate — feedback loop (rating + correzioni → few-shot examples nel prompt → copy migliore) è il differenziante.

### Interpretation (insights)
**Surface:** Copy pronto per piattaforma (IG, FB, LI, email), varianti, CTA, hashtag
**Frame as:** Draft da rivedere. Il social media manager edita, valuta, pubblica.
**Approach:** Differentiate — AI propone, umano decide.

### Delivery (reach)
**Channels:** Web interface, copia in clipboard
**Triggers:** On-demand (click genera)
**Approach:** Automate — hosting, UI, tutto commodity.

## Technology Constraints
Use Next.js, NOT React+Vite, Create React App.
Use Vercel AI SDK, NOT fetch diretto alle API AI.
Use Supabase, NOT Firebase, PlanetScale.
Use shadcn, NOT Material UI, Chakra, Ant Design.
Use Tailwind CSS v4, NOT styled-components, CSS modules.
Use pnpm, NOT npm, yarn, bun.
Use TypeScript, NOT JavaScript.

## Code Architecture
- Split files by responsibility. One component per file. One utility per file.
- Colocation: tests next to source, types next to usage.
- AI provider config in `lib/ai/`. Prompt templates in `lib/prompts/`. Switching model = config change, not rewrite.
- Supabase client in `lib/supabase/`. Feedback logic in `lib/feedback/`.
- Brand guidelines and platform rules as structured data in `lib/brand/`, not hardcoded in components.

## Design System
**Framework:** shadcn + Tailwind v4
**Token source:** globals.css
**Reference:** UI della beta (specifiche in `/Users/mattia/Downloads/TEDxCopyAgent_Specifiche.md`)
**Layout:** Griglia 2 colonne — pannello sinistro (config, brand, slider, genera) + pannello destro (output con tab IG/FB/LI). Collassa su mobile.
**Theme:** Chiaro, minimalista, caldo. Sfondo `#f5f5f3`, card bianche con bordi `#e8e8e6`.
**Typography:** Inter (Google Fonts)
**Colors:** Rosso TED `#E62B1E` (accento/azioni primarie), testo `#222`, header nero `#111`. Nessun colore superfluo.
**Header:** Logo TEDxConegliano testuale su sfondo nero, titolo sottile sotto.
**Indicators:** Status per piattaforma (grigio = idle, animato = genera, check = pronto). Pulsante "Copia testo" con feedback visivo.
