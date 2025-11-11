# 🚀 Guide de Déploiement - Bibliothèque

Ce guide couvre les différentes options de déploiement pour l'application Bibliothèque.

## Table des Matières

1. [Déploiement Vercel](#déploiement-vercel) (Recommandé)
2. [Déploiement Netlify](#déploiement-netlify)
3. [Déploiement Docker](#déploiement-docker)
4. [Déploiement VPS/Cloud](#déploiement-vpscloud)
5. [Configuration Base de Données](#configuration-base-de-données)
6. [Checklist de Production](#checklist-de-production)

---

## Déploiement Vercel

Vercel est la solution recommandée pour les applications Next.js (créée par l'équipe Next.js).

### Option 1 : Déploiement via GitHub (Recommandé)

1. **Poussez votre code sur GitHub**
   ```bash
   git push origin main
   ```

2. **Connectez-vous à Vercel**
   - Accédez à [vercel.com](https://vercel.com)
   - Cliquez sur "Import Project"
   - Sélectionnez votre repository GitHub

3. **Configuration du Projet**
   ```
   Framework Preset: Next.js
   Root Directory: ./
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install --legacy-peer-deps
   ```

4. **Variables d'Environnement**

   Ajoutez dans les paramètres du projet :
   ```env
   NODE_ENV=production
   NEXT_PUBLIC_APP_URL=https://votre-app.vercel.app
   SESSION_SECRET=votre_secret_32_caracteres_minimum
   ```

5. **Déploiement**
   - Cliquez sur "Deploy"
   - Votre app sera disponible sur `https://votre-app.vercel.app`

### Option 2 : Déploiement via Vercel CLI

```bash
# Installation de Vercel CLI
npm install -g vercel

# Login
vercel login

# Déploiement
vercel

# Déploiement en production
vercel --prod
```

### Configuration Vercel Avancée

`vercel.json` (optionnel) :
```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install --legacy-peer-deps",
  "framework": "nextjs",
  "regions": ["iad1"],
  "env": {
    "NODE_ENV": "production"
  }
}
```

---

## Déploiement Netlify

### Via l'Interface Web

1. **Connectez votre Repository**
   - Accédez à [netlify.com](https://netlify.com)
   - Cliquez sur "New site from Git"
   - Sélectionnez votre repository

2. **Configuration du Build**
   ```
   Build command: npm run build
   Publish directory: .next
   ```

3. **Variables d'Environnement**

   Settings > Build & deploy > Environment :
   ```env
   NODE_ENV=production
   NEXT_PUBLIC_APP_URL=https://votre-app.netlify.app
   SESSION_SECRET=votre_secret_32_caracteres
   ```

### Via Netlify CLI

```bash
# Installation
npm install -g netlify-cli

# Login
netlify login

# Initialisation
netlify init

# Déploiement
netlify deploy --prod
```

### Configuration `netlify.toml`

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"
  NPM_FLAGS = "--legacy-peer-deps"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

---

## Déploiement Docker

### Créer le Dockerfile

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Installer les dépendances
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Build de l'application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### Créer `.dockerignore`

```
node_modules
.next
.git
.env.local
npm-debug.log
README.md
.DS_Store
```

### Créer `docker-compose.yml`

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - SESSION_SECRET=${SESSION_SECRET}
    restart: unless-stopped

  # Base de données PostgreSQL (optionnel)
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: bibliotheque
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: bibliotheque
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
```

### Modifier `next.config.mjs`

Ajoutez cette ligne pour le mode standalone :

```javascript
export default {
  output: 'standalone',
  // ... reste de la config
}
```

### Commandes Docker

```bash
# Build
docker build -t bibliotheque-app .

# Run
docker run -p 3000:3000 -e SESSION_SECRET=votre_secret bibliotheque-app

# Avec docker-compose
docker-compose up -d

# Logs
docker-compose logs -f

# Arrêter
docker-compose down
```

---

## Déploiement VPS/Cloud

### AWS EC2 / DigitalOcean / Linode

#### 1. Configuration du Serveur

```bash
# Connexion SSH
ssh user@votre-ip

# Mise à jour du système
sudo apt update && sudo apt upgrade -y

# Installation de Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Installation de PM2 (gestionnaire de processus)
sudo npm install -g pm2

# Installation de Nginx (reverse proxy)
sudo apt install -y nginx

# Installation de Certbot (SSL)
sudo apt install -y certbot python3-certbot-nginx
```

#### 2. Déploiement de l'Application

```bash
# Cloner le projet
git clone votre-repo
cd biblio

# Installer les dépendances
npm install --legacy-peer-deps

# Créer le fichier .env.local
nano .env.local
# Remplir les variables d'environnement

# Build
npm run build

# Démarrer avec PM2
pm2 start npm --name "bibliotheque" -- start
pm2 save
pm2 startup
```

#### 3. Configuration Nginx

```bash
sudo nano /etc/nginx/sites-available/bibliotheque
```

```nginx
server {
    listen 80;
    server_name votre-domaine.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Activer le site
sudo ln -s /etc/nginx/sites-available/bibliotheque /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 4. SSL avec Let's Encrypt

```bash
sudo certbot --nginx -d votre-domaine.com
```

#### 5. Mise à jour Automatique

Créez un script `deploy.sh` :

```bash
#!/bin/bash
cd /path/to/biblio
git pull origin main
npm install --legacy-peer-deps
npm run build
pm2 restart bibliotheque
```

---

## Configuration Base de Données

### PostgreSQL avec Prisma (Recommandé)

#### 1. Installation de Prisma

```bash
npm install prisma @prisma/client --legacy-peer-deps
npx prisma init
```

#### 2. Configuration `schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           String   @id @default(uuid())
  email        String   @unique
  passwordHash String
  createdAt    DateTime @default(now())
  books        Book[]
}

model Book {
  id            String   @id @default(uuid())
  isbn          String   @unique
  title         String
  authors       String[]
  publisher     String?
  publishedDate String?
  description   String?
  imageUrl      String?
  userId        String
  user          User     @relation(fields: [userId], references: [id])
  createdAt     DateTime @default(now())
}
```

#### 3. Migration

```bash
npx prisma migrate dev --name init
npx prisma generate
```

#### 4. Modifier `lib/auth.ts`

Remplacer les Map par Prisma :

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function registerUser(email: string, password: string) {
  const passwordHash = await hashPassword(password)

  const user = await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      passwordHash,
    },
  })

  return { user, token: createSession(user.id) }
}
```

---

## Checklist de Production

### Sécurité

- [ ] Variables d'environnement sécurisées
- [ ] SESSION_SECRET fort (32+ caractères aléatoires)
- [ ] HTTPS activé (SSL/TLS)
- [ ] Cookies sécurisés (secure: true, httpOnly: true)
- [ ] Rate limiting implémenté
- [ ] CORS configuré correctement
- [ ] Headers de sécurité (CSP, HSTS, etc.)
- [ ] Validation des entrées avec Zod
- [ ] Sanitization des données

### Performance

- [ ] Build optimisé (npm run build)
- [ ] Images optimisées (Next.js Image)
- [ ] Compression gzip/brotli activée
- [ ] Cache configuré (CDN)
- [ ] Database indexes créés
- [ ] Connection pooling configuré

### Monitoring

- [ ] Logs configurés (Winston, Pino)
- [ ] Error tracking (Sentry)
- [ ] Analytics (Vercel Analytics, GA)
- [ ] Uptime monitoring (UptimeRobot)
- [ ] Performance monitoring (New Relic, DataDog)

### Backup

- [ ] Base de données sauvegardée régulièrement
- [ ] Images/fichiers sauvegardés (S3, Cloudinary)
- [ ] Plan de récupération testé

### Documentation

- [ ] README.md à jour
- [ ] Variables d'environnement documentées
- [ ] API documentée
- [ ] Runbook créé

### Base de Données

- [ ] Migration de Map vers PostgreSQL/MongoDB
- [ ] Indexes créés
- [ ] Contraintes définies
- [ ] Backups automatiques
- [ ] Connection pooling

### Tests

- [ ] Tests unitaires passent
- [ ] Tests d'intégration passent
- [ ] Tests e2e passent
- [ ] Performance testée
- [ ] Sécurité testée (OWASP)

---

## Scripts Utiles

### Script de Déploiement

`scripts/deploy.sh` :

```bash
#!/bin/bash
set -e

echo "🚀 Démarrage du déploiement..."

# Tests
echo "🧪 Exécution des tests..."
npm run test

# Build
echo "🔨 Build de l'application..."
npm run build

# Backup de la base de données
echo "💾 Backup de la base de données..."
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d-%H%M%S).sql

# Déploiement
echo "📦 Déploiement..."
pm2 restart bibliotheque

echo "✅ Déploiement terminé !"
```

### Script de Backup

`scripts/backup.sh` :

```bash
#!/bin/bash
BACKUP_DIR="/backups/bibliotheque"
DATE=$(date +%Y%m%d-%H%M%S)

# Base de données
pg_dump $DATABASE_URL | gzip > "$BACKUP_DIR/db-$DATE.sql.gz"

# Fichiers
tar -czf "$BACKUP_DIR/files-$DATE.tar.gz" /path/to/uploads

# Nettoyer les anciens backups (> 30 jours)
find $BACKUP_DIR -type f -mtime +30 -delete

echo "✅ Backup créé : $DATE"
```

---

## Support et Ressources

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Docker Documentation](https://docs.docker.com/)
- [Prisma Documentation](https://www.prisma.io/docs)

---

**Besoin d'aide ?** Ouvrez une [issue](https://github.com/votre-repo/issues) ou consultez la documentation.
