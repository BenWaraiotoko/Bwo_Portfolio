# Portfolio Data Engineer - Hugo Kanagawa

Portfolio personnel minimaliste inspiré de [ssp.sh](https://www.ssp.sh/) avec thème Kanagawa et graphe interactif D3.js.

## ✨ Fonctionnalités

- 🎨 **Design Kanagawa** : Palette noir/rose/cyan élégante
- 📝 **Blog** : Articles en Markdown
- 💼 **Projets** : Showcase de tes réalisations
- 🧠 **Graphe interactif** : Visualisation D3.js de tes compétences
- 🚀 **Hébergement gratuit** : Cloudflare Pages
- ⚡ **Déploiement automatique** : Git push → Site mis à jour

## 🛠️ Stack technique

- **Hugo Extended** v0.139.0 : Générateur de site statique
- **Thème LoveIt** : Base du design
- **D3.js** v7.8.5 : Visualisations interactives
- **Cloudflare Pages** : Hébergement et CDN
- **GitHub** : Contrôle de version

## 📋 Prérequis

### Mac (ARM ou Intel)

```bash
# Homebrew (si pas installé)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Hugo Extended + Git
brew install git hugo
```

### Vérifications

```bash
hugo version   # Doit afficher "extended"
git --version
```

## 🚀 Installation

### 1. Clone ce repo

```bash
git clone https://github.com/ton-username/portfolio.git
cd portfolio
```

### 2. Installe le thème

```bash
git submodule add https://github.com/dillonzq/LoveIt.git themes/LoveIt
git submodule update --init --recursive
```

### 3. Lance en local

```bash
hugo server -D
```

Ouvre [http://localhost:1313](http://localhost:1313)

## ✏️ Personnalisation

### Modifier tes infos

Édite `config.toml` :

```toml
title = "Ton Nom"
baseURL = "https://ton-site.pages.dev/"

[params]
  author = "Ton Nom"
  description = "Ton slogan"
```

### Ajouter un article

```bash
hugo new posts/mon-article.md
```

Édite le fichier créé dans `content/posts/`

### Ajouter un projet

```bash
hugo new projects/mon-projet.md
```

### Modifier le graphe

Édite `static/data/graph.json` pour ajouter/supprimer des nœuds et liens.

## 🎨 Couleurs Kanagawa

Les couleurs sont définies dans `assets/css/kanagawa.css` :

| Élément | Couleur | Hex |
|---------|---------|-----|
| Fond | Noir encre | `#1F1F28` |
| Texte | Crème | `#DCD7BA` |
| Accent | Rose corail | `#E46876` |
| Liens | Cyan | `#7FB4CA` |
| Code | Vert | `#98BB6C` |

## 📦 Structure du projet

```
portfolio-hugo/
├── config.toml              # Configuration Hugo
├── content/
│   ├── posts/               # Articles de blog
│   ├── projects/            # Tes projets
│   ├── about.md             # Page À propos
│   └── graph.md             # Page du graphe
├── assets/css/
│   └── kanagawa.css         # Thème de couleurs
├── static/
│   ├── js/
│   │   └── knowledge-graph.js   # Code du graphe D3.js
│   └── data/
│       └── graph.json       # Données du graphe
├── layouts/shortcodes/
│   ├── knowledge-graph.html # Shortcode graphe complet
│   └── article-graph.html   # Mini-graphe par article
├── themes/
│   └── LoveIt/              # Thème Hugo (submodule)
├── docker-compose.yml       # Hébergement Docker (optionnel)
├── nginx.conf               # Config Nginx (optionnel)
└── deploy.sh                # Script de déploiement
```

## ☁️ Déploiement sur Cloudflare Pages

### Étape 1 : Push sur GitHub

```bash
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TON-USERNAME/TON-REPO.git
git push -u origin main
```

### Étape 2 : Cloudflare Pages

1. Va sur [dash.cloudflare.com](https://dash.cloudflare.com)
2. **Workers & Pages** → **Create** → **Connect to Git**
3. Sélectionne ton repo GitHub
4. **Build settings** :
   - Framework : `Hugo`
   - Build command : `hugo --minify`
   - Output directory : `public`
   - **Variable d'environnement** : `HUGO_VERSION` = `0.139.0`
5. **Save and Deploy**

⏳ Attends 1-2 minutes...

✅ **Ton site est en ligne !** URL : `ton-site.pages.dev`

### Workflow quotidien

```bash
# 1. Fais tes modifications
hugo server -D

# 2. Commit et push
git add .
git commit -m "Nouvel article ETL"
git push

# 3. Cloudflare redéploie automatiquement
```

## 🐳 Hébergement Docker (optionnel)

Pour héberger sur ton NAS ou serveur :

```bash
# Build du site
hugo --minify

# Lance avec Docker Compose
docker-compose up -d

# Accède à http://localhost:8080
```

## 🔧 Commandes utiles

```bash
# Nouveau contenu
hugo new posts/titre.md
hugo new projects/titre.md

# Serveur local (avec brouillons)
hugo server -D

# Build production
hugo --minify

# Nettoyer
rm -rf public/ resources/

# Stats
hugo list all
```

## 📚 Ressources

- [Documentation Hugo](https://gohugo.io/documentation/)
- [Thème LoveIt](https://hugoloveit.com/)
- [D3.js](https://d3js.org/)
- [Cloudflare Pages](https://pages.cloudflare.com/)

## 🤝 Contribution

Ce portfolio est open source ! N'hésite pas à :
- 🐛 Signaler des bugs
- 💡 Proposer des améliorations
- 🔀 Fork et personnaliser pour ton usage

## 📄 Licence

MIT - Tu peux utiliser, modifier et distribuer ce code librement.

## 🙏 Crédits

- Design inspiré de [Simon Späti (ssp.sh)](https://www.ssp.sh/)
- Palette [Kanagawa](https://github.com/rebelot/kanagawa.nvim)
- Thème [LoveIt](https://github.com/dillonzq/LoveIt)

---

**Fait avec ❤️ et Hugo**