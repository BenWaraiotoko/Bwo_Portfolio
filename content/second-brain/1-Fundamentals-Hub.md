---
title: Fundamentals Hub - Your Complete Learning Map
date: 2026-01-22
publish: true
description: Index and navigation for all data engineering fundamentals, organized by domain and learning level.
tags:
  - fundamentals
  - index
  - learning-map
category: second-brain
---
# Fundamentals Hub 📚

Your complete guide to data engineering fundamentals. Use this page to navigate by **domain** or **learning level**.

---

## 🚀 Quick Start (First 2 Weeks)

**If you have 2 weeks before bootcamp:**

1. **Day 1-3:** Read [[0-Data-Engineering-Fundamentals]]
2. **Day 4-7:** Learn [[Docker-Fundamentals]] (3h)
3. **Day 8-14:** Learn [[Apache-Airflow]] (5h)

**Result:** Understand architecture, know tools, ready for Week 1

---

## 📖 By Domain

### **Concepts & Theory**

| Document                            | Focus                     | Time | Level       |
| ----------------------------------- | ------------------------- | ---- | ----------- |
| [[0-Data-Engineering-Fundamentals]] | What is data engineering? | 1.5h | 🟢 Beginner |
| [[TOOLS-Learning-Roadmap]]          | How tools fit together    | 0.5h | 🟢 Beginner |

### **Containerization & DevOps**

| Document | Focus | Time | Level |
|----------|-------|------|-------|
| [[Docker-Fundamentals]] | Images, containers, volumes | 3h | 🟢 Beginner |
| [[Docker-Compose]] | Multi-container orchestration | 4h | 🟡 Intermediate |
| [[Git-GitHub]] | Version control & collaboration | 2h | 🟢 Beginner |
| [[git-cheatsheet]] | Quick command reference | 0.5h | 🟢 Beginner |

### **Orchestration & Scheduling**

| Document | Focus | Time | Level |
|----------|-------|------|-------|
| [[Apache-Airflow]] | DAGs, operators, scheduling | 5h | 🟡 Intermediate |

### **Transformation & Testing**

| Document | Focus | Time | Level |
|----------|-------|------|-------|
| [[dbt-Data-Build-Tool]] | SQL models, tests, documentation | 5h | 🟡 Intermediate |

### **Distributed Computing**

| Document | Focus | Time | Level |
|----------|-------|------|-------|
| [[PySpark-Fundamentals]] | RDDs, DataFrames, SQL | 4h | 🟡 Intermediate |

### **Cloud Platforms**

| Document | Focus | Time | Level |
|----------|-------|------|-------|
| [[Cloud-Data-Warehouses]] | Snowflake, BigQuery, Redshift | 4h | 🟡 Intermediate |

---

## 📊 By Learning Level

### 🟢 Beginner (Start Here)

Foundational concepts, local development:

1. [[0-Data-Engineering-Fundamentals]] — Understand the field
2. [[Docker-Fundamentals]] — Package your code
3. [[Git-GitHub]] — Version control like a professional
4. [[TOOLS-Learning-Roadmap]] — See the big picture

**After:** You can run a simple pipeline locally

### 🟡 Intermediate (Week 2-3)

Industry-standard tools, production patterns:

1. [[Docker-Compose]] — Multi-service stacks
2. [[Apache-Airflow]] — Automated workflows
3. [[dbt-Data-Build-Tool]] — Data transformations
4. [[git-cheatsheet]] — Workflow automation

**After:** You can build production-ready pipelines

### 🔴 Advanced (Week 4-6)

Scaling and cloud platforms:

1. [[PySpark-Fundamentals]] — Big data processing
2. [[Cloud-Data-Warehouses]] — Managed warehouses
3. Integrate all tools (Docker + Airflow + dbt + Spark + Cloud)

**After:** You're job-ready

---

## 🗺️ Learning Paths by Goal

### Goal: "Understand data engineering (1.5h)"

```
Data-Engineering-Fundamentals-Updated (1.5h)
└─ Concepts only, no hands-on
```

### Goal: "Build a simple pipeline locally (12h)"

```
1. Data-Engineering-Fundamentals-Updated (1.5h) — Understand
2. Docker-Fundamentals (3h) — Container basics
3. Apache-Airflow (5h) — Orchestration
4. Git-GitHub (2h) — Version control
└─ Build first project: Airflow + Docker + Git
```

### Goal: "Be bootcamp-ready (19h)"

```
1. TIER 1 Fundamentals (9h)
   - Docker-Fundamentals
   - Docker-Compose
   - Git-GitHub
2. TIER 2 Tools (10h)
   - Apache-Airflow
   - dbt-Data-Build-Tool
3. Build integrated ETL project
└─ Ready for Le Wagon Week 1
```

### Goal: "Be job-ready (27h)"

```
1. TIER 1 (9h) — Containerization
2. TIER 2 (10h) — Orchestration & transformation
3. TIER 3 (8h)
   - PySpark-Fundamentals
   - Cloud-Data-Warehouses
4. Build capstone project
5. Publish portfolio
└─ Ready for junior DE roles
```

---

## 🔄 Recommended Daily Workflow

### Phase 1: Fundamentals (Days 1-3)

```
9:00 - 10:00  Read: Data-Engineering-Fundamentals-Updated
10:00 - 11:00 Watch: Docker intro video (find on YouTube)
11:00 - 12:00 Notes & summarize concepts
12:00 - 13:00 Lunch break
13:00 - 14:00 Practical: Install Docker, run first container
14:00 - 15:00 Review & questions
```

### Phase 2: Core Tools (Days 4-10)

```
9:00 - 9:30  Review previous day
9:30 - 10:30 Read new TOOL page
10:30 - 12:00 Follow along with examples
12:00 - 13:00 Lunch break
13:00 - 14:30 Write your own code (DAG, model, Dockerfile)
14:30 - 15:00 Test & fix errors
15:00 - 15:30 Commit to Git
```

### Phase 3: Integration (Days 11-14)

```
9:00 - 12:00 Project work (combine 2-3 tools)
12:00 - 13:00 Lunch break
13:00 - 15:00 Continue project + debugging
15:00 - 15:30 Git push + documentation
```

---

## 🎯 Consolidation Milestones

### After Fundamentals + Docker (Day 3)
- [ ] Explain what data engineering is
- [ ] Run a Docker container locally
- [ ] Commit code to Git

### After Airflow (Day 7)
- [ ] Write an Airflow DAG with 3 tasks
- [ ] Schedule it to run
- [ ] View logs in Airflow UI

### After dbt (Day 10)
- [ ] Write a dbt model with tests
- [ ] Run `dbt test` successfully
- [ ] Generate documentation

### After Integration (Day 14)
- [ ] Build ETL: Airflow → dbt → Cloud warehouse
- [ ] All code in Git with clean history
- [ ] Project README ready

---

## 🚨 Common Mistakes

| Mistake                       | How to Avoid                  | Covered In                          |
| ----------------------------- | ----------------------------- | ----------------------------------- |
| Starting tools without theory | Read fundamentals first       | [[0-Data-Engineering-Fundamentals]] |
| Skipping testing              | Write tests as you code       | [[dbt-Data-Build-Tool]]             |
| Not using version control     | Commit every day              | [[Git-GitHub]]                      |
| Hardcoding credentials        | Always use .env               | [[Docker-Fundamentals]]             |
| Building on local only        | Use Docker from day 1         | [[Docker-Fundamentals]]             |
| Complex pipelines from start  | Start simple, scale gradually | [[Apache-Airflow]]                  |

---

## 📚 Integration Map

How all documents connect:

```
Data-Engineering-Fundamentals-Updated
    ↓
[Concepts & why things matter]
    ↓
    ├─→ Docker-Fundamentals
    │       ↓
    │   Package code consistently
    │       ↓
    ├─→ Docker-Compose
    │       ↓
    │   Run multi-service locally
    │
    ├─→ Git-GitHub
    │       ↓
    │   Version control everything
    │
    ├─→ Apache-Airflow
    │       ↓
    │   Schedule automated workflows
    │
    ├─→ dbt-Data-Build-Tool
    │       ↓
    │   Transform with tests
    │
    ├─→ PySpark-Fundamentals
    │       ↓
    │   Scale to big data
    │
    └─→ Cloud-Data-Warehouses
            ↓
        Deploy to production
            ↓
        TOOLS-Learning-Roadmap-Updated
        [See how it all fits]
```

---

## 🎓 Before You Start

**Prerequisites:**
- [ ] Python basics (functions, loops, dicts) — from 1_PYTHON
- [ ] SQL basics (SELECT, WHERE, JOIN) — from 2_SQL
- [ ] Command line comfort (cd, ls, mkdir)
- [ ] Text editor (VS Code recommended)

**Install:**
```bash
python --version    # 3.8+
docker --version    # Latest
git --version       # Latest
```

---

## 🆘 Stuck? Here's How to Debug

1. **Conceptual confusion?**  
   → Re-read that section of [[0-Data-Engineering-Fundamentals]]

2. **Docker error?**  
   → Check "Tips & Gotchas" in [[Docker-Fundamentals]]

3. **DAG won't run?**  
   → See [[Apache-Airflow]] "Debugging" section

4. **dbt test failed?**  
   → Check [[dbt-Data-Build-Tool]] error handling

5. **Merge conflict?**  
   → See [[Git-GitHub]] "Resolving Conflicts"

6. **Git lost?**  
   → Use [[git-cheatsheet]] emergency commands

---

## 📞 Study Buddies & Resources

**Official Documentation:**
- Docker: https://docs.docker.com
- Airflow: https://airflow.apache.org/docs
- dbt: https://docs.getdbt.com
- Spark: https://spark.apache.org/docs/latest
- Git: https://git-scm.com/doc

**YouTube Channels:**
- Seattle Data Guy (data engineering tutorials)
- Coder2J (practical examples)
- Alex The Analyst (career guidance)

**Communities:**
- r/dataengineering
- Data Engineering Wiki
- Local tech meetups

---

## ✅ You're Ready When...

- [ ] You can explain data engineering to a friend
- [ ] You can build a Docker image from a Dockerfile
- [ ] You can write and run an Airflow DAG
- [ ] You can write dbt models with tests
- [ ] You understand ETL vs ELT
- [ ] You can commit code to Git properly
- [ ] You can troubleshoot basic pipeline issues
- [ ] You've built a complete end-to-end project

**Check all boxes?** → You're ready for Le Wagon! 🚀

---

## 🗓️ Timeline (Before Oct 31, 2026)

| Timeline | What | Status |
|----------|------|--------|
| Week 1-2 (by Jan 31) | Read fundamentals + TIER 1 | ⏳ In progress |
| Week 3-4 (by Feb 21) | Complete TIER 2 | 📋 Planned |
| Week 5-6 (by Mar 7) | Start TIER 3 | 📋 Planned |
| July-Sep | Deep dives + portfolio | 📋 Planned |
| Oct 1-30 | Final prep + mock projects | 📋 Planned |
| Oct 31 | Le Wagon Bootcamp Begins 🎉 | 🚀 Goal |

---

## 🏆 Your Success Metrics

By completion:

✅ Understand modern data engineering principles  
✅ Can containerize applications with Docker  
✅ Can orchestrate workflows with Airflow  
✅ Can transform data with dbt + testing  
✅ Can process large data with Spark  
✅ Can deploy to cloud warehouses  
✅ Can collaborate professionally with Git  
✅ Have portfolio project you're proud of  
✅ Confident for Le Wagon bootcamp  
✅ Job-ready as junior data engineer  

---

## 🚀 Next Steps

1. **Today:** Read [[0-Data-Engineering-Fundamentals]]
2. **Tomorrow:** Start [[Docker-Fundamentals]]
3. **This week:** Build first Docker container
4. **Next week:** Learn Airflow
5. **By Jan 31:** Complete TIER 1 + TIER 2

---

**Last Updated:** Jan 22, 2026  
**Designed for:** Benjamin (bootcamp start: Oct 31, 2026)  
**Total investment:** 27-35 hours  
**Expected outcome:** Job-ready junior data engineer
