---
title: "Pipeline ETL avec Python & Airflow"
date: 2025-01-15
draft: false
description: "Un pipeline ETL complet pour extraire, transformer et charger des données depuis une API vers PostgreSQL"
tags: ["python", "etl", "airflow", "postgresql", "data-engineering"]
categories: ["projects"]
featuredImage: "/images/projects/etl-pipeline.png"
---

## 📋 Aperçu du projet

Ce projet démontre la création d'un **pipeline ETL** (Extract, Transform, Load) complet utilisant Python et Apache Airflow pour orchestrer le flux de données.

<div class="intro-block">

**Objectif** : Extraire des données météo depuis une API publique, les transformer en métriques exploitables, et les charger dans une base PostgreSQL pour analyse.

</div>

## 🛠️ Stack technique

| Composant | Technologie |
|-----------|-------------|
| Orchestration | Apache Airflow |
| Langage | Python 3.11 |
| Base de données | PostgreSQL 15 |
| Conteneurisation | Docker Compose |
| Tests | pytest |

## 📁 Structure du projet

```
etl-weather-pipeline/
├── dags/
│   └── weather_etl_dag.py
├── scripts/
│   ├── extract.py
│   ├── transform.py
│   └── load.py
├── tests/
│   └── test_transform.py
├── docker-compose.yml
└── README.md
```

## 💻 Code principal

### DAG Airflow

```python
from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime, timedelta

default_args = {
    'owner': 'benjamin',
    'depends_on_past': False,
    'start_date': datetime(2025, 1, 1),
    'retries': 1,
    'retry_delay': timedelta(minutes=5),
}

with DAG(
    'weather_etl_pipeline',
    default_args=default_args,
    description='ETL pipeline for weather data',
    schedule_interval='@daily',
    catchup=False,
) as dag:

    extract_task = PythonOperator(
        task_id='extract_weather_data',
        python_callable=extract_weather_data,
    )

    transform_task = PythonOperator(
        task_id='transform_weather_data',
        python_callable=transform_weather_data,
    )

    load_task = PythonOperator(
        task_id='load_to_postgres',
        python_callable=load_to_postgres,
    )

    extract_task >> transform_task >> load_task
```

## 📊 Résultats

- **Volume traité** : ~10,000 records/jour
- **Temps d'exécution** : < 2 minutes
- **Fiabilité** : 99.5% uptime sur 30 jours

## 🔗 Liens

- [**Code source sur GitHub**](https://github.com/ton-username/etl-weather-pipeline)
- [Documentation Airflow](https://airflow.apache.org/docs/)

---

*Projet réalisé dans le cadre de ma formation Data Engineering.*
