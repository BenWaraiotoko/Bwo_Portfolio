---
title: SQL Learning Roadmap
date: 2026-01-22
publish: true
description: Complete SQL learning path for data engineers—5 pages of fundamentals to production patterns, aligned with Le Wagon bootcamp.
tags:
  - sql
  - learning-path
  - data-engineering
  - roadmap
category: second-brain - roadmap
---
# SQL Learning Roadmap

This roadmap organizes **5 comprehensive SQL guides** into a structured learning path. Follow this sequence to master SQL for data engineering before Le Wagon bootcamp.

---

## 📍 Quick Navigation

**Start here based on your SQL experience:**

- **🟢 Never written SQL:** Start with **TIER 1**
- **🟡 Written basic queries:** Start with **TIER 2**
- **🔴 Need production patterns:** Jump to **TIER 3**

---

## 🎯 TIER 1: SQL Fundamentals (10-12 hours)

Build mental models for querying databases. These are the building blocks for everything else.

| # | Topic | Page | Time | Learn |
|---|-------|------|------|-------|
| 1 | **SELECT, WHERE, ORDER BY, LIMIT** | [[01-SQL-Fundamentals]] | 3h | Query basics, filtering, sorting |
| 2 | **INNER, LEFT, RIGHT, FULL JOINs** | [[02-SQL-Joins]] | 4h | Connect data from multiple tables |
| 3 | **Aggregations & GROUP BY** | [[03-SQL-Aggregations]] | 3h | SUM, AVG, COUNT, GROUP BY, HAVING |

**Subtotal: ~10 hours**  
**After TIER 1 you can:** Write simple reports, extract data, connect multiple tables.

---

## 🚀 TIER 2: Advanced SQL (6-8 hours)

Add power to your queries. These patterns solve 80% of real-world problems.

| # | Topic | Page | Time | Learn |
|---|-------|------|------|-------|
| 4 | **Window Functions & CTEs** | [[04-SQL-Window-Functions]] | 4h | Ranking, running totals, complex queries |
| 5 | **PostgreSQL for Data Engineering** | [[05-PostgreSQL-for-Data-Engineering]] | 3h | Production architecture, indexing, transactions |

**Subtotal: ~7 hours** (cumulative: ~17 hours)  
**After TIER 2 you can:** Build complete ETL pipelines, optimize queries, design databases.

---

## 📊 Learning Path by Goal

### Goal: "I just need bootcamp basics"
Follow **TIER 1 only** (~10 hours)  
Time to complete: 1 week  
Bootcamp readiness: 70%

### Goal: "I want to be job-ready for data engineering"
Follow **TIER 1 + TIER 2** (~17 hours)  
Time to complete: 2 weeks  
Bootcamp readiness: 95%

---

## 🗓️ Le Wagon Timeline Alignment

### Before Bootcamp Starts (Oct 31, 2026)

| Milestone | Date | What to Know | Pages |
|-----------|------|--------------|-------|
| **Complete TIER 1** | By Oct 1 | Basic queries, JOINs, GROUP BY | 1-3 |
| **Complete TIER 2** | By Oct 25 | Window functions, production patterns | 4-5 |

### During Bootcamp (Nov 2026 - March 2027)

**Weeks 1-2:**  
You already know basic queries → focus on optimization  
**Reference:** [[01-SQL-Fundamentals]]

**Weeks 3-4:**  
Learn Airflow DAGs (writes SQL)  
**Reference:** [[02-SQL-Joins]], [[03-SQL-Aggregations]]

**Weeks 5+:**  
Build production pipelines with dbt/Airflow  
**Reference:** [[05-PostgreSQL-for-Data-Engineering]]

---

## 📝 Daily Study Workflow (45 min/day)

### Week 1-2 (TIER 1, Pages 1-3)
```
30 min: Read page + code examples
10 min: Solve practice query (with PostgreSQL locally)
5 min: Update your own notes
```

### Week 3 (TIER 2, Pages 4-5)
```
20 min: Read advanced concept
15 min: Apply to real dataset (Kaggle or your own)
10 min: Write one complex query
```

---

## 🎓 Before You Start: Prerequisites

You should:
- [ ] Have PostgreSQL/MySQL installed locally
- [ ] Understand what a database table is (columns/rows)
- [ ] Know how to open a SQL terminal/IDE (psql or GUI)

**If not:** Spend 1 hour on Codecademy "SQL Basics" first.

---

## ✅ Consolidation Checklist

### After TIER 1
- [ ] Write a query with SELECT, WHERE, ORDER BY, LIMIT
- [ ] Explain the difference between INNER and LEFT JOIN
- [ ] Use GROUP BY with HAVING to filter groups
- [ ] Join 3+ tables in a single query
- [ ] Explain when to use each join type

### After TIER 2
- [ ] Write a window function (ROW_NUMBER, RANK)
- [ ] Use PARTITION BY to rank within groups
- [ ] Create a CTE (WITH clause)
- [ ] Design a 3-layer database schema (staging/production/analytics)
- [ ] Create an index and explain why

---

## 🚨 Common Pitfalls (Don't Fall Into These!)

| Pitfall | Why It Matters | Fix |
|---------|----------------|-----|
| Using `SELECT *` in production | Slow, breaks if schema changes | Always specify columns |
| Forgetting to index WHERE columns | Queries slow down at scale | EXPLAIN every query |
| Not understanding NULL behavior | NULL comparisons fail silently | Use IS NULL, not = NULL |
| Mixing GROUP BY and non-grouped columns | Query fails or returns wrong data | All non-aggregated columns must be in GROUP BY |
| Not using transactions for multi-step ETL | Partial writes corrupt data | Always wrap ETL in BEGIN/COMMIT |

---

## 📚 Full Page Directory

| # | Title | Description | Time | Difficulty |
|---|-------|-------------|------|------------|
| 1 | [[01-SQL-Fundamentals]] | SELECT, WHERE, ORDER BY, LIMIT | 3h | 🟢 Beginner |
| 2 | [[02-SQL-Joins]] | INNER, LEFT, RIGHT, FULL OUTER JOINs | 4h | 🟢 Beginner |
| 3 | [[03-SQL-Aggregations]] | COUNT, SUM, AVG, GROUP BY, HAVING | 3h | 🟡 Intermediate |
| 4 | [[04-SQL-Window-Functions]] | ROW_NUMBER, RANK, CTEs, LAG/LEAD | 4h | 🔴 Advanced |
| 5 | [[05-PostgreSQL-for-Data-Engineering]] | Schemas, indexes, transactions, views, functions | 3h | 🔴 Advanced |

**Total: ~17 hours**  
**Recommended pace: 1.5 hours/day over 2 weeks**

---

## 🔗 Cross-Page Dependencies

```
┌──────────────────────────────┐
│ TIER 1: FUNDAMENTALS         │
├──────────────────────────────┤
│ Fundamentals (SELECT/WHERE)  │
│           ↓                   │
│ JOINs (connect tables)       │
│           ↓                   │
│ Aggregations (GROUP BY)      │
└──────────────────────────────┘
           ↓
┌──────────────────────────────┐
│ TIER 2: ADVANCED             │
├──────────────────────────────┤
│ Window Functions (ranking)   │
│                              │
│ PostgreSQL Patterns (prod)   │
└──────────────────────────────┘
```

---

## 🛠️ SQL Practice Resources

While learning from these pages, practice on:

- **LeetCode SQL:** Free, medium difficulty, good for interviews
- **HackerRank SQL:** Guided tutorials + challenges
- **Mode Analytics SQL:** Real-world datasets with hints
- **Your own data:** Best practice (use Kaggle or scrape)

---

## 🎯 Your First Project

After completing TIER 1:

```sql
-- Your mission: "Analyze a dataset with 3+ tables"
-- Requirements:
-- 1. Extract data using SELECT + WHERE
-- 2. Join at least 2 tables
-- 3. Use GROUP BY + HAVING to filter
-- 4. Sort results with ORDER BY
-- 5. Limit to top 10 rows

-- Example: "Find top 10 customers by total purchases"
SELECT 
    u.user_id,
    u.name,
    COUNT(o.order_id) as order_count,
    SUM(o.total) as lifetime_value
FROM users u
LEFT JOIN orders o ON u.user_id = o.user_id
GROUP BY u.user_id, u.name
HAVING COUNT(o.order_id) > 0
ORDER BY lifetime_value DESC
LIMIT 10;
```

---

## 📞 Getting Help

When you're stuck:

1. **Check the "Tips & Gotchas" section** in each page
2. **Use EXPLAIN** to see query performance
3. **Test incrementally** (write small queries, build up)
4. **Search for error message** (it usually tells you the problem)

---

## 🎉 Final Goal

By the end of this roadmap, you'll be able to:

✅ Write any query using SELECT, WHERE, JOINs, GROUP BY  
✅ Optimize slow queries with indexes  
✅ Design production database schemas  
✅ Build complete ETL pipelines in SQL  
✅ Debug data quality issues  
✅ Follow Le Wagon bootcamp from Day 1 without SQL knowledge gaps  

---

## 🚀 Next Steps

1. **Open your text editor** (VS Code, DataGrip, DBeaver)
2. **Open PostgreSQL/MySQL locally**
3. **Read [[01-SQL-Fundamentals]]** → first page
4. **Code every example** (don't just read)
5. **Write your own variations**

---

**Ready to start?** → Begin with [[01-SQL-Fundamentals]] ✨

**Questions?** Review the "Related" section at the bottom of each page for cross-references.

---

*This roadmap is designed for data engineers preparing for Le Wagon bootcamp. Total time investment: ~17 hours to master production-grade SQL.*
