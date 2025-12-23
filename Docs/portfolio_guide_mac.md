# Guide Portfolio Hugo - Mac ARM (M1/M2/M3/M4)

## 🎯 Ce que tu vas créer

Un portfolio personnel style [ssp.sh](https://www.ssp.sh/) avec :
- ✅ Design minimaliste Kanagawa (noir + rose corail + cyan)
- ✅ Graphe interactif de tes compétences/projets
- ✅ Blog pour documenter ton parcours Data Engineer
- ✅ Hébergement **gratuit** sur Cloudflare Pages
- ✅ Mise à jour simple : tu écris en Markdown, tu push, c'est en ligne

---

## 📋 Prérequis (30 min)

### Étape 1 : Installer Homebrew (gestionnaire de paquets Mac)

Ouvre **Terminal.app** et colle cette commande :

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**IMPORTANT pour Mac ARM** : Après l'installation, ajoute Homebrew au PATH :

```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

Vérifie que ça marche :

```bash
brew --version
# Tu devrais voir : Homebrew 4.x.x
```

### Étape 2 : Installer Git et Hugo Extended

```bash
brew install git hugo
```

Vérifie les versions :

```bash
git --version   # git version 2.x.x
hugo version    # hugo v0.1xx.x+extended
```

⚠️ **Important** : Tu dois voir le mot `extended` dans la version de Hugo.

### Étape 3 : Configurer Git (première fois uniquement)

```bash
git config --global user.name "BenWaraiOtoko"
git config --global user.email "ton-email@exemple.com"
```

---

## 🚀 Création du site (20 min)

### Étape 4 : Extraire le projet

1. Télécharge `portfolio-hugo.zip` (fourni séparément)
2. Double-clique dessus pour l'extraire
3. Déplace le dossier `portfolio-hugo` dans ton dossier utilisateur

Dans le Terminal :

```bash
cd ~/portfolio-hugo
```

### Étape 5 : Installer le thème LoveIt

```bash
# Initialise Git
git init

# Ajoute le thème comme sous-module
git submodule add https://github.com/dillonzq/LoveIt.git themes/LoveIt
git submodule update --init --recursive
```

### Étape 6 : Tester en local

```bash
hugo server -D
```

Tu devrais voir :

```
Web Server is available at http://localhost:1313/
```

Ouvre **Safari** ou **Chrome** et va sur `http://localhost:1313`

**🎉 Ton site fonctionne !** (appuie sur `Ctrl+C` dans le Terminal pour arrêter)

---

## ✏️ Personnalisation rapide

### Modifier tes infos personnelles

Ouvre le fichier `config.toml` avec **TextEdit** ou **VS Code** :

```bash
open -a TextEdit config.toml
```

Change ces lignes :

```toml
title = "Benjamin - Data Engineer"          # Ton nom
baseURL = "https://ton-nom.pages.dev/"      # Tu changeras après

[params]
  author = "Benjamin"
  description = "Portfolio d'un Data Engineer en formation"
  keywords = ["Data Engineering", "Python", "SQL", "ETL"]
```

### Ajouter ton premier article

```bash
hugo new posts/mon-premier-post.md
```

Édite le fichier créé :

```bash
open -a TextEdit content/posts/mon-premier-post.md
```

Exemple de contenu :

```markdown
---
title: "Ma formation Data Engineer"
date: 2025-01-15
tags: ["codecademy", "python", "sql"]
---

Je me lance dans la data engineering avec Codecademy...

{{< knowledge-graph >}}
```

Sauvegarde et recharge `http://localhost:1313` pour voir le résultat.

---

## ☁️ Hébergement gratuit sur Cloudflare Pages

### Étape 7 : Créer un compte GitHub

1. Va sur [github.com](https://github.com)
2. Clique sur **Sign up** (gratuit)
3. Vérifie ton email

### Étape 8 : Créer le dépôt GitHub

1. Sur GitHub, clique sur le **+** en haut à droite → **New repository**
2. Nom : `portfolio` (ou ce que tu veux)
3. **Laisse tout en Public**
4. **NE COCHE PAS** "Add a README"
5. Clique sur **Create repository**

GitHub te donne des commandes. **NE LES COPIE PAS ENCORE.**

### Étape 9 : Pousser ton code

Dans ton Terminal (dans le dossier `portfolio-hugo`) :

```bash
# Ajoute tous les fichiers
git add .

# Premier commit
git commit -m "Initial commit - Portfolio Hugo Kanagawa"

# Renomme la branche
git branch -M main

# Connecte à GitHub (remplace TON-USERNAME et TON-REPO)
git remote add origin https://github.com/TON-USERNAME/TON-REPO.git

# Envoie le code
git push -u origin main
```

**Si GitHub demande un mot de passe** : Utilise un [Personal Access Token](https://github.com/settings/tokens) au lieu du mot de passe.

✅ Recharge la page GitHub, tu devrais voir tes fichiers !

### Étape 10 : Déployer sur Cloudflare Pages

1. Va sur [dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up)
2. Crée un compte (gratuit)
3. Clique sur **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**
4. Clique sur **Connect GitHub** et autorise Cloudflare
5. Sélectionne ton repo `portfolio`
6. **Build settings** :
   - Framework preset : `Hugo`
   - Build command : `hugo --minify`
   - Build output directory : `public`
   - **Ajoute une variable d'environnement** :
     - `HUGO_VERSION` = `0.153.1`
7. Clique sur **Save and Deploy**

⏳ Attends 1-2 minutes...

**🎉 C'EST EN LIGNE !** Cloudflare te donne une URL : `ton-site.pages.dev`

---

## 🔄 Workflow quotidien

Quand tu modifies ton site :

```bash
# 1. Teste en local
hugo server -D

# 2. Si c'est bon, sauvegarde sur GitHub
git add .
git commit -m "Ajout nouvel article sur les ETL"
git push

# 3. Cloudflare redéploie automatiquement (1-2 min)
```

---

## 📝 Actions courantes

### Ajouter un projet

```bash
hugo new projects/etl-pipeline.md
```

Contenu exemple :

```markdown
---
title: "Pipeline ETL pour données météo"
date: 2025-01-20
tags: ["python", "pandas", "postgresql"]
github: "https://github.com/ton-user/meteo-etl"
---

Description de ton projet...

## Stack technique
- Python 3.11
- Pandas
- PostgreSQL
```

### Ajouter une page

```bash
hugo new about.md
```

### Changer les couleurs Kanagawa

Édite `assets/css/kanagawa.css` :

```css
:root {
  --bg-main: #1F1F28;        /* Fond noir encre */
  --text-primary: #DCD7BA;   /* Texte crème */
  --accent-primary: #E46876; /* Rose corail */
  --accent-secondary: #7FB4CA; /* Cyan liens */
}
```

---

## 🆘 Problèmes courants

**"hugo: command not found"**
→ Relance le Terminal et vérifie : `brew list hugo`

**"Permission denied" lors du git push**
→ Utilise un [Personal Access Token GitHub](https://github.com/settings/tokens)

**Le graphe ne s'affiche pas**
→ Vérifie que tu as bien `{{< knowledge-graph >}}` dans ton Markdown

**Les couleurs ne s'appliquent pas**
→ Vide le cache : `rm -rf public/ && hugo server -D`

---

## 🎓 Ressources

- [Documentation Hugo](https://gohugo.io/documentation/)
- [Thème LoveIt](https://hugoloveit.com/)
- [Markdown Guide](https://www.markdownguide.org/)
- [Codecademy Data Engineer](https://www.codecademy.com/learn/paths/data-engineer)

---

## 📦 Fichiers importants

```
portfolio-hugo/
├── config.toml              # Config principale
├── content/
│   ├── posts/               # Articles de blog
│   ├── projects/            # Tes projets
│   └── about.md             # Page À propos
├── assets/css/
│   └── kanagawa.css         # Ton thème de couleurs
├── static/
│   ├── js/knowledge-graph.js   # Code du graphe
│   └── data/graph.json         # Données du graphe
└── layouts/shortcodes/
    ├── knowledge-graph.html    # Graphe complet
    └── article-graph.html      # Mini-graphe par article
```

---

## 🎯 Prochaines étapes

1. ✅ Termine ce guide
2. ✅ Personnalise `config.toml`
3. ✅ Écris ton premier article
4. ✅ Ajoute un projet Codecademy
5. ✅ Pousse sur GitHub
6. ✅ Connecte Cloudflare Pages
7. 🚀 Partage ton portfolio !

**Bonne chance avec ta formation Data Engineer !** 🐍📊