# 🚀 Guide Rapide : Ajouter vos images

## 🎯 Les 2 images essentielles pour commencer

### 1️⃣ Avatar (Photo de profil)

**Où ?** `static/images/avatar.jpg`

**Comment ?**
```bash
# Option A : Depuis le Finder
# 1. Ouvrez le Finder
# 2. Allez dans Documents/GitHub/Bwo_Portfolio/static/images/
# 3. Glissez votre photo et renommez-la en "avatar.jpg"

# Option B : En ligne de commande
cd ~/Documents/GitHub/Bwo_Portfolio
cp ~/Downloads/ma-photo.jpg static/images/avatar.jpg
```

**Caractéristiques recommandées :**
- Format : JPG ou PNG
- Taille : 400x400 pixels (carré)
- Poids : < 500 Ko
- Style : Photo de profil professionnelle

---

### 2️⃣ Logo (Header du site)

**Où ?** `static/images/logo.png`

**Comment ?**
```bash
cd ~/Documents/GitHub/Bwo_Portfolio
cp ~/Downloads/mon-logo.png static/images/logo.png
```

**Caractéristiques recommandées :**
- Format : PNG (avec transparence)
- Taille : 64x64 ou 128x128 pixels
- Poids : < 100 Ko
- Style : Simple, lisible en petit

---

## 📸 Ajouter une image à un article de blog

### Exemple : Article "Pourquoi Data Engineer"

**Étape 1 : Créez le dossier de l'article**
```bash
mkdir -p static/images/posts/pourquoi-data-engineer
```

**Étape 2 : Ajoutez votre image**
```bash
cp ~/Downloads/cover.jpg static/images/posts/pourquoi-data-engineer/cover.jpg
```

**Étape 3 : Référencez dans l'article**

Éditez `content/posts/pourquoi-data-engineer.md` :

```markdown
---
title: "Pourquoi j'ai choisi de devenir Data Engineer"
featuredImage: "/images/posts/pourquoi-data-engineer/cover.jpg"
---

Mon parcours...

![Diagramme ETL](/images/posts/pourquoi-data-engineer/etl-diagram.png)
```

---

## 🛠️ Ajouter une image à un projet

### Exemple : Projet "ETL Pipeline"

**Étape 1 : Créez le dossier du projet**
```bash
mkdir -p static/images/projects/etl-pipeline
```

**Étape 2 : Ajoutez vos images**
```bash
cp ~/Downloads/architecture.png static/images/projects/etl-pipeline/architecture.png
cp ~/Downloads/cover.jpg static/images/projects/etl-pipeline/cover.jpg
```

**Étape 3 : Référencez dans le projet**

Éditez `content/projects/etl-pipeline.md` :

```markdown
---
title: "Pipeline ETL Météo"
featuredImage: "/images/projects/etl-pipeline/cover.jpg"
---

## Architecture

![Architecture du pipeline](/images/projects/etl-pipeline/architecture.png)
```

---

## ✅ Checklist après ajout d'images

- [ ] L'image est dans `static/images/`
- [ ] Le chemin commence par `/images/` (avec le slash)
- [ ] Le nom du fichier est en minuscules (recommandé)
- [ ] L'image est optimisée (< 1 Mo)
- [ ] Testez en local : `hugo server -D`
- [ ] Committez et pushez :
  ```bash
  git add static/images/
  git commit -m "Add images for blog posts"
  git push
  ```
- [ ] Attendez 2 min que Cloudflare redéploie

---

## 🎨 Créer un avatar rapidement (si vous n'en avez pas)

### Option 1 : Avatar généré (gratuit)

**Dicebear** (avatars aléatoires)
```
https://api.dicebear.com/7.x/avataaars/svg?seed=BenWaraiotoko
```

### Option 2 : Initiales stylées

**UI Avatars** (initiales)
```
https://ui-avatars.com/api/?name=Ben+Warai&size=400&background=E46876&color=1F1F28
```

Téléchargez l'image puis renommez-la en `avatar.jpg`

### Option 3 : Vos propres photos

1. Utilisez une photo de profil LinkedIn/GitHub
2. Recadrez en carré (400x400)
3. Optimisez avec [TinyPNG](https://tinypng.com)

---

## 🔧 Outils utiles Mac

### Redimensionner une image (Terminal)

```bash
# Installer ImageMagick
brew install imagemagick

# Redimensionner
convert input.jpg -resize 400x400^ -gravity center -extent 400x400 avatar.jpg
```

### Créer un logo simple (si vous n'en avez pas)

**Favicon Generator** : https://favicon.io/favicon-generator/
- Tapez vos initiales : "BW" ou "DE"
- Couleur fond : `#1F1F28` (noir Kanagawa)
- Couleur texte : `#E46876` (rose Kanagawa)
- Téléchargez et utilisez le PNG 512x512

---

## 🚨 Problèmes courants

**❌ L'image n'apparaît pas**
```
Vérifiez :
1. Le chemin : /images/avatar.jpg (pas images/avatar.jpg)
2. Le fichier existe : ls static/images/avatar.jpg
3. Git track : git status
4. Cloudflare a rebuild (2 min après push)
```

**❌ Image trop lourde**
```bash
# Compresser avec ImageOptim (GUI)
brew install --cask imageoptim

# Ou en ligne sur tinypng.com
```

**❌ Image ne s'affiche qu'en local**
```bash
# Vous avez oublié de push !
git add static/images/
git commit -m "Add images"
git push
```

---

## 📱 Raccourcis utiles

### Ouvrir le dossier images dans Finder
```bash
cd ~/Documents/GitHub/Bwo_Portfolio
open static/images/
```

### Vérifier les images présentes
```bash
ls -lh static/images/
```

### Voir la taille des images
```bash
du -sh static/images/*
```
