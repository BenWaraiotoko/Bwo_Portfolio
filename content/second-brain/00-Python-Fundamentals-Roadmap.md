---
title: Python Fundamentals Learning Roadmap
date: 2026-01-22
publish: true
description: Complete guide to Python fundamentals for data engineering—ordered learning path with estimated study time and Le Wagon bootcamp alignment.
tags:
  - python
  - learning-path
  - data-engineering
  - le-wagon-prep
category: second-brain - roadmap
---
# Python Fundamentals: Complete Learning Roadmap

Welcome to your second brain Python reference library. This page organizes **11 comprehensive guides** into a structured learning path. Follow this sequence to build unshakeable Python fundamentals before Le Wagon bootcamp (October 2026).

---

## 📍 Quick Navigation

**Start here based on your level:**

- **🟢 Beginner (haven't coded much):** Start with **TIER 1**
- **🟡 Intermediate (coded before):** Start with **TIER 2**
- **🔴 Advanced (need just the gaps):** Jump to **TIER 3**

---

## 🎯 TIER 1: Core Language Fundamentals (Weeks 1-4)

Build the mental models you'll use every day. Master these before touching data libraries.

| # | Topic | Page | Time | Learn |
|---|---|---|---|---|
| 1 | **Loops: for & while** | [[01-Python-Loops]] | 2h | When to repeat code, mental models for iteration |
| 2 | **Control Flow: if/elif/else** | [[02-Python-Control-Flow]] | 2h | Decision-making logic, boolean operators, ternary |
| 3 | **Functions & Modules** | [[03-Python-Modules-Functions-Lists]] | 2.5h | Code organization, reusability, imports |
| 4 | **Lists (The Workhorse)** | [[03-Python-Modules-Functions-Lists]] | 2.5h | Indexing, slicing, methods, list operations |
| 5 | **List Comprehensions** | [[04-Python-List-Comprehensions]] | 2h | Pythonic transformations, filtering, performance |
| 6 | **Data Structures** | [[05-Python-Data-Structures]] | 2h | Lists, dicts, sets, tuples—when to use each |


**Subtotal: ~13 hours**  
**After TIER 1 you can:** Write clean functions, loop over data, understand basic Python code.

---

## 🚀 TIER 2: Production-Grade Fundamentals (Weeks 5-8)

Now write code that doesn't crash. Add safety nets, clarity, and robustness.

| #   | Topic                           | Page                           | Time | Learn                                              |
| --- | ------------------------------- | ------------------------------ | ---- | -------------------------------------------------- |
| 7   | **Type Hints (Advanced)**       | [[06-Python-Type-Hints-Advanced]] | 2.5h | Optional, Union, Callable, mypy validation         |
| 8   | **String Formatting & Methods** | [[07-Python-String-Formatting]]   | 2h   | F-strings, parsing CSVs, data validation           |
| 9   | **Error Handling & Exceptions** | [[08-Python-Error-Handling]]      | 2.5h | try/except/finally, custom exceptions, retry logic |

**Subtotal: ~7 hours** (cumulative: ~20 hours)  
**After TIER 2 you can:** Write production-grade functions, validate data, handle failures gracefully, log events.

---

## 🏗️ TIER 3: Data Engineering Patterns (Weeks 9-12)

Integrate everything. Build real ETL pipelines and understand distributed computing.

| # | Topic | Page | Time | Learn |
|---|---|---|---|---|
| 10 | **OOP: Classes & Objects** | [[09-Python-Classes-and-OOP]] | 3h | Design patterns, encapsulation, inheritance |
| 11 | **Python for Data Engineering** | [[10-Python-for-Data-Engineering]] | 3h | pandas, ETL patterns, PySpark, production practices |

**Subtotal: ~6 hours** (cumulative: ~26 hours)  
**After TIER 3 you can:** Build complete ETL pipelines, understand Airflow operators, scale to Spark.

---

## 📊 Learning Path by Goal

### Goal: "I just need bootcamp basics"
Follow **TIER 1 only** (~13 hours)  
Time to complete: 2 weeks  
Bootcamp readiness: 70%

### Goal: "I want to be job-ready"
Follow **TIER 1 + TIER 2** (~20 hours)  
Time to complete: 1 month  
Bootcamp readiness: 90%

### Goal: "I want to master data engineering"
Follow **TIER 1 + TIER 2 + TIER 3** (~26 hours)  
Time to complete: 2 months  
Bootcamp readiness: 100% + ahead of class

---

## 🗓️ Le Wagon Timeline Alignment

### Before Bootcamp Starts (Oct 31, 2026)

| Milestone | Date | What to Know | Pages |
|-----------|------|--------------|-------|
| **Complete TIER 1** | By Aug 31 | Functions, loops, lists | 1-6 |
| **Complete TIER 2** | By Sep 30 | Type hints, error handling | 7-9 |
| **Start TIER 3** | By Oct 15 | Basic OOP, pandas intro | 10-11 |

### During Bootcamp (Nov 2026 - March 2027)

**Weeks 1-2:**  
You already know loops/functions → focus on pandas & SQL joins  
**Reference:** [[10-Python-for-Data-Engineering]]

**Weeks 3-4:**  
Learn Airflow orchestration (builds on classes/OOP)  
**Reference:** [[09-Python-Classes-and-OOP]]

**Weeks 5+:**  
PySpark, distributed processing, production patterns  
**Reference:** [[10-Python-for-Data-Engineering]] (Tier 2: Scaling section)

---

## 📝 Study Strategy

### Daily Workflow (60 min/day)

```
Week 1-4 (TIER 1):
├─ 40 min: Read + code examples from page
├─ 15 min: Complete mini-project (if provided)
└─ 5 min: Update your own notes

Week 5-8 (TIER 2):
├─ 30 min: Read advanced concepts
├─ 20 min: Apply to your own code
└─ 10 min: Refactor old projects with new knowledge

Week 9-12 (TIER 3):
├─ 30 min: Read data engineering patterns
├─ 25 min: Build small ETL project
└─ 5 min: Document learnings
```

### How to Use This Roadmap

1. **Start with TIER 1, Page 1** → Read until you understand the concept
2. **Code along** → Copy examples, modify them, break them intentionally
3. **Mini-project** → If page has one, complete it (weather ETL, etc.)
4. **Link references** → Click `[[Related]]` links when you need context
5. **Consolidate** → Review one page per week once you've finished TIER 1

---

## 🎓 Before You Start: Prerequisites Check

You should be able to answer "yes" to all:

- [ ] Can you write `x = 5; print(x)` and understand what happens?
- [ ] Do you know what `if`, `for`, `while` keywords do (roughly)?
- [ ] Can you explain what a function is (takes input, returns output)?
- [ ] Are you comfortable with the command line (running `python script.py`)?

**If any are "no":** Spend 2 hours on Codecademy Python basics first, then come back here.

---

## 🚨 Common Pitfalls (Don't Fall Into These!)

| Pitfall | Why It Matters | Fix |
|---------|----------------|-----|
| Skipping TIER 1 basics | You'll get confused later | Discipline yourself to master loops/functions first |
| Not coding the examples | Reading ≠ learning programming | Type every code block, modify it, break it |
| Ignoring type hints | Production code breaks silently | Type hints catch bugs early (mypy helps) |
| Not understanding errors | You'll waste hours debugging | Read error messages carefully; they tell you what's wrong |
| Forgetting try/except | Scripts crash in production | Error handling is not optional (see TIER 2) |

---

## ✅ Consolidation Checklist

After completing each TIER, verify your knowledge:

### After TIER 1
- [ ] Write a function that loops through a list and returns transformed results
- [ ] Use list comprehensions instead of loops
- [ ] Explain when to use a `while` loop vs. a `for` loop
- [ ] Create a dict, access keys, iterate items
- [ ] Use `if/elif/else` with `and`/`or` operators

### After TIER 2
- [ ] Add type hints to your functions (int, str, list[dict])
- [ ] Parse a CSV line into a dict using `.split()` and `.strip()`
- [ ] Wrap code in try/except and handle specific exceptions
- [ ] Write a custom exception class
- [ ] Use f-strings with formatting (e.g., `f"{value:.2f}"`)

### After TIER 3
- [ ] Design a class with `__init__` and methods
- [ ] Create a simple pandas DataFrame from a list of dicts
- [ ] Write a complete ETL function: extract → transform → load
- [ ] Add logging to your pipeline
- [ ] Explain when to use pandas vs. PySpark

---

## 📚 Full Page Directory

| # | Title | Description | Time | Difficulty |
|---|-------|-------------|------|------------|
| 1 | [[01-Python-Loops]] | for/while loops, range(), break/continue | 2h | 🟢 Beginner |
| 2 | [[02-Python-Control-Flow]] | if/elif/else, boolean logic, ternary | 2h | 🟢 Beginner |
| 3 | [[03-Python-Modules-Functions-Lists]] | Modules, functions, lists fundamentals | 2.5h | 🟢 Beginner |
| 4 | [[04-Python-List-Comprehensions]] | Pythonic list transformations & filtering | 2h | 🟡 Intermediate |
| 5 | [[05-Python-Data-Structures]] | Lists, dicts, sets, tuples—complete guide | 2h | 🟡 Intermediate |
| 6 | [[06-Python-Type-Hints-Advanced]] | Optional, Union, Callable, mypy | 2.5h | 🟡 Intermediate |
| 7 | [[07-Python-String-Formatting]] | F-strings, string methods, parsing CSVs | 2h | 🟡 Intermediate |
| 8 | [[08-Python-Error-Handling]] | try/except/finally, custom exceptions | 2.5h | 🟡 Intermediate |
| 9 | [[09-Python-Classes-and-OOP]] | Classes, inheritance, encapsulation | 3h | 🔴 Advanced |
| 10 | [[10-Python-for-Data-Engineering]] | pandas, ETL patterns, PySpark | 3h | 🔴 Advanced |
| 11 | [[09-1-python-oop-bakery-analogy]] | Interactive OOP tutorial with analogies | 2h | 🟡 Intermediate |

**Total: ~26.5 hours**  
**Recommended pace: 1-2 hours/day over 2-3 months**

---

## 🔗 Cross-Topic Dependencies

```
┌─────────────────────────────────────────────┐
│ TIER 1: FUNDAMENTALS                        │
├─────────────────────────────────────────────┤
│ Loops ──┐                                    │
│         ├─→ List Comprehensions              │
│ Control Flow ──→ Loops                       │
│ Functions ─┐                                 │
│            ├─→ Modules (code organization)   │
│ Lists ──────┘                                │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ TIER 2: PRODUCTION GRADE                    │
├─────────────────────────────────────────────┤
│ Type Hints (improve functions)               │
│ String Methods (parse & validate data)       │
│ Error Handling (robust functions)            │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ TIER 3: DATA ENGINEERING                    │
├─────────────────────────────────────────────┤
│ Classes/OOP (Airflow operators, later)       │
│ Data Engineering (pandas, ETL, PySpark)      │
└─────────────────────────────────────────────┘
```

---

## 📞 Getting Help

When you're stuck:

1. **Check the "Related" section** at the bottom of each page
2. **Search for keywords** in all pages (Obsidian search)
3. **Look at "Tips & Gotchas"** — common mistakes are listed
4. **Code it out** — don't just read; type and run examples

---

## 🎯 Final Goal

By the end of this roadmap, you'll be able to:

✅ Write clean, readable, production-grade Python code  
✅ Debug errors confidently  
✅ Understand and modify real ETL pipelines  
✅ Follow Le Wagon bootcamp from Day 1 without feeling lost  
✅ Help teammates review their code 