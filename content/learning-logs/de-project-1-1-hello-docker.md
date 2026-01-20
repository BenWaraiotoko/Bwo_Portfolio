---
title: "🐳 Project 1.1: Hello Docker"
date: 2026-01-07
draft: false
description: "First container - Dockerfile that runs a Python script"
tags: ["de-project", "docker", "python", "january-2026"]
categories: ["Learning Logs"]
series: ["DE Learning Projects"]
project_number: "1.1"
month: "January 2026"
github: "https://github.com/BenWaraiotoko/DE-Learning-Projects/tree/main/1-1_Hello-Docker"
---

## The Goal

Create and run my first Docker container. Simple goal: a Dockerfile that executes a Python "Hello World" script. No overthinking—just get containers working.

## What I Built

A minimal Docker setup that:
- Builds an image from a Dockerfile
- Runs a Python script inside the container
- Outputs "Hello World" (and proves I understand the basics)

### Tech Stack

- **Docker** — Container runtime
- **Python** — Simple script execution

## Implementation

### Dockerfile

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY hello.py .

CMD ["python", "hello.py"]
```

### Python Script

```python
# hello.py
print("Hello from Docker!")
print("Container is working.")
```

### Commands

```bash
# Build the image
docker build -t hello-docker .

# Run the container
docker run hello-docker
```

## What I Learned

- **Docker fundamentals**: Images vs containers, build vs run
- **Dockerfile syntax**: FROM, WORKDIR, COPY, CMD
- **Layer caching**: Order matters in Dockerfiles
- **Image tagging**: How `-t` names your images

## Challenges

**Challenge:** Docker Desktop eating RAM on my Mac.
**Solution:** Adjusted resource limits in Docker Desktop settings. 4GB RAM is enough for basic containers.

**Challenge:** Forgetting to rebuild after changes.
**Solution:** `docker build` doesn't auto-detect changes. Need to rebuild manually (or use docker-compose later).

## Result

Container runs, prints output, exits cleanly. First Docker project: done. ✅

```
$ docker run hello-docker
Hello from Docker!
Container is working.
```

Simple, but it works. Foundation for everything else.

---

**Project:** 1.1 of 28 | **Month:** January | **Hours:** ~3h
**GitHub:** [1-1_Hello-Docker](https://github.com/BenWaraiotoko/DE-Learning-Projects/tree/main/1-1_Hello-Docker)
