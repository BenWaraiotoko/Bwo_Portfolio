---
title: SQL Quick Reference
date: 2025-12-28
publish: true
description: Essential SQL commands and syntax for data engineering
tags:
  - sql
  - cheatsheet
  - reference
category: second-brain
---
## Basic Queries

### SELECT
```sql
-- Select all columns
SELECT * FROM users;

-- Select specific columns
SELECT name, email FROM users;

-- With WHERE clause
SELECT * FROM users WHERE age > 25;

-- With ORDER BY
SELECT * FROM users ORDER BY created_at DESC;

-- With LIMIT
SELECT * FROM users LIMIT 10;
```

### Filtering

```sql
-- Multiple conditions
SELECT * FROM orders
WHERE status = 'completed'
  AND total > 100;

-- Pattern matching
SELECT * FROM users
WHERE email LIKE '%@gmail.com';

-- IN operator
SELECT * FROM products
WHERE category IN ('electronics', 'books');
```

## Aggregations

```sql
-- COUNT
SELECT COUNT(*) FROM users;

-- SUM, AVG, MAX, MIN
SELECT
    SUM(total) as revenue,
    AVG(total) as avg_order,
    MAX(total) as largest_order
FROM orders;

-- GROUP BY
SELECT
    category,
    COUNT(*) as product_count
FROM products
GROUP BY category;

-- HAVING (filter groups)
SELECT category, COUNT(*) as count
FROM products
GROUP BY category
HAVING count > 5;
```

## Joins

```sql
-- INNER JOIN
SELECT users.name, orders.total
FROM users
INNER JOIN orders ON users.id = orders.user_id;

-- LEFT JOIN
SELECT users.name, orders.total
FROM users
LEFT JOIN orders ON users.id = orders.user_id;

-- Multiple joins
SELECT u.name, o.total, p.name
FROM users u
JOIN orders o ON u.id = o.user_id
JOIN products p ON o.product_id = p.id;
```

## Data Modification

```sql
-- INSERT
INSERT INTO users (name, email)
VALUES ('Ben', 'ben@example.com');

-- UPDATE
UPDATE users
SET status = 'active'
WHERE last_login > '2025-01-01';

-- DELETE
DELETE FROM users
WHERE created_at < '2020-01-01';
```

## Table Operations

```sql
-- CREATE TABLE
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    timestamp TIMESTAMP DEFAULT NOW()
);

-- ALTER TABLE
ALTER TABLE users
ADD COLUMN phone VARCHAR(20);

-- DROP TABLE
DROP TABLE old_data;
```

## Window Functions

```sql
-- ROW_NUMBER
SELECT
    name,
    ROW_NUMBER() OVER (ORDER BY score DESC) as rank
FROM students;

-- Running total
SELECT
    date,
    revenue,
    SUM(revenue) OVER (ORDER BY date) as cumulative
FROM daily_sales;
```

## Related

- [[postgresql-data-pipeline-setup]]
- [[10-Python-for-Data-Engineering]]
- [[fundamentals]]
- [[de-project-1-2-postgresql-in-docker]]

---

*Quick reference for common SQL patterns. Based on PostgreSQL syntax.*
