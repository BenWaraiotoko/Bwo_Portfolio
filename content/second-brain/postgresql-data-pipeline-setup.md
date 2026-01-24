---
title: "PostgreSQL Data Pipeline Architecture"
date: 2026-01-20
publish: true
description: "Complete init.sql guide for data engineering: schemas, tables, indexes, views, triggers, and functions"
tags: ["sql", "postgresql", "data-engineering", "reference", "architecture"]
---

## Overview

This is a breakdown of a production-ready `init.sql` file that creates a complete data engineering infrastructure with three layers: staging, production, and analytics.

---

## Database & Extensions

```sql
CREATE DATABASE dev_db;
\c dev_db;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS postgis;
```

**Extensions:**
- `uuid-ossp` — Generate unique IDs for distributed systems
- `postgis` — Geographic data support (GPS coordinates, distance calculations)

---

## Three-Layer Architecture

```sql
CREATE SCHEMA IF NOT EXISTS staging;
CREATE SCHEMA IF NOT EXISTS production;
CREATE SCHEMA IF NOT EXISTS analytics;
```

| Schema | Purpose | Data Quality | Retention |
|--------|---------|--------------|-----------|
| **staging** | Raw data landing zone | No constraints | Short-term |
| **production** | Cleaned, validated data | Strict constraints | Long-term |
| **analytics** | Aggregations, KPIs | Pre-computed | Refreshed regularly |

**Analogy:**
- staging = warehouse receiving dock (unopened boxes)
- production = organized store (shelved products)
- analytics = display window (curated highlights)

---

## Staging Tables (Raw Data)

```sql
CREATE TABLE IF NOT EXISTS staging.raw_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id INTEGER NOT NULL,
    username VARCHAR(100),
    email VARCHAR(255),
    created_at TIMESTAMP,
    country VARCHAR(100),
    ingested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    source_system VARCHAR(50) DEFAULT 'api'
);
```

**Key points:**
- UUID as primary key — unique across distributed systems
- `ingested_at` — when data arrived (for debugging)
- `source_system` — where data came from (for auditing)
- No strict constraints — raw data can be incomplete

### JSONB for Flexible Data

```sql
CREATE TABLE IF NOT EXISTS staging.raw_events (
    ...
    event_data JSONB,
    ...
);
```

JSONB stores variable structures:
```json
{
  "page": "/home",
  "duration": 45,
  "device": "mobile"
}
```

---

## Production Tables (Clean Data)

```sql
CREATE TABLE IF NOT EXISTS production.users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_email CHECK (
        email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$'
    )
);
```

**Production constraints:**
- `SERIAL` — Auto-incrementing IDs
- `NOT NULL` — Required fields
- `UNIQUE` — No duplicates
- `CHECK` — Regex validation for email format

### Foreign Keys

```sql
CREATE TABLE IF NOT EXISTS production.transactions (
    transaction_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
        REFERENCES production.users(user_id)
        ON DELETE CASCADE,
    CONSTRAINT positive_amount CHECK (amount > 0),
    CONSTRAINT valid_status CHECK (
        status IN ('pending', 'completed', 'failed', 'refunded')
    )
);
```

**Notes:**
- `DECIMAL(10, 2)` — Never use FLOAT for money (rounding errors)
- `ON DELETE CASCADE` — Delete transactions when user is deleted
- Multiple CHECK constraints for data integrity

---

## Date Dimension Table

```sql
CREATE TABLE IF NOT EXISTS production.dim_date (
    date_id SERIAL PRIMARY KEY,
    full_date DATE NOT NULL UNIQUE,
    year INTEGER NOT NULL,
    quarter INTEGER NOT NULL,
    month INTEGER NOT NULL,
    month_name VARCHAR(20),
    week INTEGER NOT NULL,
    day_of_week INTEGER NOT NULL,
    day_name VARCHAR(20),
    is_weekend BOOLEAN,
    is_holiday BOOLEAN DEFAULT FALSE
);
```

**Why a date table?**
- Faster analytical queries
- Easy filtering by quarter, weekend, holidays
- Standardized definitions across the organization

**Usage:**
```sql
SELECT d.quarter, SUM(t.amount)
FROM transactions t
JOIN dim_date d ON DATE(t.transaction_date) = d.full_date
GROUP BY d.quarter;
```

---

## Materialized Views

```sql
CREATE MATERIALIZED VIEW IF NOT EXISTS analytics.daily_user_metrics AS
SELECT
    DATE(t.transaction_date) as date,
    u.country,
    COUNT(DISTINCT u.user_id) as active_users,
    SUM(t.amount) as total_revenue,
    AVG(t.amount) as avg_transaction
FROM production.users u
LEFT JOIN production.transactions t ON u.user_id = t.user_id
GROUP BY DATE(t.transaction_date), u.country;
```

| Regular View | Materialized View |
|--------------|-------------------|
| Computed on each query | Stored physically |
| Always current | Needs REFRESH |
| Slower | Much faster |
| No disk space | Uses disk space |

**Refresh:**
```sql
REFRESH MATERIALIZED VIEW analytics.daily_user_metrics;
```

---

## Indexes

```sql
CREATE INDEX idx_transactions_user_id
    ON production.transactions(user_id);

CREATE INDEX idx_user_date
    ON production.transactions(user_id, transaction_date);

CREATE INDEX idx_events_data
    ON staging.raw_events USING GIN(event_data);
```

**Index types:**
- **B-Tree** (default) — Standard lookups
- **Composite** — Multiple columns (order matters)
- **GIN** — For JSONB data

**Index columns used in:**
- WHERE clauses
- JOIN conditions
- ORDER BY / GROUP BY

**Trade-off:** Faster reads, slower writes, uses disk space.

---

## Triggers

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON production.users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

**Trigger concepts:**
- `BEFORE` — Can modify data before it's saved
- `AFTER` — For logging, notifications
- `NEW` — New row values
- `OLD` — Previous row values

**Use cases:**
- Audit trails
- Auto-updating timestamps
- Complex validation
- Synchronization between tables

---

## Utility Functions

### Cleanup Old Data

```sql
CREATE OR REPLACE FUNCTION staging.cleanup_old_data(
    days_to_keep INTEGER DEFAULT 30
)
RETURNS INTEGER AS $$
DECLARE
    rows_deleted INTEGER;
BEGIN
    DELETE FROM staging.raw_users
    WHERE ingested_at < CURRENT_TIMESTAMP - (days_to_keep || ' days')::INTERVAL;

    GET DIAGNOSTICS rows_deleted = ROW_COUNT;
    RETURN rows_deleted;
END;
$$ LANGUAGE plpgsql;
```

**Usage:**
```sql
SELECT staging.cleanup_old_data(7);  -- Keep 7 days
```

---

## Idempotent Patterns

```sql
-- Safe to run multiple times
CREATE TABLE IF NOT EXISTS ...
CREATE INDEX IF NOT EXISTS ...

-- Upsert pattern
INSERT INTO production.users (username, email)
VALUES ('alice', 'alice@example.com')
ON CONFLICT (username) DO NOTHING;

-- Or update on conflict
ON CONFLICT (username) DO UPDATE
SET email = EXCLUDED.email;
```

---

## Data Engineering Concepts

| Concept | Implementation |
|---------|---------------|
| **Medallion Architecture** | staging → production → analytics |
| **Data Quality** | NOT NULL, UNIQUE, CHECK, FK |
| **Metadata** | ingested_at, source_system, updated_at |
| **Idempotence** | IF NOT EXISTS, ON CONFLICT |
| **Star Schema** | dim_date + fact tables |

---

## Typical Pipeline Workflow

```
1. Ingestion → staging.raw_*
   ↓
2. Transform → production.*
   ↓
3. Aggregate → analytics.*
   ↓
4. Visualize (BI tools)
```

**Frequency:**
- staging → production: Hourly
- production → analytics: Nightly
- Materialized view refresh: On demand

---

## Verification Commands

```sql
\dn                      -- List schemas
\dt production.*         -- List tables in schema
\di production.users     -- Show indexes
\d+ production.users     -- Table details with comments
```

---

*Complete PostgreSQL setup for data engineering pipelines. Based on the three-layer architecture pattern.*
