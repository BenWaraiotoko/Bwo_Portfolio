#!/bin/bash

# Script de déploiement du portfolio Hugo
# Usage: ./deploy.sh [production|staging]

set -e  # Arrêt en cas d'erreur

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Déploiement du portfolio Hugo${NC}"

# Vérifier l'environnement
ENV=${1:-production}
echo -e "${YELLOW}Environnement : ${ENV}${NC}"

# Nettoyer les fichiers générés précédemment
echo -e "${YELLOW}🧹 Nettoyage...${NC}"
rm -rf public/ resources/

# Build du site
echo -e "${YELLOW}🔨 Build Hugo...${NC}"
if [ "$ENV" == "production" ]; then
    hugo --minify
else
    hugo -D --minify
fi

echo -e "${GREEN}✅ Build terminé !${NC}"

# Stats
echo -e "${YELLOW}📊 Statistiques :${NC}"
echo "   - Fichiers HTML : $(find public -name "*.html" | wc -l)"
echo "   - Fichiers CSS : $(find public -name "*.css" | wc -l)"
echo "   - Fichiers JS : $(find public -name "*.js" | wc -l)"
echo "   - Taille totale : $(du -sh public | cut -f1)"

# Option : Déployer sur un serveur distant via rsync (optionnel)
if [ "$ENV" == "production" ] && [ ! -z "$DEPLOY_HOST" ]; then
    echo -e "${YELLOW}📤 Déploiement sur le serveur...${NC}"
    rsync -avz --delete \
        -e "ssh -p ${DEPLOY_PORT:-22}" \
        public/ ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}
    echo -e "${GREEN}✅ Déploiement réussi !${NC}"
fi

# Commit et push Git (optionnel)
read -p "Voulez-vous commit et push vers GitHub ? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}📝 Git commit...${NC}"
    git add .
    git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M')" || echo "Rien à commiter"
    git push origin main
    echo -e "${GREEN}✅ Poussé vers GitHub !${NC}"
    echo -e "${GREEN}🌐 Cloudflare Pages va déployer automatiquement${NC}"
fi

echo -e "${GREEN}✨ Terminé !${NC}"