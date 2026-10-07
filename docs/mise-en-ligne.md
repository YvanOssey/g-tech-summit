# Mise en ligne — G-TECH SUMMIT 2026

Site : **https://summit.ghostech.tech** · Hébergement : Hostinger (Node.js) · Base : Supabase · Paiement : Genius Pay · E-mails : billetterie@ghostech.tech

Les noms de menus Hostinger peuvent varier selon la version de hPanel.

---

## 1. Préparer Supabase

Dans le **SQL Editor**, toutes les migrations doivent avoir été exécutées, dans l'ordre :

| Fichier | Contenu |
|---|---|
| `supabase/migrations/0001_init.sql` | Tables, sécurité (RLS) |
| `supabase/seed.sql` | Contenu initial (une seule fois) |
| `supabase/migrations/0002_partner_logos.sql` | Stockage des logos |
| `supabase/migrations/0003_checkout.sql` | Réservation et paiement |
| `supabase/migrations/0004_registrations_admin.sql` | Gestion des inscriptions |
| `supabase/migrations/0005_checkins.sql` | Contrôle à l'entrée |
| `supabase/migrations/0006_mfa.sql` | Double authentification |

**Authentication → URL Configuration** :
- **Site URL** : `https://summit.ghostech.tech`
- **Redirect URLs** : ajouter `https://summit.ghostech.tech/admin/callback` (garder celle de `localhost` pour le développement)

**Authentication → Sign In / Providers** : « Allow new users to sign up » doit rester **désactivé**.

**Authentication → Policies / Settings** : longueur minimale des mots de passe **12**.

---

## 2. Créer l'application Node.js chez Hostinger

1. hPanel → **Sites web** → **Ajouter un site web** → **Node.js Web App** (ou *Node.js*).
2. Domaine : **summit.ghostech.tech** (créer le sous-domaine s'il est demandé).
3. **Version de Node.js** : 22 ou 24 (minimum 20.9).
4. **Code** : envoyer l'archive `g-tech-summit.zip` (voir « Préparer l'archive ») ou relier un dépôt GitHub privé.
5. Réglages de build :
   - **Commande d'installation** : `npm ci`
   - **Commande de build** : `npm run build` (elle lance `next build --webpack` : les serveurs Hostinger ont un système trop ancien — glibc < 2.29 — pour le compilateur natif de Next.js ; Next.js utilise alors sa version WebAssembly, qui ne fonctionne qu'avec Webpack. Pour la même raison, la configuration est en JavaScript : `next.config.mjs`, pas `.ts`.)
   - **Commande de démarrage** : `npm start`
   - **Répertoire** : la racine du projet (là où se trouve `package.json`)
6. **Variables d'environnement** : les saisir AVANT le premier build (voir section 3). Les variables `NEXT_PUBLIC_…` sont intégrées au moment du build : si on les change, il faut relancer un build.
7. Activer le **certificat SSL** (HTTPS) du sous-domaine s'il ne l'est pas automatiquement.

### Préparer l'archive

Depuis le dossier du projet :

```bash
git archive --format=zip -o ../g-tech-summit.zip HEAD
```

L'archive contient uniquement le code commité : ni `node_modules`, ni `.next`, ni `.env.local` (les clés ne partent jamais dans l'archive).

---

## 3. Variables d'environnement (chez Hostinger)

Mêmes noms que dans `.env.example`. Les valeurs ne doivent jamais être envoyées par chat ni commitées.

| Variable | Valeur |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://summit.ghostech.tech` |
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Clé publique Supabase (`sb_publishable_…`) |
| `SUPABASE_SECRET_KEY` | Clé secrète Supabase (`sb_secret_…`) |
| `GENIUSPAY_API_KEY` | Clé API Genius Pay — **sandbox** pour la recette, **live** pour l'ouverture |
| `GENIUSPAY_API_SECRET` | Secret API Genius Pay (même mode que la clé) |
| `GENIUSPAY_WEBHOOK_SECRET` | Secret du webhook (étape 4) |
| `SMTP_HOST` | `smtp.hostinger.com` |
| `SMTP_PORT` | `465` |
| `SMTP_USER` | `billetterie@ghostech.tech` |
| `SMTP_PASS` | Mot de passe de la boîte |
| `MAIL_FROM` | `G-TECH SUMMIT <billetterie@ghostech.tech>` |

---

## 4. Genius Pay

1. Tableau de bord → **Webhooks** → créer un webhook :
   - URL : `https://summit.ghostech.tech/api/paiements/webhook`
   - Événements : tous les événements de paiement (`payment.success`, `payment.failed`, `payment.cancelled`, `payment.refunded`…)
2. Copier le **secret** affiché (`whsec_…`, affiché une seule fois) dans `GENIUSPAY_WEBHOOK_SECRET`, puis relancer l'application.
3. Utiliser la fonction **« Tester »** du webhook : la notification doit apparaître dans l'admin → **Paiements** → « Notifications Genius Pay ».
4. Mettre le **nom commercial** du compte marchand à « Ghostech » (il apparaît sur la page de paiement).

---

## 5. Vérifications après déploiement (clés sandbox)

- [ ] `https://summit.ghostech.tech` s'affiche, en HTTPS, sans erreur.
- [ ] Connexion à `/admin` (et code de double authentification si activée).
- [ ] Admin → Paramètres : l'avertissement « webhook non configuré » a disparu.
- [ ] Un achat de test complet (paiement simulé) : billet affiché, **e-mail reçu**, lien du billet en `https://summit.ghostech.tech/billet/…`.
- [ ] Le QR code du billet, scanné avec un téléphone connecté à l'admin, affiche « Valider l'entrée ».
- [ ] La notification webhook de cet achat apparaît dans Paiements.

---

## 6. Ouverture réelle des ventes

À faire dans cet ordre, le jour de l'ouverture :

1. Les **CGV**, les **mentions légales** et la **politique de confidentialité** sont publiées.
2. Admin → Paramètres : **fermer** les inscriptions.
3. Supabase → SQL Editor : exécuter `supabase/cleanup-test-orders.sql` (supprime toutes les commandes de test ; le résultat doit afficher `0`).
4. Hostinger : remplacer `GENIUSPAY_API_KEY` et `GENIUSPAY_API_SECRET` par les **clés live**, puis relancer l'application.
5. Genius Pay : vérifier que le webhook est bien actif en mode **live** (en recréer un si les webhooks sont séparés par mode, et mettre à jour son secret).
6. Admin → Paramètres : **ouvrir** les inscriptions.
7. Faire **un vrai achat** (le pass le moins cher), vérifier billet, e-mail, tableau de bord, puis le **rembourser** depuis l'admin si souhaité.

---

## 7. À surveiller ensuite

- **Domaine `ghostech.tech`** : expire le 7 octobre 2027, renouvellement automatique conseillé.
- **Boîte e-mail** : essai gratuit jusqu'au **7 novembre 2026**, renouvellement automatique activé — vérifier le moyen de paiement du compte Hostinger.
- Admin → Tableau de bord : alerte « commandes à rembourser ».
- Admin → Journal d'activité : actions sensibles (exports, remboursements).
