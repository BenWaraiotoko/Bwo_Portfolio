---
title: "Python Fundamentals: The Roadmap That Actually Makes Sense"
date: 2026-01-22
publish: true
category: posts
tags:
  - python
  - learning-path
  - data-engineering
description: "26 hours of Python, ordered so you stop guessing what to study next."
---

So here's the problem with learning Python: every resource tells you to "start from the basics" but nobody agrees on what the basics are, or in what order they should hit you. You end up bouncing between tutorials, half-learning list comprehensions before you've properly understood functions, wondering why nothing sticks.

This roadmap fixes that.

**11 guides. ~26 hours. One direction to travel.**

From loops to production ETL patterns — in the exact order that builds on itself instead of fighting you.

---

## Where Do You Start?

Pick your entry point:

- **🟢 New to coding:** Start with **TIER 1**
- **🟡 Coded before, rusty:** Jump into **TIER 2**
- **🔴 Know the basics, just need the gaps:** Go straight to **TIER 3**

---

## 🎯 TIER 1: Core Language Fundamentals (Weeks 1–4)

Build the mental models you'll use every single day. Don't skip this tier just because it looks simple — this is the foundation everything else sits on.

| # | Topic | Page | Time | What You'll Actually Learn |
|---|---|---|---|---|
| 1 | **Loops: for & while** | [[Python-Loops]] | 2h | When to repeat code, iteration mental models |
| 2 | **Control Flow: if/elif/else** | [[Python-Control-Flow]] | 2h | Decision logic, boolean operators, ternary |
| 3 | **Functions & Modules** | [[Python-Modules-Functions-Lists]] | 2.5h | Code organization, reusability, imports |
| 4 | **Lists (The Workhorse)** | [[Python-Modules-Functions-Lists]] | 2.5h | Indexing, slicing, methods, list operations |
| 5 | **List Comprehensions** | [[Python-List-Comprehensions]] | 2h | Pythonic transformations, filtering, performance |
| 6 | **Data Structures** | [[Python-Data-Structures]] | 2h | Lists, dicts, sets, tuples — when to use which |

**Subtotal: ~13 hours**

After TIER 1: you can write clean functions, loop over data, and read basic Python code without your brain hurting.

---

## 🚀 TIER 2: Production-Grade Fundamentals (Weeks 5–8)

Now write code that doesn't blow up in your face. Add safety nets, type clarity, and the kind of robustness that separates scripts from software.

| # | Topic | Page | Time | What You'll Actually Learn |
|---|---|---|---|---|
| 7 | **Type Hints (Advanced)** | [[Python-Type-Hints-Advanced]] | 2.5h | Optional, Union, Callable, mypy validation |
| 8 | **String Formatting & Methods** | [[Python-String-Formatting]] | 2h | F-strings, CSV parsing, data validation |
| 9 | **Error Handling & Exceptions** | [[Python-Error-Handling]] | 2.5h | try/except/finally, custom exceptions, retry logic |

**Subtotal: ~7 hours** (cumulative: ~20 hours)

After TIER 2: your functions handle failure gracefully, your data gets validated before it causes chaos, and you can read production code without flinching.

---

## 🏗️ TIER 3: Data Engineering Patterns (Weeks 9–12)

Integrate everything. This is where Python stops being an academic exercise and starts being a tool you'd actually use at work.

| # | Topic | Page | Time | What You'll Actually Learn |
|---|---|---|---|---|
| 10 | **OOP: Classes & Objects** | [[Python-Classes-and-OOP]] | 3h | Design patterns, encapsulation, inheritance |
| 11 | **Python for Data Engineering** | [[Python-for-Data-Engineering]] | 3h | pandas, ETL patterns, PySpark, production practices |

**Subtotal: ~6 hours** (cumulative: ~26 hours)

After TIER 3: you can build complete ETL pipelines, understand Airflow operators, and start thinking about scale.

---

## 📊 Learning Path by Goal

### "I just need the core stuff"
**TIER 1 only** — ~13 hours, ~2 weeks. You'll be functional.

### "I want to write code that works in production"
**TIER 1 + TIER 2** — ~20 hours, ~1 month. Solid foundation.

### "I want to actually get good at data engineering"
**All three tiers** — ~26 hours, ~2 months. That's the move.

---

## 📝 How to Actually Use This Roadmap

Sitting down to read documentation is a trap. Here's a workflow that makes it stick:

```
Weeks 1–4 (TIER 1):
├─ 40 min: Read + code every example on the page
├─ 15 min: Complete the mini-project (if there is one)
└─ 5 min: Write your own notes in your own words

Weeks 5–8 (TIER 2):
├─ 30 min: Read the advanced concepts
├─ 20 min: Apply them to something you've already written
└─ 10 min: Refactor an old project with what you just learned

Weeks 9–12 (TIER 3):
├─ 30 min: Read the data engineering patterns
├─ 25 min: Build something small — a mini ETL, a CSV processor
└─ 5 min: Document what you built and why it works
```

The key step that most people skip: **modifying the examples**. Don't just copy-paste and run. Change something. Break it deliberately. That's when the learning actually happens.

---

## 🎓 Before You Start: Honest Prerequisites Check

Answer yes to all of these before diving in:

- [ ] Can you write `x = 5; print(x)` and explain what it does?
- [ ] Do you know what `if`, `for`, and `while` roughly do?
- [ ] Can you explain what a function is — takes input, returns output?
- [ ] Are you comfortable running `python script.py` in a terminal?

If any of those are a "no" — spend 2 hours on Codecademy Python basics first. Come back here when you're done. No shame in it.

---

## 🚨 Common Pitfalls (Learn From My Mistakes)

| Pitfall | Why It Bites You | The Fix |
|---------|-----------------|---------|
| Skipping TIER 1 because "I know this" | You don't. You'll get lost later. | Discipline. Master loops and functions first. |
| Reading without coding | Reading ≠ learning programming | Type every code block. Modify it. Break it. |
| Ignoring type hints | Production code fails silently | Type hints catch bugs before they catch you |
| Not reading error messages | You'll waste hours debugging | Error messages tell you exactly what's wrong |
| Skipping error handling | Scripts die in production | try/except is not optional. TIER 2 explains this. |

---

## ✅ "Do I Actually Know This?" Checklists

### After TIER 1
- [ ] Write a function that loops through a list and returns transformed results
- [ ] Rewrite a loop as a list comprehension
- [ ] Explain when `while` beats `for` (and vice versa)
- [ ] Create a dict, access keys, iterate items
- [ ] Use `if/elif/else` with `and`/`or` operators

### After TIER 2
- [ ] Add type hints to three of your existing functions
- [ ] Parse a CSV line into a dict using `.split()` and `.strip()`
- [ ] Wrap a function in try/except, handle at least two specific exceptions
- [ ] Write a custom exception class with a meaningful message
- [ ] Use f-strings with formatting — `f"{value:.2f}"` style

### After TIER 3
- [ ] Design a class with `__init__` and two methods
- [ ] Create a pandas DataFrame from a list of dicts
- [ ] Write a complete ETL function: extract → transform → load
- [ ] Add proper logging to a pipeline (not just print statements)
- [ ] Explain when pandas is enough vs. when you'd reach for PySpark

---

## 📚 Full Guide Directory

| # | Title | What It Covers | Time | Level |
|---|-------|----------------|------|-------|
| 1 | [[Python-Loops]] | for/while, range(), break/continue | 2h | 🟢 Beginner |
| 2 | [[Python-Control-Flow]] | if/elif/else, boolean logic, ternary | 2h | 🟢 Beginner |
| 3 | [[Python-Modules-Functions-Lists]] | Modules, functions, list fundamentals | 2.5h | 🟢 Beginner |
| 4 | [[Python-List-Comprehensions]] | Pythonic transformations & filtering | 2h | 🟡 Intermediate |
| 5 | [[Python-Data-Structures]] | Lists, dicts, sets, tuples — the full picture | 2h | 🟡 Intermediate |
| 6 | [[Python-Type-Hints-Advanced]] | Optional, Union, Callable, mypy | 2.5h | 🟡 Intermediate |
| 7 | [[Python-String-Formatting]] | F-strings, string methods, CSV parsing | 2h | 🟡 Intermediate |
| 8 | [[Python-Error-Handling]] | try/except/finally, custom exceptions | 2.5h | 🟡 Intermediate |
| 9 | [[Python-Classes-and-OOP]] | Classes, inheritance, encapsulation | 3h | 🔴 Advanced |
| 10 | [[Python-for-Data-Engineering]] | pandas, ETL patterns, PySpark | 3h | 🔴 Advanced |
| 11 | [[Python-oop-bakery-analogy]] | OOP concepts explained with analogies | 2h | 🟡 Intermediate |

**Total: ~26.5 hours** at 1–2 hours/day = 2 to 3 months. Entirely doable.

---

## 🔗 How the Topics Connect

```
┌─────────────────────────────────────────────┐
│ TIER 1: FUNDAMENTALS                        │
├─────────────────────────────────────────────┤
│ Loops ──┐                                   │
│         ├─→ List Comprehensions             │
│ Control Flow ──→ Loops                      │
│ Functions ─┐                                │
│            ├─→ Modules (code organization)  │
│ Lists ──────┘                               │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ TIER 2: PRODUCTION GRADE                   │
├─────────────────────────────────────────────┤
│ Type Hints (improve your functions)         │
│ String Methods (parse & validate data)      │
│ Error Handling (robust, production-ready)   │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ TIER 3: DATA ENGINEERING                   │
├─────────────────────────────────────────────┤
│ Classes/OOP (Airflow operators build on this)│
│ Data Engineering (pandas, ETL, PySpark)     │
└─────────────────────────────────────────────┘
```

---

## When You're Stuck

1. **Check the "Related" section** at the bottom of each guide
2. **Search keywords** across all pages (Obsidian search has you covered)
3. **Look at "Tips & Gotchas"** — the common mistakes are already documented
4. **Just code it** — don't read a third time. Type it out and run it.

---

## 🎯 Where This Gets You

By the end of this roadmap:

✅ Clean, readable, production-grade Python — not just scripts that happen to run
✅ Debugging without panic
✅ Understanding and modifying real ETL pipelines
✅ Reviewing teammates' code and actually having something useful to say

That's the goal. Now go open Page 1 and start typing.
