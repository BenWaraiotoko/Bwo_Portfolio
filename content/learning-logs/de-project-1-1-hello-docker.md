---

title: "🐳 Project 1.1: Hello Docker"
date: 2026-01-07
publish: true
description: "First container - Dockerfile that runs a Python script"
tags: ["de-project", "docker", "python", "january-2026"]
category: learning-log
series: ["DE Learning Projects"]
project_number: "1.1"
month: "January 2026"
github: "https://github.com/BenWaraiotoko/DE-Learning-Projects/tree/main/1-1_Hello-Docker"

---
Everyone talks about Docker like it's some rite of passage. You hear "just containerize it" thrown around in job descriptions, tutorials, Stack Overflow answers. So I finally sat down and did the most basic thing possible: made it print "Hello from Docker!" and run cleanly.

Glamorous? No. Necessary? Absolutely.

## The Goal

Get one container running. A Dockerfile, a Python script, a `docker run` that works. No overthinking — just enough to understand what's actually happening when people talk about images and containers.

## What I Built

A minimal Docker setup that:
- Builds an image from a Dockerfile
- Runs a Python script inside the container
- Outputs something to the terminal (and exits without drama)

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

- **Images vs containers**: An image is the blueprint; a container is the running instance. `docker build` creates the image, `docker run` spins up a container from it. Obvious in hindsight, confusing when you start.
- **Dockerfile syntax**: `FROM` picks your base, `WORKDIR` sets your directory, `COPY` moves files in, `CMD` defines what runs. That's the whole thing for a basic script.
- **Layer caching**: Order matters. Put things that change often (your script) at the bottom. Docker caches layers from top to bottom and rebuilds from the first change onward.
- **Image tagging**: The `-t hello-docker` flag is just a name so you don't have to remember a hash. Use it.

## Challenges

**Challenge:** Docker Desktop was eating an embarrassing amount of RAM on my Mac.
**Solution:** Adjusted resource limits in Docker Desktop settings. 4GB is plenty for this kind of work. I had left the defaults which were way too generous.

**Challenge:** Edited the Python script, ran the container, nothing changed.
**Solution:** `docker build` doesn't watch for file changes. You have to rebuild manually every time. Later I'll use docker-compose to make this less painful, but for now — muscle memory.

## Result

```
$ docker run hello-docker
Hello from Docker!
Container is working.
```

It ran. It printed. It exited cleanly. That's it — that's the whole win for project 1.1. And honestly? That clean exit felt satisfying after fumbling through the concepts. Foundation laid.

## Related

- [[de-project-1-2-postgresql-in-docker]]
- [[Data-Engineering-Fundamentals]]
- [[Python-for-Data-Engineering]]
- [[fixing-immich-installation]]

---

**Project:** 1.1 of 28 | **Month:** January | **Hours:** ~3h
**GitHub:** [1-1_Hello-Docker](https://github.com/BenWaraiotoko/DE-Learning-Projects/tree/main/1-1_Hello-Docker)
