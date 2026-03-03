import type { Platform } from "@/types";

export const PLATFORM_RULES: Record<Platform, string> = {
  instagram: `## REGOLE PER INSTAGRAM
- Hook forte nelle prime 2 righe (il feed mostra solo quelle)
- Emoji mirate, non eccessive — usale come punteggiatura emotiva
- 5-8 hashtag separati dal testo principale (dopo uno spazio o riga vuota)
- CTA diretta: Salva questo post, Link in bio, Tagga qualcuno
- Tono visivo e immediato, frasi brevi, ritmo incalzante
- Lunghezza ideale: 150-300 parole per il copy principale`,

  facebook: `## REGOLE PER FACEBOOK
- Tono conversazionale, più disteso rispetto a Instagram
- 1-3 paragrafi, usa domande aperte per stimolare interazione
- Massimo 2-3 hashtag (su Facebook non servono di più)
- CTA: commenta, condividi, tagga un amico
- Può essere più lungo e narrativo
- Usa line break per leggibilità`,

  linkedin: `## REGOLE PER LINKEDIN
- Professionale ma umano — non aziendalese
- Paragrafi cortissimi (1-2 righe ciascuno)
- La prima riga è fondamentale (è la preview nel feed)
- Massimo 1-2 emoji, usale con parsimonia
- 3-5 hashtag professionali e rilevanti
- CTA professionale: Cosa ne pensi? Condividi la tua esperienza
- Tono riflessivo, orientato al valore e alla crescita`,

  email: `## REGOLE PER EMAIL
- Oggetto: breve, evocativo, max 50 caratteri — deve invogliare l'apertura
- Apertura personale e calda (non "Gentile utente")
- Corpo: 2-4 paragrafi, tono diretto ma poetico
- Una sola CTA chiara e ben visibile
- Chiusura calda, firma del team TEDxConegliano
- Non usare hashtag
- Formatta con **grassetto** per i punti chiave`,
};

export const PLATFORM_LABELS: Record<Platform, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  linkedin: "LinkedIn",
  email: "Email",
};
