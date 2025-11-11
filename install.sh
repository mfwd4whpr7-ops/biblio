#!/bin/bash

# Script d'installation pour le projet Bibliothèque
# Ce script automatise l'installation et la configuration du projet

set -e  # Arrêter en cas d'erreur

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher des messages colorés
print_info() {
    echo -e "${BLUE}ℹ ${NC}$1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Fonction pour vérifier les prérequis
check_prerequisites() {
    print_info "Vérification des prérequis..."

    # Vérifier Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js n'est pas installé. Veuillez l'installer depuis https://nodejs.org/"
        exit 1
    fi

    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18 ou supérieure est requise. Version actuelle: $(node -v)"
        exit 1
    fi
    print_success "Node.js $(node -v) détecté"

    # Vérifier npm
    if ! command -v npm &> /dev/null; then
        print_error "npm n'est pas installé"
        exit 1
    fi
    print_success "npm $(npm -v) détecté"

    # Vérifier git
    if ! command -v git &> /dev/null; then
        print_warning "git n'est pas installé (optionnel pour le développement)"
    else
        print_success "git $(git --version | cut -d' ' -f3) détecté"
    fi
}

# Fonction pour installer les dépendances
install_dependencies() {
    print_info "Installation des dépendances npm..."

    if [ -f "package-lock.json" ]; then
        npm install --legacy-peer-deps
    else
        npm install --legacy-peer-deps
    fi

    print_success "Dépendances installées avec succès"
}

# Fonction pour créer le fichier .env s'il n'existe pas
setup_env() {
    if [ ! -f ".env.local" ]; then
        print_info "Création du fichier .env.local..."

        if [ -f ".env.example" ]; then
            cp .env.example .env.local
            print_success "Fichier .env.local créé depuis .env.example"
            print_warning "N'oubliez pas de configurer vos variables d'environnement dans .env.local"
        else
            cat > .env.local << EOF
# Configuration Node.js
NODE_ENV=development

# Configuration Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Google Books API (optionnel - fonctionne sans clé pour un usage limité)
# GOOGLE_BOOKS_API_KEY=votre_cle_api_ici

# Sécurité (générer des clés aléatoires en production)
SESSION_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

# Base de données (à configurer pour la production)
# DATABASE_URL=postgresql://user:password@localhost:5432/bibliotheque
EOF
            print_success "Fichier .env.local créé avec les valeurs par défaut"
        fi
    else
        print_success "Fichier .env.local déjà existant"
    fi
}

# Fonction pour vérifier le build
verify_build() {
    print_info "Vérification du build..."

    npm run build

    if [ $? -eq 0 ]; then
        print_success "Build réussi !"
    else
        print_error "Le build a échoué. Veuillez vérifier les erreurs ci-dessus."
        exit 1
    fi
}

# Fonction pour afficher les instructions de démarrage
print_instructions() {
    echo ""
    echo "═══════════════════════════════════════════════════════════════"
    print_success "Installation terminée avec succès !"
    echo "═══════════════════════════════════════════════════════════════"
    echo ""
    print_info "Pour démarrer le serveur de développement :"
    echo "  npm run dev"
    echo ""
    print_info "Pour construire pour la production :"
    echo "  npm run build"
    echo ""
    print_info "Pour démarrer en mode production :"
    echo "  npm run start"
    echo ""
    print_info "Compte de démonstration :"
    echo "  Email     : demo@bibliotheque.fr"
    echo "  Mot de passe : DemoSecure2025!"
    echo ""
    print_info "Documentation complète : README.md"
    echo "═══════════════════════════════════════════════════════════════"
}

# Fonction principale
main() {
    echo "═══════════════════════════════════════════════════════════════"
    echo "  🚀 Installation du projet Bibliothèque"
    echo "═══════════════════════════════════════════════════════════════"
    echo ""

    check_prerequisites
    echo ""

    install_dependencies
    echo ""

    setup_env
    echo ""

    # Demander si l'utilisateur veut vérifier le build
    read -p "Voulez-vous vérifier le build maintenant ? (o/N) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Oo]$ ]]; then
        verify_build
    else
        print_info "Build ignoré. Vous pouvez le faire plus tard avec : npm run build"
    fi

    print_instructions
}

# Exécuter le script
main
