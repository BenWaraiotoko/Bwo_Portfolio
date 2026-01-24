---
title: Docker Fundamentals (Images, Containers, Volumes)
date: 2026-01-22
publish: true
description: Master Docker containerization—images, containers, volumes, and networking. Essential foundation for modern data engineering pipelines.
tags:
  - docker
  - containerization
  - data-engineering
  - devops
category: second-brain
---
**Docker** is how you package and run applications consistently across any machine. In data engineering, Docker ensures your pipeline works on your laptop, in CI/CD, and on production servers—no "it works on my machine" excuses.

---

## Core Concepts

### Images vs Containers

**Image:** A blueprint (like a template)
- Defines what goes into the application
- Built from a `Dockerfile`
- Immutable (read-only)
- Stored locally or in registries (Docker Hub, ECR)

**Container:** An actual running instance
- Built from an image
- Isolated, lightweight process
- Can be started, stopped, deleted
- Data inside dies when container stops (unless you use volumes)

---

## Building Images: Dockerfile

### Basic Dockerfile

```dockerfile
# Start from a base image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy requirements
COPY requirements.txt .

# Install dependencies
RUN pip install -r requirements.txt

# Copy application code
COPY . .

# Expose port (documentation only)
EXPOSE 8000

# Default command
CMD ["python", "main.py"]
```

**Execution order:**
1. FROM — Choose base image
2. RUN — Execute commands at build time
3. COPY — Copy files from host to container
4. EXPOSE — Document which port the app uses
5. CMD — Default command when container starts

### Building an Image

```bash
# Build image with name and tag
docker build -t my-app:1.0 .

# Verify it was created
docker images

# Output:
# REPOSITORY   TAG    IMAGE ID      CREATED
# my-app       1.0    abc123def456  5 seconds ago
```

### Multi-Stage Build (Reduce Size)

```dockerfile
# Stage 1: Build
FROM python:3.11 as builder
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

# Stage 2: Runtime (smaller image)
FROM python:3.11-slim
WORKDIR /app
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY . .
CMD ["python", "main.py"]
```

**Why:** First stage includes build tools (large). Second stage is lean, fast, production-ready.

---

## Running Containers

### Basic Container

```bash
# Run a container from image
docker run -d --name my-app-1 my-app:1.0

# Flags:
# -d: detached (run in background)
# --name: container name (for reference)
```

### Interactive Container

```bash
# Run interactively (bash shell)
docker run -it my-app:1.0 /bin/bash

# Flags:
# -i: interactive
# -t: terminal
# /bin/bash: shell to use
```

### Port Mapping

```bash
# Map container port 8000 to host port 8000
docker run -p 8000:8000 my-app:1.0

# Syntax: -p HOST_PORT:CONTAINER_PORT

# Check what's running
docker ps

# Output:
# CONTAINER ID  IMAGE        PORTS                  NAMES
# abc123        my-app:1.0   0.0.0.0:8000->8000/tcp my-app-1
```

### Environment Variables

```bash
# Pass environment variables to container
docker run -e DATABASE_URL="postgres://user:pass@db:5432/mydb" \
           -e LOG_LEVEL="debug" \
           my-app:1.0

# Or from a file
docker run --env-file .env my-app:1.0
```

### Running Commands in Container

```bash
# Execute command in running container
docker exec -it my-app-1 /bin/bash

# Run one-off command
docker exec my-app-1 python script.py
```

---

## Volumes: Persist Data

**Problem:** When a container stops, all data inside is lost.  
**Solution:** Mount volumes to persist data outside the container lifecycle.

### Bind Mount (Host Directory)

```bash
# Mount host directory into container
docker run -v /path/on/host:/path/in/container my-app:1.0

# Example: Share config file
docker run -v ~/.ssh:/root/.ssh my-app:1.0

# Read-only mount
docker run -v /config:/app/config:ro my-app:1.0
```

### Named Volume (Docker-managed)

```bash
# Create named volume
docker volume create my-data

# Mount named volume
docker run -v my-data:/app/data my-app:1.0

# List volumes
docker volume ls

# Inspect volume
docker volume inspect my-data

# Delete volume
docker volume rm my-data
```

### Volume in Dockerfile

```dockerfile
FROM postgres:15

# Declare volume (helps document persistence)
VOLUME /var/lib/postgresql/data

# Any files written to /var/lib/postgresql/data will persist
```

---

## Networking: Connect Containers

### Bridge Network (Default)

```bash
# Containers on same bridge can communicate by name
docker network create my-network

# Run containers on network
docker run -d --name db --network my-network postgres:15
docker run -d --name app --network my-network my-app:1.0

# From app container, connect to db using hostname 'db'
# Connection string: postgresql://db:5432/mydb
```

### Host Network (Advanced)

```bash
# Container shares host's network interface
docker run --network host my-app:1.0

# Use when you need maximum performance
# Warning: Security implications
```

---

## Container Lifecycle

### Common Commands

```bash
# Check running containers
docker ps

# Check all containers (including stopped)
docker ps -a

# View logs
docker logs my-app-1
docker logs -f my-app-1  # Follow logs (tail -f)

# Stop container
docker stop my-app-1

# Start container
docker start my-app-1

# Remove container (must be stopped)
docker rm my-app-1

# Remove image
docker rmi my-app:1.0
```

### Container Health Check

```dockerfile
FROM my-app:1.0

# Periodically check if app is healthy
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1
```

---

## Real-World Data Engineering Example

### ETL Pipeline in Docker

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copy pipeline code
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY pipeline/ ./pipeline/

# Health check
HEALTHCHECK CMD python -c "import sys; sys.exit(0)" || exit 1

# Run pipeline
CMD ["python", "-m", "pipeline.etl"]
```

```bash
# Run with environment config
docker run \
  -e SOURCE_DB="postgresql://source:5432/raw" \
  -e TARGET_DB="postgresql://warehouse:5432/prod" \
  -e LOG_LEVEL="info" \
  -v /data/logs:/app/logs \
  my-etl-pipeline:1.0
```

---

## Best Practices

| Practice | Why | Example |
|----------|-----|---------|
| Use specific base image versions | Reproducibility | `FROM python:3.11.1` not `FROM python:latest` |
| Install only what you need | Smaller images | Don't install `curl` if you don't use it |
| Use multi-stage builds | Reduce final image size | Build in one stage, copy artifacts to slim stage |
| Layer caching | Faster builds | Put stable commands (RUN pip) before changing code |
| Use `.dockerignore` | Exclude unnecessary files | Like `.gitignore` for Docker |
| Run as non-root user | Security | `USER appuser` in Dockerfile |

---

## Tips & Gotchas

- **Container IDs are long.** Use `--name` to give them readable names.

```bash
docker run --name my-pipeline my-app:1.0  # Better than container ID
```

- **Ports must be unique.** Two containers can't use the same host port.

```bash
# ❌ Error: Port 8000 already in use
docker run -p 8000:8000 app1:1.0
docker run -p 8000:8000 app2:1.0

# ✅ Use different ports
docker run -p 8000:8000 app1:1.0
docker run -p 8001:8000 app2:1.0
```

- **Data in containers is temporary.** Use volumes!

```bash
# ❌ Data lost when container stops
docker run my-app:1.0
docker stop container_id
# Data gone!

# ✅ Data persists
docker run -v my-data:/app/data my-app:1.0
```

- **Layers are cached.** Put changing code at the end of Dockerfile.

```dockerfile
# ❌ Rebuilds pip install every time code changes
FROM python:3.11
COPY . .
RUN pip install -r requirements.txt

# ✅ Caches pip install, only rebuilds your code
FROM python:3.11
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
```

---

## Related

- [[Docker-Compose]] — Run multi-container applications
- [[Apache-Airflow]] — Airflow runs in Docker
- [[05-PostgreSQL-for-Data-Engineering]] — Database in Docker
- [[TOOLS-Learning-Roadmap]] — Your complete tools learning path

---

**Key Takeaway:**  
Docker = **Image** (blueprint) → **Container** (running instance). Use `Dockerfile` to build images, `docker run` to start containers, and **volumes** to persist data. Master Docker and you can deploy anywhere.
