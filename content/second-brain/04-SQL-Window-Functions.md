---
title: SQL Window Functions & CTEs
date: 2026-01-22
publish: true
description: Master ranking, running totals, and CTEs—advanced SQL patterns that separate junior from senior data engineers.
tags:
  - sql
  - window-functions
  - ctes
  - advanced
  - data-engineering
category: second-brain
---
**Window functions** and **CTEs** are where SQL stops being simple and becomes powerful. These patterns let you do complex analytics that would be impossible (or slow) with GROUP BY alone.

---

## Window Functions: Overview

A window function operates on a "window" of rows around the current row, without collapsing them.

### Compare: GROUP BY vs Window Functions

```sql
-- GROUP BY: collapses rows (reduces row count)
SELECT category, COUNT(*) as product_count
FROM products
GROUP BY category;
-- Result: 1 row per category

-- Window Function: keeps all rows (each gets a window calculation)
SELECT 
    product_id, 
    product_name, 
    category,
    COUNT(*) OVER (PARTITION BY category) as category_product_count
FROM products;
-- Result: Every product row, plus category count
```

---

## Ranking Window Functions

### ROW_NUMBER: Sequential Ranking

```sql
SELECT 
    user_id,
    name,
    purchase_total,
    ROW_NUMBER() OVER (ORDER BY purchase_total DESC) as rank
FROM users;
```

**Result:** Every user gets a unique sequential number (1, 2, 3...)

| user_id | name  | purchase_total | rank |
|---------|-------|-----------------|------|
| 5       | Alice | 5000            | 1    |
| 3       | Bob   | 4500            | 2    |
| 1       | Carol | 4500            | 3    |
| 2       | Diana | 3000            | 4    |

**Key:** Even if Bob and Carol have same total, they get different ranks (2 vs 3)

### RANK: Ranks with Ties

```sql
SELECT 
    user_id,
    name,
    purchase_total,
    RANK() OVER (ORDER BY purchase_total DESC) as rank
FROM users;
```

**Result:** Ties get the SAME rank

| user_id | name  | purchase_total | rank |
|---------|-------|-----------------|------|
| 5       | Alice | 5000            | 1    |
| 3       | Bob   | 4500            | 2    |
| 1       | Carol | 4500            | 2    |
| 2       | Diana | 3000            | 4    |

**Note:** There's no rank 3 (skipped because of the tie)

### DENSE_RANK: Ranks without Gaps

```sql
SELECT 
    user_id,
    name,
    purchase_total,
    DENSE_RANK() OVER (ORDER BY purchase_total DESC) as dense_rank
FROM users;
```

**Result:** Ties get same rank, no gaps

| user_id | name  | purchase_total | dense_rank |
|---------|-------|-----------------|------------|
| 5       | Alice | 5000            | 1          |
| 3       | Bob   | 4500            | 2          |
| 1       | Carol | 4500            | 2          |
| 2       | Diana | 3000            | 3          |

**Note:** Rank 3 is used (no gap)

### When to Use Which

| Function | Use When | Example |
|----------|----------|---------|
| **ROW_NUMBER** | You want unique ranks (pagination) | "Give me rows 10-20" |
| **RANK** | You want to show ties, respect gaps | "Top 3 performers" (2 tied for 2nd) |
| **DENSE_RANK** | You want to show ties, no gaps | "Top 3 categories" |

---

## Ranking Within Groups (PARTITION BY)

### Top N Per Category

```sql
SELECT 
    product_id,
    product_name,
    category,
    price,
    ROW_NUMBER() OVER (PARTITION BY category ORDER BY price DESC) as rank_in_category
FROM products;
```

**Result:** Each product ranked within its category

| product_id | product_name | category     | price | rank_in_category |
|------------|--------------|--------------|-------|------------------|
| 101        | MacBook Pro  | electronics  | 1999  | 1                |
| 102        | iPhone       | electronics  | 999   | 2                |
| 201        | Hemingway    | books        | 25    | 1                |
| 202        | Orwell       | books        | 15    | 2                |

### Get Top N Per Group

```sql
SELECT * FROM (
    SELECT 
        product_id,
        product_name,
        category,
        price,
        ROW_NUMBER() OVER (PARTITION BY category ORDER BY price DESC) as rank_in_category
    FROM products
) ranked
WHERE rank_in_category <= 3;
```

**Result:** Top 3 products per category

---

## Aggregate Window Functions

### Running Total

```sql
SELECT 
    order_date,
    order_id,
    total,
    SUM(total) OVER (ORDER BY order_date) as running_total
FROM orders;
```

**Result:** Cumulative sum over time

| order_date | order_id | total | running_total |
|------------|----------|-------|---------------|
| 2026-01-01 | 1        | 100   | 100           |
| 2026-01-02 | 2        | 150   | 250           |
| 2026-01-02 | 3        | 200   | 450           |
| 2026-01-03 | 4        | 50    | 500           |

### Average Over Last N Rows

```sql
SELECT 
    order_date,
    order_id,
    total,
    AVG(total) OVER (
        ORDER BY order_date 
        ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
    ) as avg_last_3
FROM orders;
```

**Result:** 3-day moving average

| order_date | order_id | total | avg_last_3 |
|------------|----------|-------|------------|
| 2026-01-01 | 1        | 100   | 100.00     |
| 2026-01-02 | 2        | 150   | 125.00     |
| 2026-01-02 | 3        | 200   | 150.00     |
| 2026-01-03 | 4        | 50    | 150.00     |

---

## LAG & LEAD: Access Previous/Next Rows

### Compare to Previous Row

```sql
SELECT 
    order_date,
    total,
    LAG(total) OVER (ORDER BY order_date) as previous_total,
    total - LAG(total) OVER (ORDER BY order_date) as change
FROM orders;
```

**Result:** Day-over-day change

| order_date | total | previous_total | change |
|------------|-------|----------------|--------|
| 2026-01-01 | 1000  | NULL           | NULL   |
| 2026-01-02 | 1150  | 1000           | 150    |
| 2026-01-03 | 950   | 1150           | -200   |

### Find Gaps in Sequence

```sql
SELECT 
    transaction_id,
    LAG(transaction_id) OVER (ORDER BY transaction_id) as prev_id,
    transaction_id - LAG(transaction_id) OVER (ORDER BY transaction_id) - 1 as gap
FROM transactions;
```

**Result:** Find missing transaction IDs

---

## CTEs (Common Table Expressions)

CTEs are temporary named queries you can reference. Think of them as "temporary tables in memory".

### Basic CTE

```sql
WITH user_totals AS (
    SELECT 
        user_id,
        COUNT(*) as order_count,
        SUM(total) as lifetime_value
    FROM orders
    GROUP BY user_id
)
SELECT * FROM user_totals
WHERE lifetime_value > 1000;
```

**Equivalent to:** A subquery, but more readable

### Multiple CTEs

```sql
WITH daily_revenue AS (
    SELECT 
        DATE(order_date) as date,
        SUM(total) as revenue
    FROM orders
    GROUP BY DATE(order_date)
),
daily_orders AS (
    SELECT 
        DATE(order_date) as date,
        COUNT(*) as order_count
    FROM orders
    GROUP BY DATE(order_date)
)
SELECT 
    d.date,
    d.revenue,
    o.order_count,
    d.revenue / o.order_count as avg_order_size
FROM daily_revenue d
JOIN daily_orders o ON d.date = o.date;
```

### Recursive CTE (Generate Series)

```sql
WITH RECURSIVE dates AS (
    SELECT DATE '2026-01-01' as date
    UNION ALL
    SELECT date + INTERVAL 1 DAY
    FROM dates
    WHERE date < DATE '2026-12-31'
)
SELECT date FROM dates;
```

**Result:** Every date in 2026

---

## Complex Real-World Patterns

### Find Churn (Customers Who Stopped Buying)

```sql
WITH customer_months AS (
    SELECT 
        user_id,
        DATE_TRUNC('month', order_date) as month
    FROM orders
    GROUP BY user_id, DATE_TRUNC('month', order_date)
),
month_numbers AS (
    SELECT 
        user_id,
        month,
        ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY month) as month_num,
        LAG(month) OVER (PARTITION BY user_id ORDER BY month) as prev_month
    FROM customer_months
)
SELECT 
    user_id,
    prev_month,
    month,
    (month - prev_month) > INTERVAL 1 MONTH as churned
FROM month_numbers
WHERE churned = TRUE;
```

**Result:** Users who skipped at least one month

### Cohort Analysis

```sql
WITH user_cohorts AS (
    SELECT 
        user_id,
        DATE_TRUNC('month', MIN(order_date)) as cohort_month,
        DATE_TRUNC('month', order_date) as order_month
    FROM orders
    GROUP BY user_id, DATE_TRUNC('month', order_date)
),
cohort_ages AS (
    SELECT 
        cohort_month,
        order_month,
        (EXTRACT(YEAR FROM order_month) - EXTRACT(YEAR FROM cohort_month)) * 12 +
        (EXTRACT(MONTH FROM order_month) - EXTRACT(MONTH FROM cohort_month)) as months_since_cohort
    FROM user_cohorts
)
SELECT 
    cohort_month,
    months_since_cohort,
    COUNT(DISTINCT user_id) as user_count
FROM cohort_ages
GROUP BY cohort_month, months_since_cohort
ORDER BY cohort_month, months_since_cohort;
```

---

## Window vs GROUP BY Decision

| Need | Use | Example |
|------|-----|---------|
| Collapse rows into groups | GROUP BY | "Revenue per category" |
| Keep all rows + calculation | Window | "Rank each product" |
| Running totals | Window + ORDER BY | "Cumulative daily revenue" |
| Top N per group | Window + PARTITION BY | "Top 3 products per category" |

---

## Performance Tips

| Pattern | Performance | Why |
|---------|-------------|-----|
| Window on indexed column | 🟢 Fast | Index helps |
| PARTITION BY with large groups | ⚠️ Medium | More work per group |
| Multiple window functions | ⚠️ Medium | Single pass, parallel |
| Recursive CTE | 🔴 Slow | Iterative (avoid for big data) |

---

## Tips & Gotchas

- **ORDER BY matters in window functions.** Always specify it.

```sql
-- Without ORDER BY, window is entire table
ROW_NUMBER() OVER (PARTITION BY category)  -- ❌ Unpredictable

-- With ORDER BY, clear ranking
ROW_NUMBER() OVER (PARTITION BY category ORDER BY price DESC)  -- ✅
```

- **CTEs don't persist after query.** They're temporary.

```sql
-- ✅ Works: reference CTE in main query
WITH temp AS (SELECT ...)
SELECT * FROM temp;

-- ❌ Error: CTE doesn't exist in next query
SELECT * FROM temp;
```

- **Window functions run AFTER WHERE.** You can't filter with them in WHERE clause.

```sql
-- ❌ Error
SELECT * FROM products WHERE ROW_NUMBER() OVER (...) = 1;

-- ✅ Use subquery
SELECT * FROM (
    SELECT *, ROW_NUMBER() OVER (...) as rn
    FROM products
) ranked
WHERE rn = 1;
```

---

## Related

- [[01-SQL-Fundamentals]] — Foundation for window functions
- [[03-SQL-Aggregations]] — GROUP BY vs Window functions
- [[02-SQL-Joins]] — CTEs with multiple JOINs
- [[05-PostgreSQL-for-Data-Engineering]] — Production window patterns
- [[00-SQL-Learning-Roadmap]] — Your complete SQL learning path

---

**Key Takeaway:**  
Window functions keep all rows while calculating aggregates. CTEs make complex queries readable. Together, they enable advanced analytics that GROUP BY alone can't achieve. Use PARTITION BY to rank within groups, ORDER BY to create running totals, and CTEs to organize complexity.
