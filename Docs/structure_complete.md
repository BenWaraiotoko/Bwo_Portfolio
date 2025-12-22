# Structure complète du projet Portfolio + Sublime Theme

## 📁 Projet Portfolio Hugo

Crée cette structure de dossiers et fichiers :

```
portfolio-hugo/
│
├── config.toml                      # Configuration principale Hugo
│
├── content/                         # Contenu du site
│   ├── about.md                     # Page À propos
│   ├── graph.md                     # Page du graphe de compétences
│   ├── posts/                       # Articles de blog
│   │   └── premier-post.md          # Exemple d'article
│   └── projects/                    # Tes projets
│       └── etl-meteo.md             # Exemple de projet
│
├── assets/                          # Assets (CSS, images)
│   └── css/
│       └── kanagawa.css             # Thème de couleurs Kanagawa
│
├── static/                          # Fichiers statiques
│   ├── js/
│   │   └── knowledge-graph.js       # Code du graphe D3.js
│   └── data/
│       └── graph.json               # Données du graphe
│
├── layouts/                         # Templates Hugo
│   └── shortcodes/
│       ├── knowledge-graph.html     # Shortcode graphe complet
│       └── article-graph.html       # Mini-graphe par article
│
├── themes/                          # Thèmes (sous-module Git)
│   └── LoveIt/                      # À installer via git submodule
│
├── docker-compose.yml               # Pour hébergement Docker (optionnel)
├── nginx.conf                       # Config Nginx (optionnel)
├── deploy.sh                        # Script de déploiement
├── README.md                        # Documentation du projet
└── GUIDE-DEBUTANT.md                # Guide pas-à-pas Mac ARM
```

## 📁 Thème Sublime Text

Crée cette structure :

```
Kanagawa-SublimeText/
│
├── Kanagawa.sublime-color-scheme    # Coloration syntaxique
├── Kanagawa.sublime-theme           # Thème UI
└── README.md                        # Guide d'installation
```

## 🚀 Commandes pour créer la structure

### 1. Portfolio Hugo

```bash
# Crée le dossier principal
mkdir -p ~/portfolio-hugo
cd ~/portfolio-hugo

# Crée la structure de dossiers
mkdir -p content/posts content/projects
mkdir -p assets/css
mkdir -p static/js static/data
mkdir -p layouts/shortcodes
mkdir -p themes

# Crée les fichiers vides (tu les rempliras après)
touch config.toml
touch content/about.md
touch content/graph.md
touch content/posts/premier-post.md
touch content/projects/etl-meteo.md
touch assets/css/kanagawa.css
touch static/js/knowledge-graph.js
touch static/data/graph.json
touch layouts/shortcodes/knowledge-graph.html
touch layouts/shortcodes/article-graph.html
touch docker-compose.yml
touch nginx.conf
touch deploy.sh
touch README.md
touch GUIDE-DEBUTANT.md

# Rend le script de déploiement exécutable
chmod +x deploy.sh
```

### 2. Thème Sublime Text

```bash
# Crée le dossier
mkdir -p ~/Kanagawa-SublimeText
cd ~/Kanagawa-SublimeText

# Crée les fichiers
touch Kanagawa.sublime-color-scheme
touch Kanagawa.sublime-theme
touch README.md
```

## 📝 Ordre de remplissage des fichiers

### Étape 1 : Configuration de base

1. **config.toml** : Configuration Hugo principale
2. **README.md** (portfolio) : Documentation du projet

### Étape 2 : Design et apparence

3. **assets/css/kanagawa.css** : Toutes les couleurs et styles
4. **layouts/shortcodes/knowledge-graph.html** : Shortcode du graphe
5. **layouts/shortcodes/article-graph.html** : Mini-graphe par article

### Étape 3 : Graphe interactif

6. **static/js/knowledge-graph.js** : Code D3.js du graphe
7. **static/data/graph.json** : Données du graphe (nœuds et liens)

### Étape 4 : Contenu

8. **content/about.md** : Page À propos
9. **content/graph.md** : Page du graphe de compétences
10. **content/posts/premier-post.md** : Premier article de blog
11. **content/projects/etl-meteo.md** : Premier projet

### Étape 5 : Déploiement (optionnel)

12. **docker-compose.yml** : Si tu veux héberger sur NAS/serveur
13. **nginx.conf** : Configuration Nginx
14. **deploy.sh** : Script de déploiement automatisé

### Étape 6 : Guide

15. **GUIDE-DEBUTANT.md** : Guide pas-à-pas complet

### Étape 7 : Thème Sublime Text

16. **Kanagawa.sublime-color-scheme** : Coloration syntaxique
17. **Kanagawa.sublime-theme** : Interface utilisateur
18. **README.md** (Sublime) : Guide d'installation

## ✅ Checklist de mise en place

### Portfolio Hugo

- [x] Créer la structure de dossiers
- [x] Copier tous les fichiers depuis les artifacts
- [ ] Installer Hugo Extended : `brew install hugo`
- [ ] Installer le thème LoveIt : `git submodule add https://github.com/dillonzq/LoveIt.git themes/LoveIt`
- [ ] Tester en local : `hugo server -D`
- [ ] Personnaliser `config.toml` avec tes infos
- [ ] Créer un repo GitHub
- [ ] Push le code : `git push origin main`
- [ ] Configurer Cloudflare Pages
- [ ] Vérifier que le site est en ligne

### Thème Sublime Text

- [ ] Créer le dossier Kanagawa
- [ ] Copier les fichiers .sublime-color-scheme et .sublime-theme
- [ ] Copier dans `~/Library/Application Support/Sublime Text/Packages/Kanagawa/`
- [ ] Activer le thème dans Sublime Text
- [ ] Installer JetBrains Mono : `brew install --cask font-jetbrains-mono`
- [ ] Configurer la police dans les settings

## 🎯 Prochaines étapes

1. **Aujourd'hui** : Crée la structure et copie les fichiers de base
2. **Demain** : Teste en local, personnalise tes infos
3. **Cette semaine** : Push sur GitHub, configure Cloudflare Pages
4. **Ce mois-ci** : Écris ton premier article de blog sur ta formation

## 💡 Conseils

- **Ne te précipite pas** : Prends le temps de comprendre chaque fichier
- **Teste régulièrement** : Lance `hugo server -D` après chaque modification
- **Commit souvent** : Fais des petits commits avec des messages clairs
- **Documente** : Ajoute des notes dans ton blog sur ce que tu apprends
- **Sauvegarde** : GitHub est ta sauvegarde principale, mais garde aussi une copie locale

## 🆘 Si tu es perdu

1. **Commence par le guide** : Lis `GUIDE-DEBUTANT.md` en entier
2. **Suit l'ordre** : Ne saute pas d'étapes
3. **Teste à chaque étape** : Vérifie que ça fonctionne avant de continuer
4. **Lis les erreurs** : Les messages d'erreur de Hugo sont très explicites
5. **Google est ton ami** : "Hugo [ton problème]" trouve souvent la solution

## 📚 Ressources utiles

- [Documentation Hugo](https://gohugo.io/documentation/)
- [Guide Markdown](https://www.markdownguide.org/)
- [D3.js Gallery](https://observablehq.com/@d3/gallery)
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)

---

**Bon courage Benjamin ! Tu vas y arriver ! 🚀**