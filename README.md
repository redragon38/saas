# PulseFacture — SaaS complet prêt à lancer

PulseFacture est un micro-SaaS B2B conçu pour freelances/agences:
- onboarding email + mot de passe,
- mini CRM clients,
- génération de factures,
- lien de paiement public,
- dashboard KPI (MRR, pending, revenus 30j).

## Pourquoi ça peut bien se vendre

1. **Douleur claire**: la facturation et le suivi clients sont pénibles pour les indépendants.
2. **Time-to-value rapide**: un compte, un client, une facture en 3 minutes.
3. **Pricing simple**: 19€/mois solo, 49€/mois équipe.
4. **Canal d'acquisition**: contenu SEO “modèle facture freelance”, partenariat outils de compta.

## Lancer localement

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

Puis ouvrir `http://127.0.0.1:5000`.

## Stack

- Flask + SQLAlchemy + Flask-Login
- SQLite (facile à remplacer par Postgres via `DATABASE_URL`)
- HTML/Jinja + CSS simple

## Roadmap pour vendre vraiment

- intégrer Stripe Checkout + webhooks,
- ajouter relances automatiques facture,
- export comptable CSV,
- offres white-label,
- analytics churn cohortes.
