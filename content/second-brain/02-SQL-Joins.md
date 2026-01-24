---
title: SQL Joins (INNER, LEFT, RIGHT, FULL OUTER)
date: 2026-01-22
publish: true
description: Master the four join types—INNER, LEFT, RIGHT, FULL OUTER—to combine data from multiple tables. The most important SQL skill for data engineering.
tags:
  - sql
  - joins
  - data-engineering
  - fundamentals
category: second-brain
---
**Joins** are how you combine data from multiple tables. In data engineering, you'll spend 40% of your time writing joins. Master these four patterns and you can solve almost any problem.

---

## Mental Model: Venn Diagrams

Think of each table as a circle. The join type determines which data you keep:

```
Table A (users)     Table B (orders)
   Alice                 Order 1 (Alice)
   Bob                   Order 2 (Bob)
   Charlie               Order 3 (Alice)
                         Order 4 (Diana) ← Diana not in users
```

---

## INNER JOIN: Only Matching Rows

```sql
SELECT u.user_id, u.name, o.order_id, o.total
FROM users u
INNER JOIN orders o ON u.user_id = o.user_id;
```

**Result:** Only users who have orders

| user_id | name  | order_id | total |
|---------|-------|----------|-------|
| 1       | Alice | 101      | 150   |
| 2       | Bob   | 102      | 200   |
| 1       | Alice | 103      | 75    |

**Key points:**
- `ON` clause specifies the join condition (matching column)
- Only rows present in BOTH tables
- Filters out users without orders AND orders without users
- Most common join type

### Multiple INNER JOINs

```sql
SELECT u.name, o.order_id, p.product_name, oi.quantity
FROM users u
INNER JOIN orders o ON u.user_id = o.user_id
INNER JOIN order_items oi ON o.order_id = oi.order_id
INNER JOIN products p ON oi.product_id = p.product_id;
```

**Execution:** users → orders → order_items → products (each step filters further)

---

## LEFT JOIN: Keep Left Table, Match Right

```sql
SELECT u.user_id, u.name, o.order_id, o.total
FROM users u
LEFT JOIN orders o ON u.user_id = o.user_id;
```

**Result:** ALL users, matched with their orders (or NULL if no orders)

| user_id | name    | order_id | total |
|---------|---------|----------|-------|
| 1       | Alice   | 101      | 150   |
| 2       | Bob     | 102      | 200   |
| 1       | Alice   | 103      | 75    |
| 3       | Charlie | NULL     | NULL  |

**Key points:**
- Keeps ALL rows from left table (users)
- Matches right table if possible
- Right table columns become NULL if no match
- Perfect for "find users who haven't ordered yet"

### Find Missing Data

```sql
-- Users who haven't placed any orders
SELECT u.user_id, u.name
FROM users u
LEFT JOIN orders o ON u.user_id = o.user_id
WHERE o.order_id IS NULL;
```

**Result:** Only Charlie (the user with NULL order_id)

---

## RIGHT JOIN: Keep Right Table, Match Left

```sql
SELECT u.user_id, u.name, o.order_id, o.total
FROM users u
RIGHT JOIN orders o ON u.user_id = o.user_id;
```

**Result:** ALL orders, matched with their users (or NULL if no user)

| user_id | name    | order_id | total |
|---------|---------|----------|-------|
| 1       | Alice   | 101      | 150   |
| 2       | Bob     | 102      | 200   |
| 1       | Alice   | 103      | 75    |
| NULL    | NULL    | 104      | 300   |

**Key points:**
- Opposite of LEFT JOIN
- Keeps ALL rows from right table (orders)
- Matches left table if possible
- Useful for "find orders with unknown users" (data quality check)

**Pro tip:** RIGHT JOIN is rarely used in practice. Usually rewrite as LEFT JOIN:

```sql
-- ❌ Confusing
SELECT * FROM users u
RIGHT JOIN orders o ON u.user_id = o.user_id;

-- ✅ Clearer
SELECT * FROM orders o
LEFT JOIN users u ON o.user_id = u.user_id;
```

---

## FULL OUTER JOIN: All Rows, All Sides

```sql
SELECT u.user_id, u.name, o.order_id, o.total
FROM users u
FULL OUTER JOIN orders o ON u.user_id = o.user_id;
```

**Result:** EVERY user AND every order (matching where possible)

| user_id | name    | order_id | total |
|---------|---------|----------|-------|
| 1       | Alice   | 101      | 150   |
| 2       | Bob     | 102      | 200   |
| 1       | Alice   | 103      | 75    |
| 3       | Charlie | NULL     | NULL  |
| NULL    | NULL    | 104      | 300   |

**Key points:**
- Keeps ALL rows from BOTH tables
- Both sides can have NULLs
- Useful for "reconciliation" queries
- Not supported in MySQL; use UNION instead

### Full Outer Join (MySQL Alternative)

```sql
-- MySQL doesn't have FULL OUTER JOIN, use UNION
SELECT u.user_id, u.name, o.order_id, o.total
FROM users u
LEFT JOIN orders o ON u.user_id = o.user_id
UNION
SELECT u.user_id, u.name, o.order_id, o.total
FROM users u
RIGHT JOIN orders o ON u.user_id = o.user_id;
```

---

## Join Types Comparison

| Join Type | From Left | From Right | Use Case |
|-----------|-----------|-----------|----------|
| **INNER** | ✅ Match only | ✅ Match only | Normal data retrieval |
| **LEFT** | ✅ All | ✅ Match only | Find missing right data |
| **RIGHT** | ✅ Match only | ✅ All | Find unknown left data |
| **FULL OUTER** | ✅ All | ✅ All | Reconciliation/audits |

---

## Cross Join (Cartesian Product)

```sql
SELECT u.user_id, u.name, c.category_id, c.category_name
FROM users u
CROSS JOIN categories c;
```

**Result:** EVERY combination (user × category)

If 10 users and 5 categories → 50 rows

**Use cases:** Rare, but useful for generating all possible combinations

---

## Self Join (Join Table to Itself)

```sql
-- Find employees and their managers
SELECT e.emp_id, e.emp_name, m.emp_id, m.emp_name
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.emp_id;
```

**Result:**
| emp_id | emp_name | manager_id | manager_name |
|--------|----------|------------|--------------|
| 1      | Alice    | NULL       | NULL         |
| 2      | Bob      | 1          | Alice        |
| 3      | Charlie  | 1          | Alice        |

---

## Common Data Engineering Patterns

### Deduplication with JOIN

```sql
-- Keep only the most recent record per user
SELECT DISTINCT ON (u.user_id) u.*
FROM users u
ORDER BY u.user_id, u.updated_at DESC;
```

### Validation: Find Orphaned Records

```sql
-- Find orders without users (data quality check)
SELECT o.order_id, o.user_id
FROM orders o
LEFT JOIN users u ON o.user_id = u.user_id
WHERE u.user_id IS NULL;
```

### Reconciliation Between Systems

```sql
-- Compare staging vs production
SELECT 
    COALESCE(s.id, p.id) as record_id,
    s.value as staging_value,
    p.value as prod_value,
    CASE 
        WHEN s.id IS NULL THEN 'Only in staging'
        WHEN p.id IS NULL THEN 'Missing from prod'
        WHEN s.value != p.value THEN 'Value mismatch'
        ELSE 'Match'
    END as status
FROM staging.raw_data s
FULL OUTER JOIN production.clean_data p ON s.id = p.id;
```

### Three-Way Join

```sql
-- Get complete order details
SELECT 
    u.user_id,
    u.name,
    o.order_id,
    o.order_date,
    p.product_name,
    oi.quantity,
    oi.price
FROM users u
INNER JOIN orders o ON u.user_id = o.user_id
INNER JOIN order_items oi ON o.order_id = oi.order_id
INNER JOIN products p ON oi.product_id = p.product_id
ORDER BY u.user_id, o.order_date;
```

---

## Performance Tips

| Pattern | Performance | Why |
|---------|-------------|-----|
| Join on PRIMARY KEY | 🟢 Very Fast | Indexed |
| Join on foreign key | 🟢 Very Fast | Usually indexed |
| Join on non-indexed column | 🔴 Slow | Full table scan |
| Multiple JOINs | ⚠️ Depends | Each adds latency |
| Join on calculated column | 🔴 Slow | Can't use index |

---

## Tips & Gotchas

- **Table aliases are helpful for readability.** Especially with multiple tables.

```sql
-- ❌ Hard to read
SELECT users.user_id, users.name, orders.order_id
FROM users JOIN orders ON users.user_id = orders.user_id;

-- ✅ Clear
SELECT u.user_id, u.name, o.order_id
FROM users u
JOIN orders o ON u.user_id = o.user_id;
```

- **Ambiguous columns cause errors.** Use table prefix if column exists in both tables.

```sql
-- ❌ Error if both tables have 'id'
SELECT id FROM users JOIN orders ON ...

-- ✅ Clear
SELECT u.user_id, o.order_id FROM users u JOIN orders o ON ...
```

- **JOIN order matters for performance.** Start with smallest table.

```sql
-- Better if events is huge and users is small
SELECT * FROM users u
JOIN events e ON u.user_id = e.user_id;
```

- **NULL in JOIN conditions.** NULL never matches NULL.

```sql
-- Won't match rows where either side is NULL
ON u.user_id = o.user_id;

-- If you need to match NULLs:
ON COALESCE(u.user_id, -1) = COALESCE(o.user_id, -1);
```

---

## Related

- [[01-SQL-Fundamentals]] — SELECT, WHERE, ORDER BY, LIMIT
- [[03-SQL-Aggregations]] — GROUP BY with JOINs
- [[04-SQL-Window-Functions]] — Advanced row matching
- [[05-PostgreSQL-for-Data-Engineering]] — Production join patterns
- [[00-SQL-Learning-Roadmap]] — Your complete SQL learning path

---

**Key Takeaway:**  
INNER joins are the default (matches only). Use LEFT when you want to keep all left rows. Use FULL OUTER for reconciliation. Always use table aliases for clarity and performance.
