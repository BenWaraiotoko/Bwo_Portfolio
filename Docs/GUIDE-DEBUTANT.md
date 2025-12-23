# 🚀 Guide Pas-à-Pas : Portfolio Hugo pour Débutant

## 🍎 Version macOS (Apple Silicon M1/M2/M3/M4)

---

## Table des matières

1. [Comprendre le workflow](#1-comprendre-le-workflow)
2. [Pourquoi le cloud gratuit plutôt que le NAS](#2-pourquoi-le-cloud-gratuit-plutôt-que-le-nas)
3. [Les options d'hébergement gratuit](#3-les-options-dhébergement-gratuit)
4. [Installation sur ton Mac](#4-installation-sur-ton-mac)
5. [Créer ton site Hugo](#5-créer-ton-site-hugo)
6. [Publier sur GitHub](#6-publier-sur-github)
7. [Déployer sur Cloudflare Pages (gratuit)](#7-déployer-sur-cloudflare-pages)
8. [Alternative : GitHub Pages](#8-alternative-github-pages)
9. [Workflow quotidien](#9-workflow-quotidien)
10. [FAQ et problèmes courants](#10-faq-et-problèmes-courants)

---

## 1. Comprendre le workflow

### Le schéma simple

```
┌─────────────────┐      ┌─────────────┐      ┌──────────────────┐
│   TON MAC       │      │   GITHUB    │      │  CLOUD GRATUIT   │
│   (développe)   │ ──── │  (backup)   │ ──── │  (héberge)       │
│                 │ push │             │ auto │                  │
│ - VS Code       │      │ - Code      │      │ - Cloudflare     │
│ - Hugo          │      │ - Historique│      │ - ou GitHub Pages│
│ - Terminal      │      │ - Sécurisé  │      │ - HTTPS gratuit  │
└─────────────────┘      └─────────────┘      └──────────────────┘
```

### En français simple

1. **Tu travailles sur ton Mac** : tu écris tes articles en Markdown, tu testes en local
2. **Tu sauvegardes sur GitHub** : c'est ta backup + versioning (tu peux revenir en arrière)
3. **Le cloud déploie automatiquement** : dès que tu push sur GitHub, le site se met à jour tout seul

### Pourquoi c'est mieux que le NAS ?

| Aspect | NAS | Cloud gratuit |
|--------|-----|---------------|
| **Fiabilité** | Si ton NAS tombe, site down | 99.99% uptime garanti |
| **Backup** | Tu dois gérer toi-même | GitHub = ta backup |
| **Vitesse** | Dépend de ta connexion | CDN mondial (rapide partout) |
| **HTTPS** | Config manuelle (Let's Encrypt) | Automatique et gratuit |
| **Coût** | Électricité + maintenance | 100% gratuit |
| **Complexité** | Docker, reverse proxy... | Zéro config serveur |

---

## 2. Pourquoi le cloud gratuit plutôt que le NAS

### Ton inquiétude est légitime

> "Si je perds mon NAS, je perds mon site"

Avec l'approche cloud :
- **Code source** → GitHub (backup infinie, gratuit)
- **Site en ligne** → Cloudflare/GitHub Pages (infrastructure pro)
- **Ton NAS (DS923+)** → Optionnel, juste pour backup locale ou autres usages

### Le site Hugo pèse combien ?

Un site Hugo typique : **5 à 50 Mo** (sans les vidéos)

C'est RIEN. Toutes les offres gratuites acceptent ça facilement.

---

## 3. Les options d'hébergement gratuit

### Comparatif

| Service | Gratuit | Déploiement auto | Domaine perso | Recommandation |
|---------|---------|------------------|---------------|----------------|
| **Cloudflare Pages** | ✅ Illimité | ✅ | ✅ Gratuit | ⭐ **Mon choix #1** |
| **GitHub Pages** | ✅ Illimité | ✅ | ✅ Gratuit | ⭐ Le plus simple |
| **Netlify** | ✅ 100GB/mois | ✅ | ✅ Gratuit | Très populaire |
| **Vercel** | ✅ 100GB/mois | ✅ | ✅ Gratuit | Orienté React |
| **Render** | ✅ Sites statiques | ✅ | ✅ Gratuit | Simple |

### Ma recommandation : Cloudflare Pages

**Pourquoi ?**
- 100% gratuit, pas de limite de bande passante
- CDN mondial (ton site est rapide au Japon aussi 🇯🇵)
- Déploiement automatique depuis GitHub
- HTTPS automatique
- Domaine personnalisé gratuit
- Interface simple

---

## 4. Installation sur ton Mac

### Étape 4.1 : Ouvrir le Terminal

- Appuie sur `Cmd + Espace` (Spotlight)
- Tape "Terminal"
- Entrée

Ou va dans : **Applications → Utilitaires → Terminal**

### Étape 4.2 : Installer Homebrew (le gestionnaire de paquets pour Mac)

Homebrew est **indispensable** sur Mac. C'est comme l'App Store mais pour les outils de développement.

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

> ⚠️ Le script va te demander ton mot de passe Mac (celui de ta session).

**Après l'installation, IMPORTANT pour Mac ARM :**

Le script va t'afficher des instructions. Tu dois exécuter ces commandes :

```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

**Vérifier que Homebrew fonctionne :**

```bash
brew --version
# Doit afficher : Homebrew 4.x.x
```

### Étape 4.3 : Installer Git

Git est peut-être déjà installé sur ton Mac. Vérifie :

```bash
git --version
```

Si ça affiche une version, c'est bon ! Sinon :

```bash
brew install git
```

### Étape 4.4 : Installer Hugo Extended

```bash
brew install hugo
```

**Vérifier l'installation :**

```bash
hugo version
```

Tu dois voir quelque chose comme :
```
hugo v0.153.0+extended darwin/arm64 ...
                ^^^^^^^^ ^^^^^^^^^^
                IMPORTANT : "extended" et "arm64" doivent apparaître
```

> ✅ Sur Mac ARM avec Homebrew, tu obtiens automatiquement la version Extended. Parfait !

### Étape 4.5 : Installer VS Code

**Option A : Avec Homebrew (recommandé)**

```bash
brew install --cask visual-studio-code
```

**Option B : Téléchargement manuel**

1. Va sur https://code.visualstudio.com
2. Télécharge la version **"Apple Silicon"**
3. Glisse dans Applications

**Lancer VS Code depuis le Terminal (pratique) :**

1. Ouvre VS Code
2. `Cmd + Shift + P` → tape "shell command"
3. Sélectionne "Install 'code' command in PATH"

Maintenant tu peux faire :
```bash
code .  # Ouvre le dossier courant dans VS Code
```

**Extensions utiles à installer dans VS Code :**

1. Clique sur l'icône Extensions (carré à gauche) ou `Cmd + Shift + X`
2. Recherche et installe :
   - "Hugo Language and Syntax Support"
   - "Markdown All in One"
   - "Even Better TOML"

### Étape 4.6 : Créer un compte GitHub

1. Va sur https://github.com
2. Clique "Sign up"
3. Crée ton compte (gratuit)
4. Vérifie ton email

### Étape 4.7 : Configurer Git avec ton identité

```bash
git config --global user.name "Ton Nom"
git config --global user.email "ton@email.com"
```

> Utilise le même email que ton compte GitHub.

---

## 5. Créer ton site Hugo

### Étape 5.1 : Créer un dossier pour tes projets

```bash
# Créer un dossier Projets dans ton home
mkdir -p ~/Projets
cd ~/Projets
```

### Étape 5.2 : Créer le site Hugo

```bash
# Crée le site Hugo
hugo new site mon-portfolio

# Entre dans le dossier
cd mon-portfolio
```

### Étape 5.3 : Initialiser Git

```bash
git init
```

### Étape 5.4 : Ajouter le thème LoveIt

```bash
git submodule add https://github.com/dillonzq/LoveIt.git themes/LoveIt
```

### Étape 5.5 : Copier la configuration

**Utiliser le ZIP que je t'ai fourni :**

1. Télécharge `portfolio-hugo.zip`
2. Double-clique pour extraire (ou `unzip portfolio-hugo.zip` dans le Terminal)
3. Ouvre le Finder, va dans le dossier extrait `portfolio-hugo`
4. Copie ces fichiers/dossiers dans `~/Projets/mon-portfolio` :

```bash
# Ou en ligne de commande (adapte le chemin du ZIP) :
cd ~/Projets/mon-portfolio

# Si le ZIP est dans Téléchargements :
cp ~/Downloads/portfolio-hugo/config.toml .
cp -r ~/Downloads/portfolio-hugo/assets .
cp -r ~/Downloads/portfolio-hugo/layouts .
cp -r ~/Downloads/portfolio-hugo/static .
cp -r ~/Downloads/portfolio-hugo/content .
```

### Étape 5.6 : Personnaliser la configuration

Ouvre `config.toml` dans VS Code :

```bash
code config.toml
```

Modifie ces lignes avec tes infos :

```toml
baseURL = "https://ton-site.pages.dev"  # On changera après le déploiement
title = "Benjamin | Data Engineer"

[params.home.profile]
  title = "Data Engineer en devenir"
  subtitle = "Python | SQL | ETL"
  
[params.social]
  GitHub = "ton-username-github"
  Email = "ton@email.com"
```

### Étape 5.7 : Tester en local

```bash
hugo server -D
```

Tu vas voir :
```
Web Server is available at http://localhost:1313/ (bind address 127.0.0.1)
Press Ctrl+C to stop
```

**Ouvre ton navigateur : http://localhost:1313**

**Tu dois voir ton site !** 🎉

> Appuie sur `Ctrl+C` dans le Terminal pour arrêter le serveur.

---

## 6. Publier sur GitHub

### Étape 6.1 : Créer le repository sur GitHub

1. Va sur https://github.com
2. Clique le bouton vert **"New"** (en haut à droite)
3. Paramètres :
   - **Repository name** : `portfolio` (ou ce que tu veux)
   - **Description** : "Mon portfolio Data Engineer"
   - **Public** ✅ (pour que Cloudflare puisse y accéder)
   - **Ne coche PAS** "Add a README file"
4. Clique **"Create repository"**

### Étape 6.2 : Lier ton projet local à GitHub

GitHub te montre des commandes. Dans ton Terminal :

```bash
# Assure-toi d'être dans le bon dossier
cd ~/Projets/mon-portfolio

# Ajoute tous les fichiers
git add .

# Premier commit
git commit -m "Initial commit - Mon portfolio Hugo"

# Configure la branche principale
git branch -M main

# Lie au repository GitHub (REMPLACE par TON URL !)
git remote add origin https://github.com/TON-USERNAME/portfolio.git

# Envoie sur GitHub
git push -u origin main
```

> 💡 **Authentification GitHub :**
> 
> La première fois, GitHub va te demander de t'authentifier. 
> 
> **Méthode recommandée : GitHub CLI**
> ```bash
> brew install gh
> gh auth login
> ```
> Suis les instructions (navigateur web).

### Étape 6.3 : Vérifier

Va sur `https://github.com/TON-USERNAME/portfolio`

Tu dois voir tous tes fichiers ! ✅

---

## 7. Déployer sur Cloudflare Pages

### Étape 7.1 : Créer un compte Cloudflare (gratuit)

1. Va sur https://pages.cloudflare.com
2. Clique **"Sign up"** 
3. Crée ton compte (email + mot de passe)
4. Vérifie ton email

### Étape 7.2 : Connecter GitHub

1. Dans le dashboard Cloudflare, clique sur **"Workers & Pages"** (menu gauche)
2. Clique **"Create"**
3. Sélectionne l'onglet **"Pages"**
4. Clique **"Connect to Git"**
5. Clique **"Connect GitHub"**
6. Autorise Cloudflare à accéder à ton GitHub
7. Sélectionne ton repository `portfolio`
8. Clique **"Begin setup"**

### Étape 7.3 : Configurer le build

Cloudflare te demande les paramètres de build :

| Champ | Valeur |
|-------|--------|
| **Project name** | `portfolio` (ou ce que tu veux) |
| **Production branch** | `main` |
| **Framework preset** | Sélectionne **`Hugo`** dans la liste |
| **Build command** | `hugo --minify` (pré-rempli) |
| **Build output directory** | `public` (pré-rempli) |

### Étape 7.4 : Ajouter la variable HUGO_VERSION (CRUCIAL !)

Déroule la section **"Environment variables (advanced)"**

Clique **"Add variable"** et ajoute :

| Variable name | Value |
|---------------|-------|
| `HUGO_VERSION` | `0.153.0` |

> ⚠️ **TRÈS IMPORTANT** : Sans cette variable, Cloudflare utilise une vieille version d'Hugo et le build échouera !

### Étape 7.5 : Lancer le déploiement

1. Clique **"Save and Deploy"**
2. Attends 1-2 minutes... (tu vois les logs défiler)
3. Quand c'est vert ✅, Cloudflare te donne une URL :
   
   `https://portfolio-xxx.pages.dev`

**Ouvre cette URL : ton site est en ligne !** 🎉🎉🎉

### Étape 7.6 : Mettre à jour baseURL

Maintenant que tu as ton URL définitive, mets à jour `config.toml` :

```bash
code ~/Projets/mon-portfolio/config.toml
```

Change la première ligne :
```toml
baseURL = "https://portfolio-xxx.pages.dev"
```

Puis sauvegarde et pousse :

```bash
cd ~/Projets/mon-portfolio
git add .
git commit -m "Update baseURL"
git push
```

**Cloudflare redéploie automatiquement !** (attends 1-2 min)

---

## 8. Alternative : GitHub Pages

Si tu préfères rester 100% sur GitHub (sans Cloudflare) :

### Étape 8.1 : Créer le workflow GitHub Actions

```bash
# Crée le dossier pour le workflow
mkdir -p .github/workflows

# Crée le fichier
code .github/workflows/hugo.yml
```

Colle ce contenu :

```yaml
name: Deploy Hugo site to GitHub Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

defaults:
  run:
    shell: bash

jobs:
  build:
    runs-on: ubuntu-latest
    env:
      HUGO_VERSION: 0.139.0
    steps:
      - name: Install Hugo CLI
        run: |
          wget -O ${{ runner.temp }}/hugo.deb https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_linux-amd64.deb \
          && sudo dpkg -i ${{ runner.temp }}/hugo.deb
      - name: Checkout
        uses: actions/checkout@v4
        with:
          submodules: recursive
      - name: Setup Pages
        id: pages
        uses: actions/configure-pages@v4
      - name: Build with Hugo
        run: |
          hugo --minify --baseURL "${{ steps.pages.outputs.base_url }}/"
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v2
        with:
          path: ./public

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v3
```

### Étape 8.2 : Activer GitHub Pages

1. Va dans ton repo GitHub → **Settings** (onglet)
2. Menu gauche → **Pages**
3. **Source** : sélectionne **"GitHub Actions"**
4. Sauvegarde

### Étape 8.3 : Pousser et déployer

```bash
git add .
git commit -m "Add GitHub Pages workflow"
git push
```

Va dans l'onglet **"Actions"** de ton repo pour voir le déploiement.

Ton site sera sur : `https://TON-USERNAME.github.io/portfolio/`

---

## 9. Workflow quotidien

### Pour ajouter un nouvel article

```bash
# 1. Va dans ton projet
cd ~/Projets/mon-portfolio

# 2. Créer l'article
hugo new posts/mon-nouvel-article.md

# 3. Éditer dans VS Code
code content/posts/mon-nouvel-article.md

# 4. Prévisualiser en local
hugo server -D
# → Ouvre http://localhost:1313

# 5. Quand c'est prêt, change "draft: true" → "draft: false"

# 6. Sauvegarder et publier
git add .
git commit -m "Nouvel article: Mon titre"
git push

# 7. Attendre 1-2 min, le site se met à jour tout seul !
```

### Schéma du workflow

```
Écrire en Markdown (VS Code)
       ↓
Prévisualiser (hugo server -D)
       ↓
git add . && git commit -m "message" && git push
       ↓
☕ Attendre 1-2 min
       ↓
Site mis à jour automatiquement !
```

### Raccourci : créer un alias

Ajoute dans ton `~/.zshrc` :

```bash
# Ouvre le fichier
code ~/.zshrc
```

Ajoute à la fin :
```bash
# Alias pour le portfolio
alias portfolio="cd ~/Projets/mon-portfolio"
alias preview="hugo server -D"
alias deploy="git add . && git commit -m 'Update' && git push"
```

Recharge :
```bash
source ~/.zshrc
```

Maintenant tu peux faire :
```bash
portfolio   # Va dans le dossier
preview     # Lance le serveur local
deploy      # Commit et push en une commande
```

---

## 10. FAQ et problèmes courants

### Q: "command not found: brew"

Tu n'as pas ajouté Homebrew au PATH. Fais :

```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
source ~/.zprofile
```

### Q: "command not found: hugo"

```bash
brew install hugo
```

### Q: Le build Cloudflare échoue

**Erreur courante :** "Error: Unable to locate config file"

→ Vérifie que tu as bien un fichier `config.toml` à la racine

**Erreur :** Version Hugo trop vieille

→ Vérifie que tu as ajouté la variable `HUGO_VERSION = 0.139.0`

### Q: "fatal: remote origin already exists"

```bash
git remote remove origin
git remote add origin https://github.com/TON-USERNAME/portfolio.git
```

### Q: Comment mettre à jour le thème LoveIt ?

```bash
cd ~/Projets/mon-portfolio
git submodule update --remote themes/LoveIt
git add .
git commit -m "Update theme"
git push
```

### Q: Le graphe ne s'affiche pas

Vérifie que tu as bien :
1. Le fichier `static/js/knowledge-graph.js`
2. Le fichier `static/data/graph.json`
3. Le shortcode `layouts/shortcodes/knowledge-graph.html`

### Q: Comment ajouter un nom de domaine personnalisé ?

**Sur Cloudflare Pages :**
1. Dashboard → ton projet → **"Custom domains"**
2. Clique **"Set up a custom domain"**
3. Entre ton domaine (ex: `monsite.fr`)
4. Suis les instructions DNS

C'est **gratuit** avec HTTPS automatique !

### Q: Puis-je travailler depuis un autre Mac ?

Oui ! 

```bash
# Sur le nouveau Mac, clone ton repo
git clone https://github.com/TON-USERNAME/portfolio.git
cd portfolio

# Récupère le thème
git submodule update --init --recursive

# Installe Hugo
brew install hugo

# C'est prêt !
hugo server -D
```

### Q: Combien ça coûte vraiment ?

| Élément | Coût |
|---------|------|
| GitHub | Gratuit |
| Cloudflare Pages | Gratuit |
| Domaine .fr/.com | ~10-15€/an (optionnel) |
| **Total** | **0€ à 15€/an** |

### Q: Et mon NAS dans tout ça ?

Tu peux toujours l'utiliser pour :
- **Backup locale** : clone ton repo GitHub sur le NAS
- **Autres projets** : Docker, Jellyfin, Immich...
- **Dev secondaire** : si tu veux tester dessus

Mais pour la **production du site**, reste sur Cloudflare = plus fiable.

---

## Récapitulatif : Ce que tu dois faire

### Aujourd'hui (~30 min)

- [ ] Ouvrir le Terminal
- [ ] Installer Homebrew
- [ ] Installer Git et Hugo
- [ ] Créer compte GitHub
- [ ] Configurer Git (`git config`)
- [ ] Créer le site Hugo avec le ZIP fourni
- [ ] Tester en local (`hugo server -D`)

### Ensuite (~20 min)

- [ ] Créer le repo GitHub
- [ ] Push ton code
- [ ] Créer compte Cloudflare
- [ ] Connecter GitHub à Cloudflare Pages
- [ ] Ajouter variable `HUGO_VERSION`
- [ ] Déployer !
- [ ] Mettre à jour `baseURL`

### Après

- [ ] Personnaliser le contenu (about.md, etc.)
- [ ] Ajouter tes vrais projets
- [ ] Modifier les données du graphe
- [ ] (Optionnel) Acheter un nom de domaine

---

## Commandes mémo (Mac)

```bash
# Installation
brew install git hugo

# Créer un site
hugo new site mon-site

# Ajouter thème
git submodule add https://github.com/dillonzq/LoveIt.git themes/LoveIt

# Serveur local
hugo server -D

# Nouveau contenu
hugo new posts/mon-article.md

# Build production
hugo --minify

# Git
git add .
git commit -m "Mon message"
git push
```

---

## Besoin d'aide ?

Si tu bloques sur une étape, n'hésite pas à me demander ! Je peux te guider étape par étape.

Les erreurs les plus courantes sur Mac :
1. Oublier d'ajouter Homebrew au PATH après installation
2. Oublier la variable `HUGO_VERSION` dans Cloudflare
3. Oublier de mettre `draft: false` dans les articles

Bonne création de portfolio ! 🚀

---

*Guide créé pour Benjamin — Mac ARM — En route vers le Data Engineering et le Japon 🇯🇵*
