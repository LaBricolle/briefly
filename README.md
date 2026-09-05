# Briefly — MVP

Une notification par jour avec les 5 actus les plus importantes en France, résumées par IA.
PWA (pas d'app native), notifications via Web Push, hébergement Vercel + Supabase.

## Ce qui est déjà codé

- `src/lib/feeds.ts` — liste des flux RSS français (à vérifier/ajuster, voir plus bas).
- `src/lib/rss.ts` — récupération et nettoyage des articles.
- `src/lib/scoring.ts` — regroupe les articles qui parlent du même sujet et calcule
  un score (nombre de sources qui en parlent + fraîcheur). C'est une heuristique
  simple par similarité de mots-clés, pas du machine learning — largement
  suffisant pour un MVP, à améliorer plus tard si besoin.
- `src/lib/summarize.ts` — appelle Claude pour rédiger un titre + résumé de 2-3
  phrases pour chacun des 5 sujets retenus.
- `src/lib/push.ts` — envoie la notification push à tous les abonnés (Web Push).
- `src/app/api/cron/daily-digest/route.ts` — le pipeline complet, déclenché une
  fois par jour par un cron Vercel (voir `vercel.json`).
- `src/app/api/subscribe/route.ts` — enregistre l'abonnement push d'un visiteur.
- `src/app/page.tsx` — landing page avec le bouton "Activer les notifications".
- `src/app/digests/` — archive publique des briefs passés (bon pour le SEO).
- `public/sw.js` + `public/manifest.json` — la partie PWA / notifications.

## Mise en route en local

Cet environnement (le sandbox où le code a été écrit) n'a pas accès au registre
npm, donc les dépendances n'ont pas pu être installées ni le build testé ici.
Sur ta machine ou sur Vercel, ce sera normal :

```bash
npm install
cp .env.example .env.local
npm run generate-vapid-keys   # copie les 2 clés générées dans .env.local
```

Il te faut ensuite :

1. **Un projet Supabase** (gratuit) → récupère l'URL, la clé anon et la
   *service role key*, mets-les dans `.env.local`. Puis exécute le contenu de
   `supabase/schema.sql` dans l'éditeur SQL de Supabase pour créer les tables.
2. **Une clé API Anthropic** → `ANTHROPIC_API_KEY` dans `.env.local`.
3. Un `CRON_SECRET` (une chaîne aléatoire au choix) pour protéger le endpoint cron.

Ensuite :

```bash
npm run dev
```

Pour tester le pipeline complet sans attendre le cron :
`curl -H "Authorization: Bearer <CRON_SECRET>" http://localhost:3000/api/cron/daily-digest`

## Déploiement (Vercel)

1. Pousse ce dossier sur un repo GitHub.
2. Importe le repo sur [vercel.com](https://vercel.com).
3. Ajoute toutes les variables de `.env.example` dans Vercel (Settings → Environment Variables).
4. Le cron défini dans `vercel.json` (`0 6 * * *`, soit 6h UTC = 8h à Paris en été,
   7h en hiver — ajuste si besoin) se déclenchera automatiquement une fois déployé.

## À vérifier avant de lancer

- **Les URLs des flux RSS** dans `src/lib/feeds.ts` : les médias changent parfois
  leurs flux, teste chaque URL dans un navigateur avant de te fier au pipeline.
- **La qualité du clustering** (`scoring.ts`) : lance le pipeline sur une vraie
  journée et relis le résultat — le seuil de similarité (`0.35`) est un point
  de départ, pas une valeur validée.
- **iOS** : le Web Push fonctionne sur iPhone (iOS 16.4+) mais seulement si le
  site a été ajouté à l'écran d'accueil au préalable — à expliquer dans l'onboarding.

## Prochaines étapes (après le MVP)

- Désinscription en un clic depuis la notification/le site.
- Amélioration du clustering (embeddings plutôt que similarité de mots).
- Personnalisation (catégories choisies par l'utilisateur).
- Statistiques d'ouverture des notifications.
