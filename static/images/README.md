# 📁 Dossier Images du Portfolio

Ce dossier contient toutes les images de votre site Hugo.

## 📂 Structure recommandée

```
static/images/
├── avatar.jpg              # Photo de profil (page d'accueil)
├── logo.png                # Logo du site (header)
├── posts/                  # Images pour les articles de blog
│   ├── post-1/
│   │   ├── cover.jpg       # Image de couverture
│   │   └── diagram.png     # Images dans l'article
│   └── post-2/
│       └── cover.jpg
├── projects/               # Images pour les projets
│   ├── etl-pipeline/
│   │   ├── cover.jpg
│   │   └── architecture.png
│   └── project-2/
└── favicon/                # Favicons (optionnel)
    ├── favicon.ico
    ├── favicon-16x16.png
    └── favicon-32x32.png
```

## 🖼️ Images requises actuellement dans config.toml

### 1. Avatar (Photo de profil)
- **Chemin**: `/images/avatar.jpg`
- **Recommandation**: 400x400px, format JPG ou PNG
- **Utilisé dans**: Page d'accueil, profil

### 2. Logo (Header)
- **Chemin**: `/images/logo.png`
- **Recommandation**: 64x64px ou 128x128px, fond transparent
- **Utilisé dans**: Header du site (en haut à gauche)

## 📝 Comment ajouter des images

### Méthode 1 : Via Finder (Mac)

1. Ouvrez le Finder
2. Naviguez vers : `Documents/GitHub/Bwo_Portfolio/static/images/`
3. Glissez-déposez vos images dans ce dossier
4. Renommez-les selon les noms attendus

### Méthode 2 : Via Terminal

```bash
# Aller dans le dossier du projet
cd ~/Documents/GitHub/Bwo_Portfolio

# Copier une image depuis Téléchargements
cp ~/Downloads/ma-photo.jpg static/images/avatar.jpg
cp ~/Downloads/mon-logo.png static/images/logo.png
```

### Méthode 3 : Via VS Code

1. Ouvrez VS Code dans votre projet
2. Dans l'explorateur de fichiers (à gauche)
3. Clic droit sur `static/images/` → New File
4. Ou glissez-déposez depuis votre Finder

## 🔗 Référencer les images

### Dans config.toml

```toml
# Avatar
[params.home.profile]
  avatarURL = "/images/avatar.jpg"

# Logo header
[params.header.title]
  logo = "/images/logo.png"

# Image par défaut pour partage social
[params]
  images = ["/images/avatar.jpg"]
```

### Dans un article Markdown

```markdown
---
title: "Mon article"
featuredImage: "/images/posts/mon-article/cover.jpg"
---

Texte de l'article...

![Description de l'image](/images/posts/mon-article/diagram.png)
```

### Dans les projets

```markdown
---
title: "Pipeline ETL"
featuredImage: "/images/projects/etl-pipeline/cover.jpg"
---

![Architecture](/images/projects/etl-pipeline/architecture.png)
```

## ⚙️ Formats recommandés

| Type d'image | Format | Taille max | Recommandation |
|--------------|--------|------------|----------------|
| Avatar | JPG/PNG | 500 Ko | 400x400px, optimisé |
| Logo | PNG | 100 Ko | 128x128px, fond transparent |
| Cover articles | JPG | 1 Mo | 1200x630px (ratio 16:9) |
| Screenshots | PNG | 2 Mo | Largeur max 1920px |
| Diagrammes | PNG/SVG | 500 Ko | Vectoriel si possible |

## 🎨 Optimisation des images

Avant d'uploader, optimisez vos images :

### Sur Mac (gratuit)

**ImageOptim** (recommandé)
```bash
brew install --cask imageoptim
```

**Ou en ligne de commande avec Hugo**
```bash
# Hugo optimise automatiquement les images si elles sont dans assets/
# Mais pour static/, optimisez avant
```

### En ligne (gratuit)

- [TinyPNG](https://tinypng.com/) - Compression PNG/JPG
- [Squoosh](https://squoosh.app/) - Par Google
- [Compressor.io](https://compressor.io/)

## 🚀 Workflow recommandé

1. **Préparez vos images** (optimisez, renommez)
2. **Ajoutez-les dans `static/images/`**
3. **Commitez sur Git**
   ```bash
   git add static/images/
   git commit -m "Add avatar and logo images"
   git push
   ```
4. **Cloudflare déploie automatiquement** (1-2 min)

## ❓ FAQ

**Q: Pourquoi `/images/` et pas `images/` ?**
R: Le `/` au début signifie "depuis la racine du site". Hugo sert tout ce qui est dans `static/` à la racine.

**Q: Mes images n'apparaissent pas ?**
R: Vérifiez :
- Le chemin commence par `/images/`
- Le fichier existe bien dans `static/images/`
- Le nom du fichier correspond exactement (sensible à la casse)
- Vous avez push sur GitHub et Cloudflare a redéployé

**Q: Puis-je utiliser des images hébergées ailleurs ?**
R: Oui, utilisez l'URL complète : `https://example.com/image.jpg`

**Q: Comment ajouter un favicon ?**
R: Ajoutez `favicon.ico` dans `static/` (pas dans images/)
