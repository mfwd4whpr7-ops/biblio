# 📚 Bibliothèque - Application de Gestion de Livres

Application web moderne pour gérer votre bibliothèque personnelle avec scan de livres par photo et recherche d'informations via Google Books API.

## ✨ Fonctionnalités

### Authentification Sécurisée
- Inscription et connexion avec email/mot de passe
- Hachage PBKDF2 avec 100,000 itérations
- Sessions sécurisées avec cookies HTTP-only
- Protection CSRF avec SameSite cookies
- Nettoyage automatique des sessions expirées

### Scanner de Livres
- **Mode Caméra** : Capturez la couverture ou le code-barres en direct
- **Mode Upload** : Téléchargez une photo existante
- Extraction automatique d'ISBN (OCR-ready)
- Recherche automatique des métadonnées via Google Books
- Affichage complet des informations du livre

### Interface Moderne
- Design responsive avec Tailwind CSS
- Composants UI professionnels (Shadcn/ui)
- Mode clair/sombre
- Animations fluides
- Gestion d'erreurs complète

## 🚀 Installation Rapide

### Méthode 1 : Installation Automatique (Recommandée)

```bash
# Cloner le repository
git clone <votre-repo-url>
cd biblio

# Exécuter le script d'installation
./install.sh
```

### Méthode 2 : Installation Manuelle

```bash
# 1. Installer les dépendances
npm install --legacy-peer-deps

# 2. Créer le fichier d'environnement
cp .env.example .env.local

# 3. Construire le projet
npm run build

# 4. Démarrer le serveur
npm run dev
```

## 📋 Prérequis

- Node.js >= 18.0.0
- npm >= 9.0.0
- Navigateur moderne avec support de l'API Camera (pour le scan)

## 🔧 Configuration

### Variables d'Environnement

Créez un fichier `.env.local` à la racine du projet :

```env
# Configuration Node.js
NODE_ENV=development

# URL de l'application
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Google Books API (optionnel)
GOOGLE_BOOKS_API_KEY=votre_cle_api_ici

# Secret de session (générer une clé aléatoire)
SESSION_SECRET=votre_secret_aleatoire_32_caracteres_minimum
```

### Obtenir une Clé Google Books API (Optionnel)

L'application fonctionne sans clé API mais avec des limitations. Pour un usage intensif :

1. Accédez à [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet
3. Activez l'API Google Books
4. Créez des identifiants (Clé API)
5. Ajoutez la clé dans `.env.local`

## 🎯 Utilisation

### Démarrage en Développement

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

### Compte de Démonstration

Un compte de test est automatiquement créé :

- **Email** : `demo@bibliotheque.fr`
- **Mot de passe** : `DemoSecure2025!`

### Scanner un Livre

1. Connectez-vous au dashboard
2. Cliquez sur "Scanner un livre"
3. Choisissez votre méthode :
   - **Caméra** : Pointez vers le code-barres ou la couverture
   - **Upload** : Sélectionnez une photo existante
4. L'application extrait l'ISBN et recherche les informations
5. Visualisez les détails du livre

## 🏗️ Architecture

### Structure du Projet

```
biblio/
├── app/                          # Application Next.js (App Router)
│   ├── api/                      # Routes API
│   │   ├── auth/                 # Authentification
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── verify/
│   │   │   └── logout/
│   │   ├── books/                # Recherche de livres
│   │   │   └── search/
│   │   └── scan/                 # Traitement d'images
│   │       └── process/
│   ├── dashboard/                # Page protégée (tableau de bord)
│   ├── scan/                     # Page de scan de livres
│   ├── layout.tsx                # Layout racine
│   ├── page.tsx                  # Page d'accueil (authentification)
│   └── globals.css               # Styles globaux
│
├── components/                   # Composants React
│   ├── ui/                       # Composants UI (Shadcn)
│   ├── book-scanner.tsx          # Composant de scan
│   ├── login-form.tsx            # Formulaire de connexion
│   └── register-form.tsx         # Formulaire d'inscription
│
├── lib/                          # Logique métier
│   ├── auth.ts                   # Gestion authentification
│   └── utils.ts                  # Utilitaires
│
├── middleware.ts                 # Middleware de protection
├── install.sh                    # Script d'installation
├── package.json                  # Dépendances
└── README.md                     # Documentation
```

### Technologies Utilisées

| Technologie | Version | Usage |
|------------|---------|-------|
| Next.js | 16.0.0 | Framework React SSR |
| React | 19.2.0 | Bibliothèque UI |
| TypeScript | 5.x | Typage statique |
| Tailwind CSS | 4.1.9 | Styling |
| Shadcn/ui | Latest | Composants UI |
| Radix UI | Latest | Composants accessibles |
| React Hook Form | 7.60.0 | Gestion de formulaires |
| Zod | 3.25.76 | Validation de schémas |

## 🔐 Sécurité

### Mesures Implémentées

- Hachage de mots de passe avec PBKDF2 (100,000 itérations)
- Cookies HTTP-only pour les sessions
- Protection CSRF avec SameSite
- Validation des entrées avec Zod
- Middleware de protection des routes
- Nettoyage automatique des sessions

### Recommandations pour la Production

1. **Base de données** : Remplacer le stockage en mémoire par PostgreSQL/MongoDB
2. **Secrets** : Utiliser des variables d'environnement sécurisées
3. **HTTPS** : Activer SSL/TLS en production
4. **Rate Limiting** : Ajouter une limitation des requêtes
5. **Monitoring** : Implémenter des logs et alertes
6. **Backup** : Mettre en place des sauvegardes régulières

## 🧪 Tests

```bash
# Linter
npm run lint

# Build de production
npm run build

# Démarrage en production
npm run start
```

## 📦 Dépendances Principales

```json
{
  "dependencies": {
    "next": "16.0.0",
    "react": "19.2.0",
    "react-dom": "19.2.0",
    "typescript": "^5",
    "tailwindcss": "^4.1.9",
    "react-hook-form": "^7.60.0",
    "zod": "3.25.76"
  }
}
```

## 🚀 Déploiement

Voir [DEPLOYMENT.md](./DEPLOYMENT.md) pour les instructions détaillées de déploiement sur :
- Vercel
- Netlify
- AWS
- Docker

## 🔮 Roadmap

### Phase 1 : Fondation (Complété ✅)
- [x] Authentification sécurisée
- [x] Module de scan de livres
- [x] Intégration Google Books API

### Phase 2 : Fonctionnalités Avancées (En cours)
- [ ] OCR réel avec Tesseract.js
- [ ] Base de données persistante (PostgreSQL)
- [ ] Gestion de bibliothèque personnelle
- [ ] Recherche et filtrage de livres

### Phase 3 : Amélirations (Futur)
- [ ] Export de la bibliothèque (PDF, CSV)
- [ ] Partage de collections
- [ ] Statistiques de lecture
- [ ] Recommandations de livres
- [ ] Mode hors ligne (PWA)

## 🐛 Dépannage

### Problème : Erreur de build avec Google Fonts

**Solution** : Les Google Fonts ont été désactivées. Si vous voulez les réactiver, modifiez `app/layout.tsx`

### Problème : L'appareil photo ne fonctionne pas

**Vérifications** :
1. Autorisations du navigateur (autoriser l'accès à la caméra)
2. Connexion HTTPS en production (requis pour l'API Camera)
3. Navigateur compatible (Chrome, Firefox, Safari récents)

### Problème : npm install échoue

**Solution** : Utilisez `npm install --legacy-peer-deps`

## 📝 License

Ce projet est sous licence MIT. Voir le fichier [LICENSE](./LICENSE) pour plus de détails.

## 👥 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Forkez le projet
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Poussez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📧 Support

Pour toute question ou problème :
- Ouvrez une [issue](https://github.com/votre-repo/issues)
- Consultez la [documentation](./DEPLOYMENT.md)

## 🙏 Remerciements

- [Next.js](https://nextjs.org/) - Framework React
- [Shadcn/ui](https://ui.shadcn.com/) - Composants UI
- [Google Books API](https://developers.google.com/books) - Données de livres
- [Radix UI](https://www.radix-ui.com/) - Composants accessibles
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS

---

Fait avec ❤️ pour les amoureux des livres
