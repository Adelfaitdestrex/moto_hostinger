# Atelier Moto

Catalogue de motos Next.js, PHP/MySQL et espace administrateur protege par NextAuth.

## Installation locale

Prerequis : Node.js 20+, PHP 8.1+ avec PDO MySQL, et un compte MySQL capable de creer les tables.

Installer les dependances :

```bash
npm install --legacy-peer-deps
```

Creer `.env.local` a la racine :

```env
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="remplacer-par-une-longue-valeur-aleatoire"
PHP_API_URL="http://localhost:8000/api.php"
PHP_DB_HOST="localhost"
PHP_DB_NAME="atelier_moto"
PHP_DB_USER="UTILISATEUR"
PHP_DB_PASSWORD="MOT_DE_PASSE"
ADMIN_EMAIL="admin@votre-domaine.dz"
ADMIN_PASSWORD="remplacer-par-un-mot-de-passe-fort"
```

Creer la base MySQL si necessaire :

```sql
CREATE DATABASE atelier_moto CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Initialiser les tables depuis `php/database.sql`, puis lancer l API PHP en local :

```bash
php -S localhost:8000 -t php
```

Lancer le site :

```bash
npm run dev
```

Pages principales : `/`, `/motos`, `/admin/login`, `/admin`, `/admin/settings`.

## Deploiement Hostinger

Importer `php/database.sql` dans la base MySQL Hostinger, envoyer `php/api.php` et
`php/config.example.php` (renomme en `config.php`) sur l hebergement PHP, puis
remplacer les valeurs de `config.php`. Le fichier `config.php` est obligatoire :
les variables Node.js de Hostinger ne sont pas automatiquement disponibles pour
le runtime PHP. `DATABASE_URL` peut aussi être utilisé dans `config.php` pour la
connexion MySQL, mais `ADMIN_EMAIL` et `ADMIN_PASSWORD` doivent rester définis
dans ce fichier PHP.

Dans les variables d’environnement Hostinger, utiliser les valeurs de
production pour `NEXTAUTH_URL`, `NEXTAUTH_SECRET` et `PHP_API_URL`. La
commande `npm run build` utilise Webpack afin d’éviter les erreurs Turbopack
possibles sur l’environnement Hostinger.

```bash
npm install --legacy-peer-deps
npm run build
npm run start
```

Le dossier `public/uploads` doit etre accessible en ecriture pour l’upload des photos. Pour un stockage durable, utiliser un stockage persistant si l’hebergement recree le disque a chaque deploiement.

## Verification

```bash
npm run build
npm run lint
```
