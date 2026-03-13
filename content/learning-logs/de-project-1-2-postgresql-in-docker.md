---

title: "🐘 Project 1.2: PostgreSQL in Docker"
date: 2026-01-14
publish: true
description: "Running PostgreSQL in Docker with Python client connection"
tags: ["de-project", "docker", "postgresql", "python", "docker-compose", "january-2026"]
category: learning-log
series: ["DE Learning Projects"]
project_number: "1.2"
month: "January 2026"
github: "https://github.com/BenWaraiotoko/DE-Learning-Projects/tree/main/1-2_PostgreSQL-in-Docker"

---
Running a single container with a Python script is a nice party trick. But the moment you need a database, you're in multi-container territory — and that's where Docker Compose enters the picture.

This project felt like a real step up. I wasn't just packaging a script anymore; I was spinning up actual infrastructure. A Postgres instance, a web UI, and a Python client all talking to each other inside Docker. That's closer to how things actually work in the wild.

## The Goal

Run PostgreSQL in a Docker container, connect to it from Python, and throw in Adminer as a web UI so I can actually see what's going on in the database without writing SELECT queries by hand. Use docker-compose to orchestrate the whole thing.

This is the foundational setup that every data pipeline eventually needs.

## What I Built

A docker-compose setup with:
- PostgreSQL container (the database)
- Adminer container (a lightweight web UI — think phpMyAdmin but not terrible)
- Python script that creates a table and inserts a row

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

- **docker-compose**: You define your whole multi-container setup in a single YAML file, then `docker-compose up -d` handles the rest. It creates a shared network, starts everything in order, and manages volumes. One command. Pretty neat.
- **Named volumes**: This one bit me before I understood it. Without a named volume, your data lives in an anonymous volume that evaporates on `docker-compose down`. With `pgdata:/var/lib/postgresql/data`, it persists. Add this to everything that has a database.
- **Container networking**: Inside the Compose network, containers talk to each other by service name. So Python doesn't connect to `localhost:5432` — it connects to `postgres:5432`. Took me a minute to internalize this.
- **psycopg2**: Python's PostgreSQL adapter. The key thing is parameterized queries with `%s` — never concatenate user input into SQL strings, even in toy projects. Build the habit early.
- **depends_on**: Controls startup order, but it's not a health check. Just because Postgres container started doesn't mean Postgres is *ready*. Which brings me to...

## Challenges

**Challenge:** The Python script threw "connection refused" immediately.
**Solution:** The container was up but PostgreSQL itself wasn't ready yet. Added a simple retry loop as a quick fix. Later I learned about health checks in Compose — `depends_on` with a `condition: service_healthy` — but that's for a later project.

**Challenge:** All my data vanished after `docker-compose down`.
**Solution:** I had forgotten to add a named volume. Anonymous volumes are ephemeral. This is the kind of thing you only learn by losing data once — even test data. Lesson learned.

## Result

```
$ docker-compose up -d
Creating network "1-2_default" with the default driver
Creating 1-2_postgres_1 ... done
Creating 1-2_adminer_1  ... done

$ python insert_data.py
Table created and data inserted!
```

Postgres running in Docker, accessible from Python, data visible in Adminer at `localhost:8080`, and it all survives a container restart. This setup became the base for every project that came after it.

## Related

- [[de-project-1-1-hello-docker]]
- [[postgresql-data-pipeline-setup]]
- [[sql-cheatsheet]]
- [[Python-for-Data-Engineering]]
- [[fundamentals]]

---

**Project:** 1.2 of 28 | **Month:** January | **Hours:** ~5h
**GitHub:** [1-2_PostgreSQL-in-Docker](https://github.com/BenWaraiotoko/DE-Learning-Projects/tree/main/1-2_PostgreSQL-in-Docker)
