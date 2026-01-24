---
title: Docker Compose & Multi-Container Pipelines
date: 2026-01-22
publish: true
description: Master Docker Compose to orchestrate multi-container applications—databases, apps, services. Build realistic ETL pipelines locally.
tags:
  - docker
  - docker-compose
  - data-engineering
  - orchestration
category: second-brain
---
**Docker Compose** lets you define and run multi-container applications using a simple YAML file. Instead of running 5 `docker run` commands, write one `docker-compose.yml` and bring up your entire stack with `docker-compose up`.

---

## Docker Compose Basics

### Why Docker Compose?

Without Compose:
```bash
docker network create my-pipeline
docker run -d --name db --network my-pipeline -e POSTGRES_PASSWORD=secret postgres:15
docker run -d --name redis --network my-pipeline redis:7
docker run -d --name app --network my-pipeline my-app:1.0
# Hard to manage, easy to forget ports/networks
```

With Compose:
```bash
docker-compose up
# Everything defined in one file, easy to replicate
```

---

## Basic docker-compose.yml

```yaml
version: '3.8'

services:
  db:
    image: postgres:15
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: mydb
    ports:
      - "5432:5432"
    volumes:
      - db_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user"]
      interval: 10s
      timeout: 5s
      retries: 5

  app:
    build: .  # Build from Dockerfile in current directory
    depends_on:
      db:
        condition: service_healthy
    environment:
      DATABASE_URL: "postgresql://user:secret@db:5432/mydb"
    ports:
      - "8000:8000"
    volumes:
      - ./code:/app  # Mount local directory for development
    command: python main.py

volumes:
  db_data:
```

---

## Core Sections

### Services (Containers)

```yaml
services:
  web:
    image: nginx:latest  # Use existing image
    # OR
    build: .  # Build from Dockerfile
    
    # Container settings
    container_name: my-web
    hostname: web-server
    
    # Port mapping
    ports:
      - "80:80"
      - "443:443"
    
    # Expose to other services (internal only)
    expose:
      - "8000"
    
    # Environment variables
    environment:
      DEBUG: "true"
      API_KEY: "${API_KEY}"  # From .env file
    
    # Mount volumes
    volumes:
      - ./data:/data
      - my-volume:/app/cache
    
    # Dependency management
    depends_on:
      db:
        condition: service_healthy
    
    # Restart policy
    restart: unless-stopped  # no, always, on-failure, unless-stopped
    
    # Resource limits
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
```

### Volumes (Data Persistence)

```yaml
volumes:
  db_data:
    # Named volume (Docker-managed)
  
  shared_config:
    driver: local
    driver_opts:
      type: tmpfs
      device: tmpfs
```

### Networks (Container Communication)

```yaml
networks:
  frontend:
    driver: bridge
  
  backend:
    driver: bridge

services:
  web:
    networks:
      - frontend
  
  api:
    networks:
      - frontend
      - backend
  
  db:
    networks:
      - backend
```

---

## Real-World Data Pipeline Example

### Complete ETL Stack

```yaml
version: '3.8'

services:
  # Raw data ingestion
  postgres_source:
    image: postgres:15
    environment:
      POSTGRES_DB: source_db
      POSTGRES_PASSWORD: source_pass
    ports:
      - "5433:5432"
    volumes:
      - source_data:/var/lib/postgresql/data

  # Data warehouse
  postgres_warehouse:
    image: postgres:15
    environment:
      POSTGRES_DB: warehouse_db
      POSTGRES_PASSWORD: warehouse_pass
    ports:
      - "5434:5432"
    volumes:
      - warehouse_data:/var/lib/postgresql/data

  # Cache layer
  redis:
    image: redis:7
    ports:
      - "6379:6379"

  # ETL application
  etl_pipeline:
    build:
      context: .
      dockerfile: Dockerfile.etl
    depends_on:
      postgres_source:
        condition: service_healthy
      postgres_warehouse:
        condition: service_healthy
    environment:
      SOURCE_DB: "postgresql://postgres:source_pass@postgres_source:5432/source_db"
      WAREHOUSE_DB: "postgresql://postgres:warehouse_pass@postgres_warehouse:5432/warehouse_db"
      REDIS_URL: "redis://redis:6379"
      LOG_LEVEL: "info"
    volumes:
      - ./pipeline:/app/pipeline
      - ./logs:/app/logs
    command: python -m pipeline.etl

  # Monitoring/UI (optional)
  pgadmin:
    image: dpage/pgadmin4:latest
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@example.com
      PGADMIN_DEFAULT_PASSWORD: admin
    ports:
      - "5050:80"

volumes:
  source_data:
  warehouse_data:

networks:
  default:
    driver: bridge
```

---

## Essential Commands

### Lifecycle Management

```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# Rebuild images before starting
docker-compose up --build

# View running services
docker-compose ps

# Stop all services
docker-compose stop

# Stop and remove containers
docker-compose down

# Remove everything (containers, networks, volumes)
docker-compose down -v
```

### Debugging

```bash
# View logs
docker-compose logs

# View logs for specific service
docker-compose logs postgres_warehouse

# Follow logs (tail -f)
docker-compose logs -f etl_pipeline

# Execute command in running service
docker-compose exec etl_pipeline bash

# Run one-off command
docker-compose run etl_pipeline python script.py
```

### Build & Push

```bash
# Build all images
docker-compose build

# Build specific service
docker-compose build etl_pipeline

# Push to registry
docker-compose push

# Pull latest images
docker-compose pull
```

---

## Environment Variables (.env)

### Create .env File

```bash
# .env
SOURCE_DB_PASSWORD=super_secret
WAREHOUSE_DB_PASSWORD=another_secret
API_KEY=your_api_key_here
LOG_LEVEL=debug
```

### Reference in docker-compose.yml

```yaml
services:
  postgres_source:
    environment:
      POSTGRES_PASSWORD: ${SOURCE_DB_PASSWORD}
  
  etl_pipeline:
    environment:
      API_KEY: ${API_KEY}
      LOG_LEVEL: ${LOG_LEVEL}
```

---

## Health Checks

Ensure services are ready before dependent services start:

```yaml
services:
  postgres:
    image: postgres:15
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 10s

  app:
    depends_on:
      postgres:
        condition: service_healthy
```

---

## Networking Between Services

### Service Discovery

Containers can communicate using service names:

```yaml
services:
  db:
    # Accessible from other services as 'db' or 'db:5432'
  
  app:
    environment:
      DATABASE_URL: "postgresql://user:pass@db:5432/mydb"
```

### Custom Networks

```yaml
networks:
  frontend:
  backend:

services:
  web:
    networks:
      - frontend
  
  api:
    networks:
      - frontend
      - backend
  
  db:
    networks:
      - backend

# Result: web ↔ api ↔ db, but web cannot reach db directly
```

---

## Common Patterns

### Development vs Production

```yaml
# docker-compose.dev.yml
services:
  app:
    build: .
    volumes:
      - ./code:/app  # Hot reload on code change
    environment:
      DEBUG: "true"

# docker-compose.prod.yml
services:
  app:
    image: my-app:1.0.0  # Pre-built image
    environment:
      DEBUG: "false"
```

Usage:
```bash
# Development
docker-compose -f docker-compose.dev.yml up

# Production
docker-compose -f docker-compose.prod.yml up -d
```

### Override Specific Services

```bash
# Start most services from compose, but override one
docker-compose up -d
docker run -it --network my-network my-app:1.0 /bin/bash
```

---

## Tips & Gotchas

- **Service names are DNS-resolvable.** `db` resolves to the database container's IP.

```yaml
# Connection string in app
DATABASE_URL: "postgresql://user:pass@db:5432/mydb"  # 'db' = service name
```

- **`depends_on` doesn't guarantee readiness.** Use `condition: service_healthy`.

```yaml
# ❌ App might start before DB is ready
depends_on:
  - db

# ✅ Wait for health check
depends_on:
  db:
    condition: service_healthy
```

- **Volumes persist after `down`.** Use `-v` to remove them.

```bash
# ❌ Data persists
docker-compose down

# ✅ Remove volumes
docker-compose down -v
```

- **Port conflicts.** If port 5432 is already in use, change the mapping.

```yaml
# ❌ Error if 5432 taken
ports:
  - "5432:5432"

# ✅ Use different host port
ports:
  - "5433:5432"
```

---

## Related

- [[Docker-Fundamentals]] — Single containers, images, volumes
- [[Apache-Airflow]] — Airflow with Docker Compose
- [[05-PostgreSQL-for-Data-Engineering]] — Database in Compose
- [[TOOLS-Learning-Roadmap]] — Your complete tools learning path

---

**Key Takeaway:**  
Docker Compose = multi-container orchestration via YAML. Define your entire stack once (DB + app + cache), version control it, and bring it up anywhere with `docker-compose up`. Use health checks, networks, and volumes for production-ready pipelines.
