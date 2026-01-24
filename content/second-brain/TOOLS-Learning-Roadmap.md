---
title: TOOLS Learning Roadmap (Updated)
date: 2026-01-22
publish: true
description: Master essential data engineering tools—Docker, Airflow, dbt, PySpark, Cloud Warehouses. Complete learning path for production-grade pipelines.
tags:
  - tools
  - learning-path
  - data-engineering
  - roadmap
category: second-brain
---
# TOOLS Learning Roadmap

This roadmap organizes **7 comprehensive guides** into a structured learning path for production data engineering tools. Follow this sequence to master the complete stack for Le Wagon bootcamp and beyond.

---

## 📍 Quick Navigation

**Start here based on your experience:**

- **🟢 New to containers:** Start with **TIER 1**
- **🟡 Know Docker, need orchestration:** Start with **TIER 2**
- **🔴 Need production patterns & scaling:** Continue to **TIER 3**

---

## 🎯 TIER 1: Containerization Fundamentals (8-10 hours)

Package and run applications consistently everywhere.

| # | Topic | Page | Time | Learn |
|---|-------|------|------|-------|
| 1 | **Docker Fundamentals** | [[Docker-Fundamentals]] | 3h | Images, containers, volumes, networking |
| 2 | **Docker Compose** | [[Docker-Compose]] | 4h | Multi-container orchestration locally |
| 3 | **Git & GitHub** | [[Git-GitHub]] | 2h | Version control, collaboration, PRs |

**Subtotal: ~9 hours**  
**After TIER 1 you can:** Package applications in Docker, run multi-container stacks locally, collaborate on code.

---

## 🚀 TIER 2: Orchestration & Transformation (10-12 hours)

Automate pipelines and transform data with industry-standard tools.

| # | Topic | Page | Time | Learn |
|---|-------|------|------|-------|
| 4 | **Apache Airflow** | [[Apache-Airflow]] | 5h | DAGs, operators, scheduling, monitoring |
| 5 | **dbt (Data Build Tool)** | [[dbt-Data-Build-Tool]] | 5h | SQL transformations, testing, lineage |

**Subtotal: ~10 hours** (cumulative: ~19 hours)  
**After TIER 2 you can:** Orchestrate complex pipelines, test data quality, scale transformations.

---

## 🔥 TIER 3: Scaling & Cloud (8-10 hours)

Process massive datasets and use managed cloud platforms.

| # | Topic | Page | Time | Learn |
|---|-------|------|------|-------|
| 6 | **PySpark Fundamentals** | [[PySpark-Fundamentals]] | 4h | Distributed computing, RDDs, DataFrames, SQL |
| 7 | **Cloud Data Warehouses** | [[Cloud-Data-Warehouses]] | 4h | Snowflake, BigQuery, Redshift architecture & setup |

**Subtotal: ~8 hours** (cumulative: ~27 hours)  
**After TIER 3 you can:** Process terabyte-scale data, use cloud platforms, build enterprise-grade pipelines.

---

## 📊 Learning Path by Goal

### Goal: "I need bootcamp basics (MVP)"
Follow **TIER 1 + TIER 2** (~19 hours)  
Time to complete: 2-3 weeks  
Bootcamp readiness: **95%**  
**Most important for Le Wagon**

### Goal: "I want to be job-ready post-bootcamp"
Follow **TIER 1 + TIER 2 + TIER 3** (~27 hours)  
Time to complete: 4-5 weeks  
Bootcamp readiness: **100%**  
Job-market readiness: **85%**

---

## 🗓️ Le Wagon Timeline Alignment

### Before Bootcamp (Oct 31, 2026)

| Milestone | Date | What to Know | Pages | Priority |
|-----------|------|--------------|-------|----------|
| **TIER 1 Complete** | By Oct 8 | Docker, Compose, Git basics | 1-3 | 🔴 CRITICAL |
| **TIER 2 Complete** | By Oct 25 | Airflow DAGs, dbt models | 4-5 | 🔴 CRITICAL |
| **TIER 3 Start** | By Oct 31 | PySpark, Cloud intro | 6-7 | 🟡 Nice-to-have |

### During Bootcamp (Nov 2026 - March 2027)

**Weeks 1-2 (Container & Orchestration):**  
You already know Docker + Airflow → focus on production patterns  
**Reference:** [[Docker-Compose]], [[Apache-Airflow]]

**Weeks 3-4 (Data Transformation):**  
Learn dbt in depth, data quality testing  
**Reference:** [[dbt-Data-Build-Tool]]

**Weeks 5-6 (Big Data & Cloud):**  
Introduction to Spark & cloud warehouses  
**Reference:** [[PySpark-Fundamentals]], [[Cloud-Data-Warehouses]]

**Weeks 7+ (Capstone):**  
Build end-to-end pipeline with all tools integrated  
**Reference:** All pages (integrated architecture)

---

## 📝 Daily Study Workflow (45 min/day)

### Weeks 1-2 (TIER 1, Pages 1-3)
```
25 min: Read page + understand concepts
15 min: Follow along with examples locally (Docker, Git)
5 min: Notes & summary
```

### Weeks 3-4 (TIER 2, Pages 4-5)
```
20 min: Read advanced concepts
20 min: Write code (DAG / dbt model)
5 min: Run & verify against data
```

### Weeks 5-6 (TIER 3, Pages 6-7)
```
15 min: Read architecture & concepts
20 min: Set up environment (Spark, cloud credentials)
10 min: Run example query or transformation
```

---

## 🎓 Before You Start: Prerequisites

You should:
- [ ] Have Docker installed (`docker --version`)
- [ ] Understand Python basics (functions, loops, dicts)
- [ ] Have git installed (`git --version`)
- [ ] Know basic command line navigation
- [ ] Have PostgreSQL or similar DB available locally

**If not:** Spend 2 hours on Prerequisites before starting TIER 1.

---

## ✅ Consolidation Checklist

### After TIER 1
- [ ] Build a Docker image from a Dockerfile
- [ ] Run a container with port mapping and volumes
- [ ] Define a docker-compose.yml with 2+ services
- [ ] Create a GitHub repo and push code
- [ ] Merge a pull request on GitHub

### After TIER 2
- [ ] Write an Airflow DAG with 3+ tasks
- [ ] Schedule an Airflow pipeline to run daily
- [ ] Write a dbt model with 3+ tests
- [ ] Generate dbt documentation (`dbt docs`)
- [ ] Build a complete ETL: Airflow → dbt → Postgres

### After TIER 3
- [ ] Run PySpark locally on 1GB+ dataset
- [ ] Query a cloud warehouse (Snowflake/BigQuery)
- [ ] Load data into cloud warehouse via Airflow
- [ ] Build PySpark transformation in dbt
- [ ] Create a project spanning all 7 tools

---

## 🚨 Common Pitfalls (Don't Fall Into These!)

| Pitfall | Why It Matters | Fix |
|---------|----------------|-----|
| Not using volumes in Docker | Data lost when container stops | Always mount volumes for persistence |
| Hardcoding credentials | Security risk | Use .env files, never commit secrets |
| Circular DAG dependencies | Pipeline fails silently | Always use `>>` syntax correctly |
| No dbt tests | Data quality fails in production | Write tests before deployment |
| Large commits | Impossible to review | Commit frequently, small changes |
| Using pandas for GB+ datasets | Memory crashes, slow | Use PySpark or cloud warehouses |
| Not monitoring cloud costs | Surprise bills | Enable cost alerts on Snowflake/BigQuery |

---

## 📚 Full Page Directory

| # | Title | Description | Time | Difficulty | When |
|---|-------|-------------|------|------------|------|
| 1 | [[Docker-Fundamentals]] | Images, containers, volumes, networking | 3h | 🟢 Beginner | Pre-bootcamp |
| 2 | [[Docker-Compose]] | Multi-container apps, services, networks | 4h | 🟡 Intermediate | Pre-bootcamp |
| 3 | [[Git-GitHub]] | Version control, branches, pull requests | 2h | 🟢 Beginner | Pre-bootcamp |
| 4 | [[Apache-Airflow]] | DAGs, operators, scheduling, monitoring | 5h | 🟡 Intermediate | Pre-bootcamp |
| 5 | [[dbt-Data-Build-Tool]] | Models, tests, documentation, lineage | 5h | 🟡 Intermediate | Pre-bootcamp |
| 6 | [[PySpark-Fundamentals]] | RDDs, DataFrames, SQL, distributed computing | 4h | 🟡 Intermediate | Week 5+ (bootcamp) |
| 7 | [[Cloud-Data-Warehouses]] | Snowflake, BigQuery, Redshift, architecture | 4h | 🟡 Intermediate | Week 5+ (bootcamp) |

**Total: ~27 hours**  
**Recommended pace: 1.5 hours/day over 4-5 weeks**

---

## 🔗 Integration with Your Knowledge Base

These TOOLS pages connect with your existing knowledge:

```
Python Fundamentals (1_PYTHON)
        ↓
   SQL Basics (2_SQL)
        ↓
Docker (package code + DB)
        ↓
Docker Compose (local multi-container stack)
        ↓
Git (version control everything)
        ↓
Airflow (orchestrate workflows)
        ↓
dbt (transform in warehouse)
        ↓
PySpark (parallel processing)
        ↓
Cloud Warehouse (production platform)
```

---

## 🎯 Your First Project (After TIER 1)

**Build a containerized pipeline:**

1. Create Dockerfile for Python ETL script
2. Add docker-compose.yml with Postgres + app
3. Push to GitHub with clear commits
4. Run locally: `docker-compose up`

**Time: 3-4 hours**  
**Deliverable:** GitHub repo with working stack

---

## 🎉 Your Second Project (After TIER 2)

**Build complete ETL pipeline:**

1. Extract: Airflow task pulls from API
2. Load: Lands in Postgres staging
3. Transform: dbt models clean and aggregate
4. Test: dbt tests validate quality
5. Orchestrate: Airflow schedules daily runs
6. Version control: Everything in Git

**Time: 8-10 hours**  
**Deliverable:** End-to-end pipeline, scheduled, tested

---

## 🌟 Your Capstone (After TIER 3)

**Production-ready data pipeline:**

1. **Extract:** Airflow pulls from multiple APIs
2. **Load:** Lands in cloud warehouse (Snowflake/BigQuery)
3. **Transform:** dbt + PySpark for complex computations
4. **Test:** Comprehensive data quality checks
5. **Scale:** Process 1GB+ dataset efficiently
6. **Monitor:** Airflow tracking + cost monitoring
7. **Deploy:** CI/CD via GitHub + dbt Cloud

**Time: 20+ hours**  
**Deliverable:** Job-ready portfolio project

---

## 📞 Getting Help

When stuck:

1. **Check the page's "Tips & Gotchas" section**
2. **Run diagnostics:**
   - Docker: `docker ps`, `docker logs`
   - Git: `git log`, `git status`
   - Airflow: `airflow dags list`, check logs
   - dbt: `dbt debug`, `dbt run --select model_name`
   - Spark: Check Spark UI at `localhost:4040`
3. **Search error message** (usually very clear)
4. **Check official docs:**
   - Docker: docs.docker.com
   - Airflow: airflow.apache.org
   - dbt: docs.getdbt.com
   - PySpark: spark.apache.org/docs/latest/api/python
   - Cloud DW: cloud.google.com/bigquery/docs (or Snowflake/Redshift equivalent)

---

## 🏆 Final Goals

By the end of this roadmap, you'll be able to:

✅ **Package** Python code in Docker  
✅ **Compose** multi-service stacks locally  
✅ **Orchestrate** complex pipelines with Airflow  
✅ **Transform** data with dbt & testing  
✅ **Collaborate** professionally with Git  
✅ **Scale** to terabyte datasets with PySpark  
✅ **Deploy** on cloud warehouses (Snowflake/BigQuery)  
✅ **Build** production-ready ETL pipelines  
✅ **Follow Le Wagon** bootcamp from Day 1 with confidence  
✅ **Land jobs** with modern data engineering skills  

---

## 🚀 Next Steps

1. **Install prerequisites:**
   ```bash
   docker --version
   docker-compose --version
   git --version
   python --version
   ```

2. **Start TIER 1:** Open [[Docker-Fundamentals]]

3. **Build as you learn:** Every page has hands-on examples

4. **Push to GitHub:** Version control your learning

5. **Track progress:** Check off Consolidation Checklist after each TIER

---

**Ready to start?** → Begin with [[Docker-Fundamentals]] ✨

**Already know Docker?** → Jump to [[Apache-Airflow]]

**Want to scale?** → See [[PySpark-Fundamentals]] and [[Cloud-Data-Warehouses]]

**Questions?** Review the "Related" section at the bottom of each page for cross-references.

---

*This roadmap is designed for data engineers preparing for Le Wagon bootcamp and job market entry. Total time investment: ~27 hours to master production-grade modern data engineering tools.*

*Last updated: Jan 22, 2026*
