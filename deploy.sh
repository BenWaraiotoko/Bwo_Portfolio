#!/bin/bash

# ===========================================
# DEPLOY.SH - Déploiement du portfolio Hugo
# ===========================================

set -e  # Exit on error

# Configuration (à adapter)
#NAS_USER="ton-user"
#NAS_HOST="192.168.1.xxx"  # IP de ton NAS
#NAS_PATH="/volume1/docker/portfolio"
# OU pour ZimaBoard:
# NAS_PATH="/DATA/docker/portfolio"

# Couleurs pour le terminal
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Déploiement du portfolio...${NC}"

# 1. Build Hugo
echo -e "${YELLOW}📦 Build Hugo...${NC}"
hugo --minify --gc

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erreur lors du build Hugo${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build terminé${NC}"

# 2. Sync vers NAS
echo -e "${YELLOW}📤 Synchronisation vers le NAS...${NC}"
rsync -avz --delete \
    --exclude '.git' \
    --exclude 'node_modules' \
    --exclude '.DS_Store' \
    public/ ${NAS_USER}@${NAS_HOST}:${NAS_PATH}/public/

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erreur lors du rsync${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Fichiers synchronisés${NC}"

# 3. Restart container (optionnel)
echo -e "${YELLOW}🔄 Redémarrage du container...${NC}"
ssh ${NAS_USER}@${NAS_HOST} "cd ${NAS_PATH} && docker-compose restart portfolio" 2>/dev/null || true

echo -e "${GREEN}✅ Déploiement terminé !${NC}"
echo -e "${GREEN}🌐 Site accessible sur https://ton-domaine.fr${NC}"
