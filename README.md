# Portfolio Data Engineer

Portfolio personnel auto-hébergé utilisant Hugo avec le thème LoveIt et la palette Kanagawa.

**Inspiré par [ssp.sh](https://www.ssp.sh)** — Simon Späti's Data Engineering Blog

## 🎨 Design

- **Générateur** : Hugo (GoHugo)
- **Thème** : LoveIt
- **Palette** : Kanagawa (thème sombre japonais)
- **Features** : Graphe interactif D3.js, mode sombre natif

## 🚀 Quick Start

### Installation

```bash
# Cloner le repo
git clone https://github.com/ton-username/portfolio.git
cd portfolio

# Installer le thème
git submodule add https://github.com/dillonzq/LoveIt.git themes/LoveIt

# Lancer en local
hugo server -D
```

Ouvrir http://localhost:1313

### Nouveau contenu

```bash
# Nouvel article
hugo new posts/mon-article.md

# Nouveau projet
hugo new projects/mon-projet.md
```

### Build & Deploy

```bash
# Build
hugo --minify

# Deploy vers NAS
./deploy.sh
```

## 📁 Structure

```
portfolio-hugo/
├── archetypes/          # Templates pour nouveau contenu
├── assets/css/          # CSS personnalisé (Kanagawa)
├── content/
│   ├── posts/           # Articles de blog
│   ├── projects/        # Projets
│   ├── about.md         # Page À propos
│   └── graph.md         # Page graphe interactif
├── layouts/
│   ├── partials/        # Overrides du thème
│   └── shortcodes/      # Shortcodes personnalisés
├── static/
│   ├── images/          # Images
│   ├── js/              # JavaScript (graphe D3)
│   └── data/            # JSON pour le graphe
├── config.toml          # Configuration Hugo
├── docker-compose.yml   # Hébergement Docker
└── deploy.sh            # Script de déploiement
```

## 🎨 Palette Kanagawa

| Couleur | Hex | Usage |
|---------|-----|-------|
| sumiInk | `#1F1F28` | Fond principal |
| fujiWhite | `#DCD7BA` | Texte |
| waveRed | `#E46876` | Accents, titres |
| crystalBlue | `#7FB4CA` | Liens |
| springGreen | `#98BB6C` | Code |
| carpYellow | `#E6C384` | Tags, graphe |

## 📊 Graphe Interactif

Le graphe utilise D3.js pour visualiser les connexions entre compétences et projets.

**Configuration** : Éditer `/static/data/graph.json`

**Usage dans une page** :
```markdown
{{</* knowledge-graph */>}}
```

## 🐳 Hébergement

### Option 1 : Docker (recommandé)

```bash
docker-compose up -d
```

Accessible sur `http://IP:8080`

### Option 2 : Synology Web Station

1. Copier `public/` vers `/volume1/web/portfolio`
2. Configurer un Virtual Host dans Web Station
3. Activer HTTPS via le panneau Synology

## 📝 License

MIT

---

*Fait avec ❤️ et ☕ — En route vers le Data Engineering*
