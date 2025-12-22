---
title: "Ma formation Data Engineer avec Codecademy"
date: 2025-01-15
tags: ["codecademy", "python", "sql", "data-engineering"]
categories: ["Formation"]
draft: false
---

## 🚀 Pourquoi Data Engineer ?

Après plusieurs années dans un autre domaine, j'ai décidé de me reconvertir dans la data engineering. C'est un domaine qui me passionne car il combine :

- **Programmation** : Python, SQL
- **Architecture** : Conception de pipelines robustes
- **Impact** : Permettre aux organisations de prendre de meilleures décisions

## 📚 Mon parcours Codecademy

J'ai choisi Codecademy pour sa structure progressive et ses projets pratiques. Voici ce que je suis en train d'apprendre :

### 1. Fondamentaux Python
```python
# Exemple simple de manipulation de données
import pandas as pd

df = pd.read_csv('data.csv')
cleaned_df = df.dropna().reset_index(drop=True)
print(cleaned_df.head())
```

### 2. SQL et bases de données
```sql
-- Requête pour analyser les ventes par catégorie
SELECT 
    category,
    SUM(amount) as total_sales,
    COUNT(*) as num_transactions
FROM sales
GROUP BY category
ORDER BY total_sales DESC;
```

### 3. ETL et pipelines

Je commence à comprendre l'architecture des pipelines ETL :
- **Extract** : Récupération depuis diverses sources (APIs, bases, fichiers)
- **Transform** : Nettoyage, agrégation, enrichissement
- **Load** : Chargement dans un data warehouse

## 🎯 Mes objectifs

1. ✅ Maîtriser Python et SQL (en cours)
2. ⏳ Créer mon premier pipeline ETL end-to-end
3. ⏳ Apprendre Docker et Airflow
4. ⏳ Contribuer à des projets open source
5. ⏳ Décrocher mon premier poste Data Engineer

## 🔗 Concepts liés

{{< article-graph >}}

## 📈 Prochaines étapes

Dans les prochaines semaines, je vais :
- Terminer le module SQL avancé
- Commencer le projet capstone ETL
- Documenter mes apprentissages sur ce blog

> **Note** : Ce blog est aussi un projet en soi ! J'ai créé ce portfolio avec Hugo, hébergé gratuitement sur Cloudflare Pages. C'est un excellent exercice pour pratiquer Git, le déploiement continu, et la documentation technique.

---

*Dernière mise à jour : 15 janvier 2025*