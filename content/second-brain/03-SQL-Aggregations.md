---
title: SQL Aggregations & GROUP BY
date: 2026-01-22
publish: true
description: Master aggregation functions (COUNT, SUM, AVG, MAX, MIN) and GROUP BY to summarize data—essential for reporting and analysis.
tags:
  - sql
  - aggregations
  - group-by
  - data-engineering
category: second-brain
---
**Aggregations** turn raw rows into insights. Instead of "show me every transaction", you ask "what's our daily revenue?" GROUP BY does the heavy lifting.

---

## Aggregate Functions: The Five Essential

| Function | Purpose | Example |
|----------|---------|---------|
| `COUNT()` | Number of rows | How many orders? |
| `SUM()` | Add up a column | Total revenue? |
| `AVG()` | Average value | Average order size? |
| `MAX()` | Largest value | Highest price? |
| `MIN()` | Smallest value | Lowest price? |

---

## COUNT: Counting Rows

### Count All Rows

```sql
SELECT COUNT(*) as total_users
FROM users;
```

**Result:** `5000` (5000 rows in users table)

### Count Non-NULL Values

```sql
SELECT COUNT(phone) as users_with_phone
FROM users;
```

**Result:** `4200` (4200 users have a phone number, 800 are NULL)

### Count Distinct Values

```sql
SELECT COUNT(DISTINCT country) as unique_countries
FROM users;
```

**Result:** `42` (users are from 42 different countries)

### Multiple Counts

```sql
SELECT 
    COUNT(*) as total_orders,
    COUNT(customer_id) as orders_with_customer,
    COUNT(DISTINCT customer_id) as unique_customers
FROM orders;
```

---

## SUM, AVG, MAX, MIN

### Simple Aggregation

```sql
SELECT 
    SUM(total) as total_revenue,
    AVG(total) as avg_order_size,
    MAX(total) as largest_order,
    MIN(total) as smallest_order
FROM orders;
```

**Result:**
| total_revenue | avg_order_size | largest_order | smallest_order |
|---------------|----------------|---------------|----------------|
| 5,000,000     | 125.00         | 9,999.99      | 0.01           |

### Arithmetic with Aggregates

```sql
SELECT 
    COUNT(*) as num_orders,
    AVG(total) as avg_order,
    AVG(total) * 1.1 as avg_order_plus_10_percent
FROM orders;
```

---

## GROUP BY: Summarizing by Category

### Basic GROUP BY

```sql
SELECT category, COUNT(*) as product_count
FROM products
GROUP BY category;
```

**Result:**
| category     | product_count |
|--------------|---------------|
| electronics  | 1200          |
| books        | 800           |
| clothing     | 950           |

**How it works:**
1. Divide all rows into groups by category
2. For each group, count the rows
3. Return one row per category

### GROUP BY Multiple Columns

```sql
SELECT 
    category,
    supplier_id,
    COUNT(*) as product_count,
    AVG(price) as avg_price
FROM products
GROUP BY category, supplier_id;
```

**Result:**
| category     | supplier_id | product_count | avg_price |
|--------------|-------------|---------------|-----------|
| electronics  | 1           | 300           | 450.00    |
| electronics  | 2           | 150           | 399.99    |
| books        | 3           | 200           | 25.00     |

---

## HAVING: Filtering Groups

`WHERE` filters individual rows. `HAVING` filters groups.

### Basic HAVING

```sql
SELECT 
    category,
    COUNT(*) as product_count
FROM products
GROUP BY category
HAVING COUNT(*) > 100;
```

**Result:** Only categories with more than 100 products

| category    | product_count |
|-------------|---------------|
| electronics | 1200          |
| clothing    | 950           |

**Key difference:**
```sql
-- WHERE filters rows BEFORE grouping
WHERE price > 100

-- HAVING filters groups AFTER grouping
HAVING COUNT(*) > 5
```

### Multiple HAVING Conditions

```sql
SELECT 
    customer_id,
    COUNT(*) as order_count,
    SUM(total) as lifetime_value
FROM orders
GROUP BY customer_id
HAVING COUNT(*) > 5 
   AND SUM(total) > 1000;
```

**Result:** High-value customers (more than 5 orders, total > $1000)

---

## Common Aggregation Patterns

### Daily/Weekly/Monthly Totals

```sql
SELECT 
    DATE(order_date) as date,
    COUNT(*) as order_count,
    SUM(total) as daily_revenue
FROM orders
GROUP BY DATE(order_date)
ORDER BY date;
```

**Result:**
| date       | order_count | daily_revenue |
|------------|-------------|---------------|
| 2026-01-20 | 145         | 18,750.00     |
| 2026-01-21 | 152         | 19,200.00     |
| 2026-01-22 | 138         | 17,625.00     |

### Top N Analysis

```sql
SELECT 
    product_id,
    product_name,
    SUM(quantity) as total_sold,
    SUM(quantity * price) as revenue
FROM order_items
GROUP BY product_id, product_name
ORDER BY revenue DESC
LIMIT 10;
```

**Result:** Top 10 products by revenue

### Customer Cohorts

```sql
SELECT 
    EXTRACT(YEAR FROM created_at) as signup_year,
    EXTRACT(MONTH FROM created_at) as signup_month,
    COUNT(*) as new_users,
    SUM(lifetime_value) as cohort_value
FROM users
GROUP BY signup_year, signup_month
ORDER BY signup_year, signup_month;
```

### Data Quality Checks

```sql
-- Find categories with suspiciously low average prices
SELECT 
    category,
    COUNT(*) as product_count,
    AVG(price) as avg_price,
    MIN(price) as min_price,
    MAX(price) as max_price
FROM products
GROUP BY category
HAVING AVG(price) < 10 OR MAX(price) < 100;
```

---

## Subqueries with GROUP BY

### Filter Groups in Subquery

```sql
SELECT * FROM (
    SELECT 
        user_id,
        COUNT(*) as order_count,
        SUM(total) as total_spent
    FROM orders
    GROUP BY user_id
) user_stats
WHERE order_count > 10;
```

**Result:** Users with more than 10 orders

### Rank Groups

```sql
WITH category_stats AS (
    SELECT 
        category,
        COUNT(*) as product_count,
        AVG(price) as avg_price
    FROM products
    GROUP BY category
)
SELECT 
    category,
    product_count,
    avg_price,
    ROW_NUMBER() OVER (ORDER BY product_count DESC) as rank
FROM category_stats;
```

---

## NULL Handling in Aggregates

```sql
SELECT 
    COUNT(*) as total_rows,
    COUNT(phone) as rows_with_phone,
    COUNT(email) as rows_with_email,
    AVG(age) as avg_age  -- NULLs are ignored
FROM users;
```

**Key point:** `COUNT(*)` counts all rows (including NULLs). `COUNT(column)` counts non-NULL values only.

---

## Performance Tips

| Pattern | Performance | Why |
|---------|-------------|-----|
| GROUP BY indexed column | 🟢 Fast | Index helps |
| GROUP BY non-indexed | ⚠️ Medium | Full scan, then sort |
| Many groups (1000+) | 🔴 Slow | Large result set |
| HAVING before GROUP BY | 🔴 Wrong | HAVING is for post-group |

---

## Common Gotchas

- **Can't use non-aggregated columns in SELECT without GROUP BY.** This is an error:

```sql
-- ❌ Error: category is not aggregated
SELECT category, product_name, COUNT(*) as count
FROM products
GROUP BY category;

-- ✅ Correct: all non-aggregated columns in GROUP BY
SELECT category, COUNT(*) as count
FROM products
GROUP BY category;
```

- **HAVING vs WHERE.** You must use HAVING for aggregate conditions.

```sql
-- ❌ Error: WHERE doesn't work with aggregates
SELECT category, COUNT(*) as count
FROM products
WHERE COUNT(*) > 5
GROUP BY category;

-- ✅ Correct: use HAVING
SELECT category, COUNT(*) as count
FROM products
GROUP BY category
HAVING COUNT(*) > 5;
```

- **GROUP BY with ORDER BY.** Order after grouping.

```sql
SELECT 
    category,
    COUNT(*) as count
FROM products
GROUP BY category
ORDER BY count DESC;  -- Orders the grouped results
```

---

## Related

- [[01-SQL-Fundamentals]] — SELECT, WHERE, ORDER BY
- [[02-SQL-Joins]] — GROUP BY with JOINs
- [[04-SQL-Window-Functions]] — Advanced aggregations (running totals)
- [[05-PostgreSQL-for-Data-Engineering]] — Production aggregation patterns
- [[00-SQL-Learning-Roadmap]] — Your complete SQL learning path

---

**Key Takeaway:**  
GROUP BY divides data into buckets. Aggregate functions (COUNT, SUM, AVG, MAX, MIN) summarize each bucket. HAVING filters the results. Use this for reporting, analysis, and data quality checks.
