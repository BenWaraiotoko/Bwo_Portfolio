---
title: "🐘 Project 1.2: PostgreSQL in Docker"
date: 2026-01-14
draft: false
description: "Running PostgreSQL in Docker with Python client connection"
tags: ["de-project", "docker", "postgresql", "python", "docker-compose", "january-2026"]
categories: ["Learning Logs"]
series: ["DE Learning Projects"]
project_number: "1.2"
month: "January 2026"
github: "https://github.com/BenWaraiotoko/DE-Learning-Projects/tree/main/1-2_PostgreSQL-in-Docker"
---

## The Goal

Run PostgreSQL in a Docker container and connect to it from Python. Add Adminer for a web UI. Use docker-compose to orchestrate multiple containers.

This is the foundation for every data pipeline: a database running in a container.

## What I Built

A docker-compose setup with:
- PostgreSQL container (database)
- Adminer container (web UI for database management)
- Python script that creates tables and inserts data

### Tech Stack

- **Docker Compose** — Multi-container orchestration
- **PostgreSQL** — Relational database
- **Adminer** — Lightweight database web UI
- **Python + psycopg2** — Database client library

## Implementation

### docker-compose.yml

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: dev
      POSTGRES_PASSWORD: devpass
      POSTGRES_DB: learning
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  adminer:
    image: adminer
    ports:
      - "8080:8080"
    depends_on:
      - postgres

volumes:
  pgdata:
```

### Python Connection Script

```python
import psycopg2

conn = psycopg2.connect(
    host="localhost",
    database="learning",
    user="dev",
    password="devpass"
)

cursor = conn.cursor()

# Create table
cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100)
    )
""")

# Insert data
cursor.execute(
    "INSERT INTO users (name, email) VALUES (%s, %s)",
    ("Ben", "ben@example.com")
)

conn.commit()
print("Table created and data inserted!")

cursor.close()
conn.close()
```

### Usage

```bash
# Start containers
docker-compose up -d

# Run Python script
python insert_data.py

# Access Adminer at http://localhost:8080
# Server: postgres, User: dev, Password: devpass, Database: learning
```

## What I Learned

- **docker-compose**: Define multi-container apps in YAML
- **Named volumes**: Data persists even when container stops (`pgdata:/var/lib/postgresql/data`)
- **Container networking**: Services can reference each other by name (`postgres` not `localhost`)
- **psycopg2**: Python's PostgreSQL adapter—parameterized queries prevent SQL injection
- **depends_on**: Control container startup order

## Challenges

**Challenge:** Python script couldn't connect—"connection refused."
**Solution:** Containers weren't ready yet. Added a simple retry loop. Later learned about `depends_on` with health checks.

**Challenge:** Data disappeared after `docker-compose down`.
**Solution:** Needed named volumes. Without them, data lives in anonymous volumes that get deleted.

## Result

PostgreSQL running in Docker, accessible from Python and Adminer. Data persists across restarts. ✅

```
$ docker-compose up -d
Creating network "1-2_default" with the default driver
Creating 1-2_postgres_1 ... done
Creating 1-2_adminer_1  ... done

$ python insert_data.py
Table created and data inserted!
```

Now I have a reusable database setup for all future projects.

---

**Project:** 1.2 of 28 | **Month:** January | **Hours:** ~5h
**GitHub:** [1-2_PostgreSQL-in-Docker](https://github.com/BenWaraiotoko/DE-Learning-Projects/tree/main/1-2_PostgreSQL-in-Docker)
