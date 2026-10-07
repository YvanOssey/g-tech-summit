# G-TECH SUMMIT 2026

Site officiel et billetterie de **G-TECH SUMMIT 2026**, organisé par **Ghostech** les **18 et 19 décembre 2026 à Abidjan** : conférences, panels, formations express, ateliers et hackathon.

- Site public : programme, hackathon, infos pratiques, partenaires, billetterie en ligne.
- Billetterie : 3 pass (En ligne, Présentiel, Hackathon par équipe), paiement Genius Pay (Wave, Orange Money, MTN, Moov, carte), billets nominatifs avec QR code envoyés par e-mail.
- Administration (`/admin`) : tableau de bord, participants, commandes et billets, paiements et remboursements, équipes hackathon, contrôle à l'entrée, programme, partenaires, FAQ, paramètres, administrateurs, journal d'activité.

Mise en ligne prévue : **https://summit.ghostech.tech**

---

## Technologies

| | |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router, Server Actions), React 19, TypeScript |
| Style | Tailwind CSS 4, animations `motion` |
| Base de données, authentification, fichiers | [Supabase](https://supabase.com) (PostgreSQL avec Row Level Security, Auth, Storage) |
| Paiement | [Genius Pay](https://geniuspay.ci) (page de paiement hébergée + webhooks signés) |
| E-mails | SMTP Hostinger (`nodemailer`) |
| Hébergement | Hostinger, application Node.js |

> Next.js 16 diffère des versions précédentes (par exemple `middleware` devient `proxy`). Voir `AGENTS.md` et la documentation embarquée dans `node_modules/next/dist/docs/`.

---

## Démarrer en local

Prérequis : **Node.js 20.9 ou plus**, npm, un projet Supabase.

```bash
npm ci
```

```bash
cp .env.example .env.local
```

Remplir `.env.local` (voir les commentaires de `.env.example`), puis :

```bash
npm run dev
```

Le site est sur http://localhost:3000 et l'administration sur http://localhost:3000/admin. Le port 3000 est attendu par les liens de retour Supabase et Genius Pay.

| Commande | Rôle |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm start` | Démarre le build de production |
| `npm run lint` | Vérification ESLint |

### Base de données

Dans le **SQL Editor** de Supabase, exécuter dans l'ordre les fichiers de `supabase/migrations/` (`0001` à `0006`), puis une seule fois `supabase/seed.sql` (contenu initial du site).

Premier super administrateur : voir `supabase/bootstrap-super-admin.sql`. Les comptes suivants se gèrent depuis l'admin.

Sans base configurée, le site public s'affiche quand même avec le contenu des fichiers de `src/config` et `src/content` ; la billetterie reste fermée.

---

## Organisation du code

```
src/
├── app/
│   ├── (site)/          site public (accueil, programme, hackathon, billetterie, billet/[token]…)
│   ├── admin/           administration : (auth) connexion, (panel) pages protégées
│   └── api/             statut de paiement, webhook Genius Pay, export CSV admin
├── components/          composants du site, de la billetterie et de l'admin
├── config/              faits validés : événement, pass et prix, paramètres par défaut
├── content/             programme, hackathon, FAQ (valeurs de secours si la base est indisponible)
├── server/              code serveur uniquement : base, authentification, commande, paiement, e-mails
└── proxy.ts             protection de /admin (Next.js 16)
supabase/                migrations SQL, contenu initial, scripts utiles
docs/mise-en-ligne.md    guide de déploiement et d'ouverture des ventes
```

Les **prix et capacités** des pass sont fixés dans `src/config/passes.ts` : le serveur recalcule toujours le montant, jamais le navigateur.

---

## Sécurité

- Accès admin vérifié côté serveur sur chaque page et chaque action ; Row Level Security sur toutes les tables ; double authentification facultative, exigée aussi par la base pour les comptes qui l'ont activée.
- Clés et mots de passe uniquement dans les variables d'environnement (`.env.local` en local, panneau de l'hébergeur en production). **Ne jamais les commiter.**
- Paiements confirmés auprès de l'API Genius Pay, webhooks vérifiés par signature et horodatage.
- Les commandes passées avec les clés de test (sandbox) sont marquées « test » et exclues des chiffres ; `supabase/cleanup-test-orders.sql` les supprime avant l'ouverture des ventes.

---

## Mise en ligne

Tout est décrit pas à pas dans **[docs/mise-en-ligne.md](docs/mise-en-ligne.md)** : Supabase, application Node.js Hostinger, variables d'environnement, webhook Genius Pay, vérifications et ouverture réelle des ventes

---

## Contact

Ghostech — ghostech92@gmail.com — +225 05 56 13 02 45
