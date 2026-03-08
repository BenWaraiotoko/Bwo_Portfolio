---

title: "📂 Project 1.3: Data Loader Script"
date: 2026-01-21
publish: true
description: "Python script to load CSV data into PostgreSQL with Docker"
tags: ["de-project", "python", "postgresql", "pandas", "docker", "csv", "january-2026"]
category: learning-log
series: ["DE Learning Projects"]
project_number: "1.3"
month: "January 2026"
github: "https://github.com/BenWaraiotoko/DE-Learning-Projects/tree/main/1-3_Data-Loader-Script"

---
## The Goal

Build a Python script that reads a CSV file, cleans the data, and loads it into a PostgreSQL table. Run everything in Docker so the pipeline is reproducible.

Building on Project 1.2's database setup, this adds the data ingestion layer.

## What I Built

A containerized CSV-to-PostgreSQL loader with:
- Python script that reads, cleans, and inserts data
- PostgreSQL container with auto-initialized schema
- Docker Compose orchestrating both services

### Tech Stack

- **Python + pandas** — CSV reading and data cleaning
- **psycopg2** — PostgreSQL database adapter
- **python-dotenv** — Environment-based configuration
- **Docker Compose** — Multi-container orchestration
- **PostgreSQL** — Target database

## Implementation

### docker-compose.yml

```yaml
version: '3.8'
services:
  db:
    image: postgres:latest
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
  loader:
    build: .
    env_file: .env
    depends_on:
      - db
volumes:
  postgres_data:
```

### init.sql

```sql
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    age INT,
    city VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Dockerfile

```dockerfile
FROM python:3.10

COPY . /app
WORKDIR /app
RUN pip install -r requirements.txt

COPY .env ./

CMD ["python", "loader.py"]
```

### loader.py

```python
import pandas as pd
import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def read_csv(file_path):
    try:
        df = pd.read_csv(file_path)
        return df
    except Exception as e:
        print(f"Error reading CSV file: {e}")
        return None

def clean_data(df):
    df = df.dropna()
    df.columns = df.columns.str.lower()
    df['name'] = df['name'].str.strip()
    df['email'] = df['email'].str.strip()
    df['age'] = df['age'].fillna(0)
    return df

def insert_data(df):
    try:
        conn = psycopg2.connect(
            dbname=os.getenv("POSTGRES_DB"),
            user=os.getenv("POSTGRES_USER"),
            password=os.getenv("POSTGRES_PASSWORD"),
            host="db",
            port="5432"
        )
        cursor = conn.cursor()

        for index, row in df.iterrows():
            cursor.execute(
                "INSERT INTO users (name, email, age, city) VALUES (%s, %s, %s, %s)",
                (row['name'], row['email'], row['age'], row['city'])
            )

        cursor.execute("SELECT * FROM users;")
        rows = cursor.fetchall()
        for row in rows:
            print(row)

        conn.commit()
        cursor.close()
        conn.close()
        print("Data inserted successfully!")
    except Exception as e:
        print(f"Error inserting data: {e}")

def main():
    df = read_csv('sample_data.csv')
    if df is not None:
        df = clean_data(df)
        insert_data(df)

if __name__ == "__main__":
    main()
```

### Sample Data (sample_data.csv)

```csv
name,email,age,city
Alice Johnson,alice@example.com,28,Paris
Bob Smith,bob@example.com,35,Lyon
Carol White,  carol@example.com  ,31,Marseille
David Brown,david@example.com,42,Toulouse
Emma Wilson,emma@example.com,26,Bordeaux
Frank Miller,frank@example.com,39,Nice
```

### Usage

```bash
# Start the database and run the loader
docker-compose up -d

# Check the loader output
docker-compose logs loader

# Or run the loader manually
docker-compose exec loader python loader.py
```

## What I Learned

- **pandas for cleaning**: `str.strip()` removes whitespace, `fillna()` handles missing values, `dropna()` removes incomplete rows
- **init.sql with Docker**: Mounting SQL files to `/docker-entrypoint-initdb.d/` auto-runs them on first container start
- **Environment variables**: `.env` file + `python-dotenv` keeps credentials out of code, `env_file` in Compose passes them to containers
- **Container hostnames**: The loader connects to `db` (the service name), not `localhost`—Docker Compose creates a shared network
- **Parameterized queries**: Using `%s` placeholders with psycopg2 prevents SQL injection

## Challenges

**Challenge:** The loader container started before PostgreSQL was ready to accept connections.
**Solution:** `depends_on` only waits for the container to start, not for the service to be ready. Needed to handle connection retries or add a healthcheck.

**Challenge:** Carol White's email had extra whitespace in the CSV (`  carol@example.com  `).
**Solution:** Added `str.strip()` to the cleaning step. This is why data cleaning matters—raw data is rarely clean.

**Challenge:** Credentials were hardcoded at first.
**Solution:** Moved to `.env` file with `python-dotenv`. The `.env` file is in `.gitignore` so secrets don't end up in the repo.

## Result

A working CSV-to-PostgreSQL data loader running entirely in Docker. Data is cleaned and inserted with a single `docker-compose up`.

```
$ docker-compose up -d
Creating 1-3_db_1     ... done
Creating 1-3_loader_1 ... done

$ docker-compose logs loader
(1, 'Alice Johnson', 'alice@example.com', 28, 'Paris', ...)
(2, 'Bob Smith', 'bob@example.com', 35, 'Lyon', ...)
(3, 'Carol White', 'carol@example.com', 31, 'Marseille', ...)
(4, 'David Brown', 'david@example.com', 42, 'Toulouse', ...)
(5, 'Emma Wilson', 'emma@example.com', 26, 'Bordeaux', ...)
(6, 'Frank Miller', 'frank@example.com', 39, 'Nice', ...)
Data inserted successfully!
```

CSV data cleaned and loaded into PostgreSQL, all containerized. ✅

## Related

- [[de-project-1-2-postgresql-in-docker]]
- [[de-project-1-1-hello-docker]]
- [[sql-cheatsheet]]
- [[sql-relationships]]
- [[Python-for-Data-Engineering]]
- [[fundamentals]]

---

**Project:** 1.3 of 28 | **Month:** January | **Hours:** ~4h
**GitHub:** [1-3_Data-Loader-Script](https://github.com/BenWaraiotoko/DE-Learning-Projects/tree/main/1-3_Data-Loader-Script)
