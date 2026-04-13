# SEO API Pack (MVP)

SaaS/API complet avec Next.js App Router, Prisma/PostgreSQL, NextAuth (credentials), Stripe subscriptions, quotas mensuels, API keys hashées et logs d'usage.

## Stack
- Next.js 14 + TypeScript strict + Tailwind
- PostgreSQL + Prisma
- NextAuth (credentials) avec Prisma adapter
- Stripe Checkout + Customer Portal + Webhooks

## Choix Auth
NextAuth Credentials est choisi pour un MVP auto-hébergé rapide, sans coût additionnel par utilisateur, tout en gardant une migration simple vers OAuth plus tard.

## Installation
```bash
npm install
cp .env.example .env
npx prisma migrate dev
npx prisma generate
npm run dev
```

## Variables d'environnement
Voir `.env.example`.

## Stripe setup
1. Créer trois produits récurrents mensuels (Starter/Pro/Agency)
2. Remplir `STRIPE_PRICE_ID_*`
3. Configurer webhook: `POST /api/stripe/webhook`
4. Événements requis: `customer.subscription.created`, `customer.subscription.updated`

## Architecture
- `app/(marketing)`: landing, pricing, docs, legal
- `app/dashboard`: espace privé utilisateur
- `app/api/v1/*`: endpoints API SEO
- `lib/services/*`: logique métier (clé API, quota, usage, génération, rate limit)
- `prisma/schema.prisma`: modèle SaaS/API complet

## Endpoints API
- `POST /api/v1/generate-title`
- `POST /api/v1/generate-meta-description`
- `POST /api/v1/generate-faq`
- `POST /api/v1/summarize-content`

Tous exigent: `Authorization: Bearer seopk_xxx`.

## Sécurité & usage
- API keys stockées hashées (SHA-256)
- Rotation de clé API avec affichage one-time de la nouvelle clé
- Quota mensuel par plan
- Rate limit technique de base: 120 requêtes/minute par clé
- Logs d'usage (endpoint, code HTTP, durée, erreur)

## Déploiement
Optimisé pour Vercel + PostgreSQL managé (Neon/Supabase/RDS). Exécuter migrations Prisma dans pipeline CI/CD.
