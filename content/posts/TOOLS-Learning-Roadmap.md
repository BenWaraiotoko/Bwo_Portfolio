---
title: "The Modern Data Stack: A Roadmap That Actually Has an Order"
date: 2026-01-22
publish: true
category: posts
tags:
  - tools
  - learning-path
  - data-engineering
description: "Seven tools. One sequence. No more wondering what to learn next."
---

Here's the thing nobody tells you when you start learning data engineering: it's not one tool. It's seven. And they only make sense in the right order.

Pick them up randomly and you'll spend three weeks configuring Airflow without understanding why containers exist, or try to learn dbt before you've touched SQL transformations. It's painful. I've been there.

This roadmap sequences **Docker, Compose, Git, Airflow, dbt, PySpark, and cloud warehouses** so each one builds on the last. By the time you hit the advanced stuff, you're not learning the tools from scratch — you're just applying them faster.

---

## Where Do You Start?

- **🟢 New to containers:** Start with **TIER 1**
- **🟡 Know Docker, need orchestration:** Jump to **TIER 2**
- **🔴 Need production patterns & scaling:** Go straight to **TIER 3**

---

## 🎯 TIER 1: Containerization Fundamentals (~9 hours)

Package and run applications consistently everywhere. This is the foundation — nothing else in the stack makes as much sense without it.

| # | Topic | Page | Time | What You'll Actually Learn |
|---|-------|------|------|---------------------------|
| 1 | **Docker Fundamentals** | [[Docker-Fundamentals]] | 3h | Images, containers, volumes, networking |
| 2 | **Docker Compose** | [[Docker-Compose]] | 4h | Multi-container orchestration locally |
| 3 | **Git & GitHub** | [[Git-GitHub]] | 2h | Version control, collaboration, PRs |

**After TIER 1:** You can package applications in Docker, spin up multi-container stacks locally, and collaborate on code without stepping on anyone's feet.

---

## 🚀 TIER 2: Orchestration & Transformation (~10 hours)

Automate your pipelines and transform data with the tools you'll actually use at work.

| # | Topic | Page | Time | What You'll Actually Learn |
|---|-------|------|------|---------------------------|
| 4 | **Apache Airflow** | [[Apache-Airflow]] | 5h | DAGs, operators, scheduling, monitoring |
| 5 | **dbt (Data Build Tool)** | [[dbt-Data-Build-Tool]] | 5h | SQL transformations, testing, lineage |

**Cumulative: ~19 hours**

After TIER 2: you can orchestrate complex pipelines, catch data quality issues before they become incidents, and scale transformations properly.

---

## 🔥 TIER 3: Scaling & Cloud (~8 hours)

Process massive datasets and stop pretending pandas can handle everything.

| # | Topic | Page | Time | What You'll Actually Learn |
|---|-------|------|------|---------------------------|
| 6 | **PySpark Fundamentals** | [[PySpark-Fundamentals]] | 4h | Distributed computing, RDDs, DataFrames, SQL |
| 7 | **Cloud Data Warehouses** | [[Cloud-Data-Warehouses]] | 4h | Snowflake, BigQuery, Redshift — architecture & setup |

**Cumulative: ~27 hours**

After TIER 3: terabyte-scale datasets stop being scary, cloud platforms make sense, and you can build pipelines that would survive a real production environment.

---

## 📊 Learning Path by Goal

### "I need a solid foundation fast"
**TIER 1 + TIER 2** — ~19 hours, 2–3 weeks. Covers the core stack.

### "I want to be genuinely job-ready"
**All three tiers** — ~27 hours, 4–5 weeks. That's the full picture.

---

## 📝 How to Study This Without Burning Out

45 minutes a day is enough. Here's how to use them:

```
Weeks 1–2 (TIER 1):
├─ 25 min: Read the page, understand the concepts
├─ 15 min: Follow along locally (actually run the Docker commands)
└─ 5 min: Write your own notes in your own words

Weeks 3–4 (TIER 2):
├─ 20 min: Read the advanced concepts
├─ 20 min: Write code — a DAG, a dbt model, something real
└─ 5 min: Run it and verify it works

Weeks 5–6 (TIER 3):
├─ 15 min: Read the architecture and concepts
├─ 20 min: Set up the environment (Spark, cloud credentials)
└─ 10 min: Run an example query or transformation
```

The trap most people fall into: reading without running. Every page has examples. Run them. Then break them. That's when it actually sticks.

---

## 🎓 Prerequisites Check

Before starting TIER 1, verify you have:

- [ ] Docker installed (`docker --version`)
- [ ] Python basics — functions, loops, dicts (see [[Python-Fundamentals-Roadmap]])
- [ ] Git installed (`git --version`)
- [ ] Basic command line navigation
- [ ] PostgreSQL or a similar DB available locally

If any of those are missing, sort them out first. Starting without them is just going to slow you down.

---

## ✅ "Do I Actually Know This?" Checklists

### After TIER 1
- [ ] Build a Docker image from a Dockerfile
- [ ] Run a container with port mapping and volumes
- [ ] Define a `docker-compose.yml` with 2+ services
- [ ] Create a GitHub repo and push code
- [ ] Merge a pull request on GitHub

### After TIER 2
- [ ] Write an Airflow DAG with 3+ tasks
- [ ] Schedule an Airflow pipeline to run daily
- [ ] Write a dbt model with 3+ tests
- [ ] Generate dbt documentation (`dbt docs`)
- [ ] Build a complete ETL: Airflow → dbt → Postgres

### After TIER 3
- [ ] Run PySpark locally on a 1GB+ dataset
- [ ] Query a cloud warehouse (Snowflake or BigQuery)
- [ ] Load data into a cloud warehouse via Airflow
- [ ] Build a PySpark transformation in dbt
- [ ] Create a project that spans all 7 tools

---

## 🚨 Pitfalls I've Seen (And Made)

| Pitfall | Why It Bites You | The Fix |
|---------|-----------------|---------|
| Not using volumes in Docker | Data disappears when the container stops | Always mount volumes for anything you want to keep |
| Hardcoding credentials | Security risk, will bite you eventually | Use `.env` files, never commit secrets |
| Circular DAG dependencies | Pipeline fails silently and you waste hours | Use `>>` syntax correctly, test your DAG structure |
| No dbt tests | Data quality breaks in production undetected | Write tests before deploying models |
| Giant commits | Impossible to review or debug later | Commit small and often |
| Using pandas on GB+ datasets | Memory crashes, everything grinds to a halt | PySpark or cloud warehouses exist for a reason |
| Ignoring cloud costs | Surprise bills at end of month | Enable cost alerts on Snowflake/BigQuery from day one |

---

## 📚 Full Guide Directory

| # | Title | What It Covers | Time | Level |
|---|-------|----------------|------|-------|
| 1 | [[Docker-Fundamentals]] | Images, containers, volumes, networking | 3h | 🟢 Beginner |
| 2 | [[Docker-Compose]] | Multi-container apps, services, networks | 4h | 🟡 Intermediate |
| 3 | [[Git-GitHub]] | Version control, branches, pull requests | 2h | 🟢 Beginner |
| 4 | [[Apache-Airflow]] | DAGs, operators, scheduling, monitoring | 5h | 🟡 Intermediate |
| 5 | [[dbt-Data-Build-Tool]] | Models, tests, documentation, lineage | 5h | 🟡 Intermediate |
| 6 | [[PySpark-Fundamentals]] | RDDs, DataFrames, SQL, distributed computing | 4h | 🟡 Intermediate |
| 7 | [[Cloud-Data-Warehouses]] | Snowflake, BigQuery, Redshift, architecture | 4h | 🟡 Intermediate |

**Total: ~27 hours** at 1.5 hours/day = 4–5 weeks.

---

## 🔗 How the Stack Connects

```
Python Fundamentals
        ↓
   SQL Basics
        ↓
Docker (package code + DB)
        ↓
Docker Compose (local multi-container stack)
        ↓
Git (version control everything)
        ↓
Airflow (orchestrate the workflows)
        ↓
dbt (transform in the warehouse)
        ↓
PySpark (parallel processing at scale)
        ↓
Cloud Warehouse (production platform)
```

Each step makes the next one less abstract. That's the whole point.

---

## 🎯 Your First Project (After TIER 1)

**Build a containerized pipeline:**

1. Create a Dockerfile for a Python ETL script
2. Add a `docker-compose.yml` with Postgres + your app
3. Push to GitHub with clear, small commits
4. Run locally: `docker-compose up`

**Time: 3–4 hours**
**Deliverable:** A GitHub repo with a working stack — something you can actually show someone.

---

## 🎉 Your Second Project (After TIER 2)

**Build a complete ETL pipeline:**

1. **Extract:** Airflow task pulls from an API
2. **Load:** Lands in Postgres staging
3. **Transform:** dbt models clean and aggregate
4. **Test:** dbt tests validate data quality
5. **Orchestrate:** Airflow schedules daily runs
6. **Version control:** Everything in Git

**Time: 8–10 hours**
**Deliverable:** An end-to-end pipeline, scheduled, tested, reproducible.

---

## 🌟 Your Capstone (After TIER 3)

**A production-grade data pipeline:**

1. **Extract:** Airflow pulls from multiple APIs
2. **Load:** Lands in a cloud warehouse (Snowflake or BigQuery)
3. **Transform:** dbt + PySpark for complex computations
4. **Test:** Comprehensive data quality checks at each layer
5. **Scale:** Handles 1GB+ datasets without breaking a sweat
6. **Monitor:** Airflow tracking + cost monitoring enabled
7. **Deploy:** CI/CD via GitHub + dbt Cloud

**Time: 20+ hours**
**Deliverable:** A portfolio project you'd actually put on a CV.

---

## When You're Stuck

1. **Check the page's "Tips & Gotchas" section** — common mistakes are already documented
2. **Run diagnostics first:**
   - Docker: `docker ps`, `docker logs`
   - Git: `git log`, `git status`
   - Airflow: `airflow dags list`, check the task logs
   - dbt: `dbt debug`, `dbt run --select model_name`
   - Spark: Check the Spark UI at `localhost:4040`
3. **Read the full error message** — they're usually more informative than you think
4. **Check the official docs** — they're good, actually

---

## 🏆 Where This Gets You

By the end of all three tiers:

✅ Package Python code in Docker — no more "works on my machine"
✅ Compose multi-service stacks locally without fighting configs
✅ Orchestrate complex pipelines with Airflow
✅ Transform and test data properly with dbt
✅ Collaborate professionally with Git
✅ Scale to terabyte datasets with PySpark
✅ Deploy on cloud warehouses (Snowflake, BigQuery)
✅ Build production-ready ETL pipelines end to end

---

## 🚀 Start Right Now

```bash
docker --version
docker-compose --version
git --version
python --version
```

All four showing a version? Open [[Docker-Fundamentals]] and start reading.

Already know Docker? Jump to [[Apache-Airflow]].

Want to skip to scale? [[PySpark-Fundamentals]] and [[Cloud-Data-Warehouses]] are waiting.

---

27 hours is a small investment to show up to any interview or project already knowing the tools. Build the three projects, push them to GitHub, and you'll have a portfolio instead of just a plan.

Now go open Page 1.
