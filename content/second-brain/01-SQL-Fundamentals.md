---
title: SQL Fundamentals (SELECT, WHERE, ORDER BY, LIMIT)
date: 2026-01-22
publish: true
description: Master the foundation of SQL—selecting, filtering, sorting, and limiting data. Essential for every query you'll write.
tags:
  - sql
  - fundamentals
  - data-engineering
category: second-brain
---
**SQL** is the language of databases. Every data engineer writes SQL every single day—extracting data, validating it, loading it into warehouses. Master these fundamentals first, and everything else builds naturally.

---

## Basic Query Structure

Every SQL query follows this pattern:

```sql
SELECT   column1, column2          -- What data to retrieve
FROM     table_name               -- Where to get it
WHERE    condition                -- Filter rows
ORDER BY column1 DESC             -- Sort results
LIMIT    10;                      -- How many rows
```

**Execution order (internal):** FROM → WHERE → SELECT → ORDER BY → LIMIT

---

## SELECT: Choosing Columns

### Select All Columns

```sql
SELECT * FROM users;
```

**Output:** Every column from the users table

### Select Specific Columns

```sql
SELECT id, name, email FROM users;
```

**Output:** Only id, name, email columns

**Why be specific?**
- Faster queries (fewer bytes transferred)
- More readable code
- Avoids unexpected columns if table schema changes

### Column Aliases (Rename Output)

```sql
SELECT 
    id AS user_id,
    name AS full_name,
    email AS contact_email
FROM users;
```

**Output:** Columns renamed in results (doesn't change table)

### Arithmetic in SELECT

```sql
SELECT 
    product_name,
    price,
    quantity,
    price * quantity AS total_value
FROM inventory;
```

**Output:** Calculate new columns on the fly

---

## WHERE: Filtering Rows

### Basic Filtering

```sql
-- Exact match
SELECT * FROM users WHERE status = 'active';

-- Numeric comparison
SELECT * FROM orders WHERE total > 100;

-- Date comparison
SELECT * FROM transactions WHERE created_at > '2026-01-01';
```

### Multiple Conditions

```sql
-- AND: both must be true
SELECT * FROM orders 
WHERE status = 'completed' 
  AND total > 100;

-- OR: at least one must be true
SELECT * FROM products 
WHERE category = 'electronics' 
  OR category = 'computers';

-- NOT: negate condition
SELECT * FROM users 
WHERE NOT status = 'inactive';
```

### Pattern Matching (LIKE)

```sql
-- Starts with 'john'
SELECT * FROM users WHERE name LIKE 'john%';

-- Contains 'gmail'
SELECT * FROM users WHERE email LIKE '%gmail%';

-- Ends with '.org'
SELECT * FROM websites WHERE domain LIKE '%.org';

-- Exactly 5 characters
SELECT * FROM products WHERE code LIKE '_____';
```

**Wildcards:**
- `%` = any characters (0 or more)
- `_` = single character

### IN Operator (Multiple Values)

```sql
-- Instead of: OR category = 'x' OR category = 'y'
SELECT * FROM products 
WHERE category IN ('electronics', 'books', 'clothing');

-- Opposite: NOT IN
SELECT * FROM users 
WHERE country NOT IN ('USA', 'Canada');
```

### Between Operator (Ranges)

```sql
-- Age between 18 and 65
SELECT * FROM users 
WHERE age BETWEEN 18 AND 65;

-- Date range
SELECT * FROM sales 
WHERE sale_date BETWEEN '2026-01-01' AND '2026-12-31';
```

### NULL Checking

```sql
-- Find nulls
SELECT * FROM users WHERE phone IS NULL;

-- Find non-nulls
SELECT * FROM users WHERE phone IS NOT NULL;
```

---

## ORDER BY: Sorting Results

### Ascending (Default)

```sql
SELECT * FROM users 
ORDER BY created_at;  -- Oldest first
```

### Descending

```sql
SELECT * FROM users 
ORDER BY created_at DESC;  -- Newest first
```

### Multiple Columns

```sql
SELECT * FROM orders 
ORDER BY customer_id ASC, order_date DESC;
```

**Execution:** First sort by customer_id, then within each customer, sort by order_date descending.

### Sort by Expression

```sql
SELECT name, price, quantity 
FROM inventory 
ORDER BY price * quantity DESC;  -- Sort by total value
```

---

## LIMIT: Restricting Result Set

### Basic LIMIT

```sql
SELECT * FROM users LIMIT 10;  -- Get first 10 rows
```

### LIMIT with OFFSET (Pagination)

```sql
-- Get rows 11-20
SELECT * FROM users 
LIMIT 10 OFFSET 10;

-- Alternative syntax (depends on database)
SELECT * FROM users 
LIMIT 10, 10;  -- Skip 10, get 10
```

**Use case:** "Show me 20 items per page" → Page 1: `LIMIT 20 OFFSET 0`, Page 2: `LIMIT 20 OFFSET 20`

### Get Top N (Most Common Pattern)

```sql
-- Top 5 highest revenue orders
SELECT order_id, customer_id, total 
FROM orders 
ORDER BY total DESC 
LIMIT 5;

-- Top 3 customers by purchase count
SELECT customer_id, COUNT(*) as order_count 
FROM orders 
GROUP BY customer_id 
ORDER BY order_count DESC 
LIMIT 3;
```

---

## Common Patterns for Data Engineering

### Sampling Large Tables

```sql
-- Get 1% random sample of a table
SELECT * FROM large_table 
ORDER BY RANDOM() 
LIMIT (SELECT COUNT(*) / 100 FROM large_table);
```

### Find Oldest/Newest Records

```sql
-- Most recent 5 transactions per user
SELECT * FROM (
    SELECT *, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) as rn
    FROM transactions
) ranked
WHERE rn <= 5;
```

### Duplicates Check

```sql
-- Find users with duplicate emails
SELECT email, COUNT(*) as count 
FROM users 
GROUP BY email 
HAVING COUNT(*) > 1;
```

### Data Quality Check

```sql
-- Check for suspicious values
SELECT * FROM orders 
WHERE total < 0 
   OR total > 1000000
   OR customer_id IS NULL;
```

---

## Performance Tips

| Action | Performance | Why |
|--------|-------------|-----|
| `SELECT *` | 🔴 Slow | Transfers unnecessary columns |
| `SELECT col1, col2` | 🟢 Fast | Only needed data |
| `WHERE` early | 🟢 Fast | Filters before processing |
| `LIMIT` large numbers | 🔴 Slow | Still processes all rows |
| Index on WHERE columns | 🟢 Very Fast | Database optimization |

---

## SQL vs Python (Mental Model)

| Operation | SQL | Python |
|-----------|-----|--------|
| Select columns | `SELECT name, email` | `df[['name', 'email']]` |
| Filter rows | `WHERE age > 25` | `df[df['age'] > 25]` |
| Sort | `ORDER BY created_at DESC` | `df.sort_values('created_at', ascending=False)` |
| Limit | `LIMIT 10` | `df.head(10)` |

---

## Tips & Gotchas

- **LIMIT without ORDER BY is unreliable.** If you want "top 10", always specify ORDER BY.

```sql
-- ❌ Unclear which 10 you're getting
SELECT * FROM users LIMIT 10;

-- ✅ Clear intent
SELECT * FROM users ORDER BY created_at DESC LIMIT 10;
```

- **NULL comparisons need IS NULL.** `= NULL` doesn't work in SQL.

```sql
-- ❌ Wrong
SELECT * FROM users WHERE email = NULL;

-- ✅ Correct
SELECT * FROM users WHERE email IS NULL;
```

- **LIKE is slow on large tables.** Use indexes or full-text search for production.

```sql
-- Slow
SELECT * FROM users WHERE email LIKE '%gmail%';

-- Faster (if you know pattern)
SELECT * FROM users WHERE email LIKE 'gmail@%';
```

- **String comparisons are case-sensitive (usually).** Use LOWER() to normalize.

```sql
-- Might miss 'John', 'JOHN'
SELECT * FROM users WHERE name = 'john';

-- More reliable
SELECT * FROM users WHERE LOWER(name) = 'john';
```

- **BETWEEN is inclusive on both ends.**

```sql
BETWEEN 1 AND 10  -- Includes 1 and 10
```

---

## Related

- [[02-SQL-Joins]] — Connect data from multiple tables
- [[03-SQL-Aggregations]] — GROUP BY, aggregate functions, HAVING
- [[04-SQL-Window-Functions]] — Advanced ranking, running totals
- [[05-PostgreSQL-for-Data-Engineering]] — Production database patterns
- [[00-SQL-Learning-Roadmap]] — Your complete SQL learning path

---

**Key Takeaway:**  
Every complex SQL query is built on these four building blocks: SELECT what you need, WHERE to filter, ORDER BY to sort, LIMIT to restrict. Master these first, add complexity incrementally.
