---
title: PostgreSQL for Data Engineering
date: 2026-01-22
publish: true
description: Production-grade PostgreSQL patterns—schemas, indexes, transactions, views, and performance tuning for data pipelines.
tags:
  - sql
  - postgresql
  - data-engineering
  - production
category: second-brain
---
**PostgreSQL** is the database of choice for data engineers. It's reliable, powerful, and perfect for building data pipelines. This page covers production patterns you'll use every day.

---

## Database Architecture: Three-Layer Pattern

The industry-standard ETL architecture divides the database into layers:

```sql
CREATE SCHEMA staging;      -- Raw data landing zone
CREATE SCHEMA production;   -- Cleaned, validated data
CREATE SCHEMA analytics;    -- Aggregations for reporting
```

| Layer | Purpose | Data Quality | Retention |
|-------|---------|--------------|-----------|
| **staging** | Raw data from sources | No constraints | Days/weeks |
| **production** | Validated, transformed | Strict constraints | Permanent |
| **analytics** | Pre-computed metrics | Optimized for queries | Refreshed daily |

---

## Creating Tables (Staging vs Production)

### Staging Table (Flexible)

```sql
CREATE TABLE staging.raw_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id VARCHAR(255),
    user_id VARCHAR(255),
    event_data JSONB,
    ingested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    source_system VARCHAR(50)
);
```

**Why flexible?**
- UUIDs handle distributed ingestion
- JSONB stores variable data structures
- No NOT NULL constraints (raw data can be messy)
- `ingested_at` tracks when data arrived

### Production Table (Strict)

```sql
CREATE TABLE production.users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_email CHECK (
        email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$'
    )
);
```

**Why strict?**
- SERIAL for auto-increment IDs
- NOT NULL on required fields
- UNIQUE constraints prevent duplicates
- CHECK constraints validate data
- Timestamps track changes

---

## Indexes: Speed Up Queries

### Single Column Index

```sql
CREATE INDEX idx_users_email ON production.users(email);
```

**When:** You filter on this column frequently

```sql
SELECT * FROM production.users WHERE email = 'user@example.com';  -- Fast!
```

### Composite Index (Multiple Columns)

```sql
CREATE INDEX idx_orders_user_date ON production.orders(user_id, order_date);
```

**Helps these queries:**
```sql
WHERE user_id = 5
WHERE user_id = 5 AND order_date > '2026-01-01'
```

**Does NOT help:**
```sql
WHERE order_date > '2026-01-01'  -- Wrong order
```

### Unique Index (Prevents Duplicates)

```sql
CREATE UNIQUE INDEX idx_products_sku ON production.products(sku);
```

### Full-Text Index (Search)

```sql
CREATE INDEX idx_products_search ON production.products 
USING GIN (to_tsvector('english', description));
```

**Usage:**
```sql
SELECT * FROM production.products 
WHERE to_tsvector('english', description) @@ to_tsquery('solar panel');
```

---

## Transactions: Consistency Guarantees

### Basic Transaction

```sql
BEGIN;

INSERT INTO production.transactions (user_id, amount) 
VALUES (5, 100);

INSERT INTO production.balances (user_id, new_balance) 
VALUES (5, 900);

COMMIT;  -- Both succeed or both fail
```

### Rollback on Error

```sql
BEGIN;

UPDATE production.inventory SET quantity = quantity - 5 WHERE product_id = 10;

-- If the stock goes negative, rollback
IF (SELECT quantity FROM production.inventory WHERE product_id = 10) < 0 THEN
    ROLLBACK;
ELSE
    COMMIT;
END IF;
```

### Savepoints (Nested Transactions)

```sql
BEGIN;

INSERT INTO production.orders (customer_id, total) VALUES (5, 500);
SAVEPOINT order_created;

-- This might fail
INSERT INTO production.order_items (order_id, product_id) VALUES (999, 100);

-- If it fails, rollback just to savepoint
ROLLBACK TO SAVEPOINT order_created;

-- Continue with alternative
INSERT INTO production.order_items (order_id, product_id) VALUES (999, 200);

COMMIT;
```

---

## Views: Reusable Queries

### Simple View

```sql
CREATE VIEW analytics.daily_revenue AS
SELECT 
    DATE(order_date) as date,
    SUM(total) as revenue,
    COUNT(*) as order_count
FROM production.orders
GROUP BY DATE(order_date);
```

**Usage:**
```sql
SELECT * FROM analytics.daily_revenue WHERE date = '2026-01-22';
```

### Materialized View (Cached Results)

```sql
CREATE MATERIALIZED VIEW analytics.customer_segments AS
SELECT 
    user_id,
    COUNT(*) as order_count,
    SUM(total) as lifetime_value,
    CASE 
        WHEN SUM(total) > 5000 THEN 'VIP'
        WHEN SUM(total) > 1000 THEN 'Premium'
        ELSE 'Regular'
    END as segment
FROM production.orders
GROUP BY user_id;

-- Refresh the view (recalculate)
REFRESH MATERIALIZED VIEW analytics.customer_segments;
```

**Materialized View vs Normal View:**
- Normal View: Always recalculates (current but slow)
- Materialized View: Pre-calculated (stale but fast)

---

## Functions & Stored Procedures

### Simple Function

```sql
CREATE FUNCTION get_customer_lifetime_value(customer_id INT) 
RETURNS DECIMAL AS $$
BEGIN
    RETURN (
        SELECT SUM(total)
        FROM production.orders
        WHERE user_id = customer_id
    );
END;
$$ LANGUAGE plpgsql;

-- Usage
SELECT get_customer_lifetime_value(5);
```

### Function with Error Handling

```sql
CREATE FUNCTION process_order(order_id INT) 
RETURNS TEXT AS $$
DECLARE
    order_total DECIMAL;
    inventory_ok BOOLEAN;
BEGIN
    -- Get order total
    SELECT total INTO order_total FROM production.orders 
    WHERE id = order_id;
    
    IF order_total IS NULL THEN
        RETURN 'Order not found';
    END IF;
    
    -- Check inventory (simplified)
    inventory_ok := TRUE;  
    
    IF inventory_ok THEN
        UPDATE production.orders SET status = 'completed' 
        WHERE id = order_id;
        RETURN 'Order processed: $' || order_total;
    ELSE
        RETURN 'Insufficient inventory';
    END IF;
    
EXCEPTION WHEN OTHERS THEN
    RETURN 'Error: ' || SQLERRM;
END;
$$ LANGUAGE plpgsql;
```

---

## Performance Optimization

### EXPLAIN: See Query Plan

```sql
EXPLAIN ANALYZE
SELECT u.name, COUNT(*) as order_count
FROM production.users u
LEFT JOIN production.orders o ON u.user_id = o.user_id
GROUP BY u.user_id
HAVING COUNT(*) > 5
ORDER BY order_count DESC;
```

**Output tells you:**
- How many rows each step processes
- Whether indexes are used
- Which joins are slow

### Query Optimization Checklist

```sql
-- ❌ Slow: SELECT * and no index
SELECT * FROM users WHERE email LIKE '%gmail%';

-- ✅ Fast: Specific columns and indexed prefix search
CREATE INDEX idx_users_email ON users(email);
SELECT user_id, name FROM users WHERE email LIKE 'gmail%';

-- ❌ Slow: Calculated column (can't use index)
SELECT * FROM orders WHERE total / 1.1 > 100;

-- ✅ Fast: Pre-calculated
SELECT * FROM orders WHERE total > 110;
```

---

## Common Data Engineering Patterns

### Extract-Transform-Load (ETL) Function

```sql
CREATE FUNCTION etl_daily_summary() 
RETURNS TABLE (rows_processed INT, status TEXT) AS $$
DECLARE
    v_processed INT;
BEGIN
    -- Extract from staging
    INSERT INTO production.transactions (user_id, amount, created_at)
    SELECT user_id, amount, created_at 
    FROM staging.raw_transactions
    WHERE processed = FALSE;
    
    GET DIAGNOSTICS v_processed = ROW_COUNT;
    
    -- Update flag
    UPDATE staging.raw_transactions SET processed = TRUE 
    WHERE processed = FALSE;
    
    RETURN QUERY SELECT v_processed, 'success'::TEXT;
    
EXCEPTION WHEN OTHERS THEN
    RETURN QUERY SELECT 0, 'error: ' || SQLERRM;
END;
$$ LANGUAGE plpgsql;
```

### Incremental Load (Only New Data)

```sql
CREATE TABLE production.load_state (
    table_name VARCHAR(255) PRIMARY KEY,
    last_loaded_at TIMESTAMP,
    last_loaded_id INT
);

-- Load only new records
INSERT INTO production.users (username, email, created_at)
SELECT username, email, created_at
FROM staging.raw_users
WHERE created_at > (
    SELECT COALESCE(last_loaded_at, '1900-01-01')
    FROM production.load_state
    WHERE table_name = 'users'
);

-- Update state
UPDATE production.load_state 
SET last_loaded_at = NOW() 
WHERE table_name = 'users';
```

### Data Quality Checks

```sql
CREATE VIEW analytics.data_quality_checks AS
SELECT 
    'users - negative IDs' as check_name,
    COUNT(*) as count
FROM production.users 
WHERE user_id < 0
UNION ALL
SELECT 
    'orders - null amounts',
    COUNT(*)
FROM production.orders 
WHERE total IS NULL;
```

---

## Connection Management

### Connection Pooling with pgBouncer

```
[databases]
prod_db = host=db.example.com port=5432 dbname=prod user=engineer password=secret

[pgbouncer]
pool_mode = transaction
max_client_conn = 1000
default_pool_size = 25
```

**Why:** Limit database connections, reuse connections for performance

---

## Common Gotchas

- **DECIMAL for money, not FLOAT.**

```sql
-- ❌ Rounding errors
CREATE TABLE orders (total FLOAT);
INSERT INTO orders VALUES (10.99);
SELECT total FROM orders;  -- 10.98999999...

-- ✅ Exact
CREATE TABLE orders (total DECIMAL(10, 2));
```

- **BETWEEN includes both ends.**

```sql
WHERE created_at BETWEEN '2026-01-01' AND '2026-01-31'  -- Includes entire month
```

- **NULL comparisons need IS NULL.**

```sql
-- ❌ Wrong
WHERE deleted_at = NULL

-- ✅ Correct
WHERE deleted_at IS NULL
```

- **Index names should be descriptive.**

```sql
-- ❌ Generic
CREATE INDEX idx_1 ON users(email);

-- ✅ Clear
CREATE INDEX idx_users_email_lookup ON users(email);
```

---

## Related

- [[01-SQL-Fundamentals]] — SELECT, WHERE, ORDER BY
- [[02-SQL-Joins]] — Production joins
- [[03-SQL-Aggregations]] — GROUP BY patterns
- [[04-SQL-Window-Functions]] — Advanced analytics
- [[00-SQL-Learning-Roadmap]] — Your complete SQL learning path

---

**Key Takeaway:**  
PostgreSQL provides three layers (staging, production, analytics) for data pipelines. Use indexes to speed up queries, transactions for consistency, views for reusability, and functions to automate ETL. Always EXPLAIN your queries before running them in production.
