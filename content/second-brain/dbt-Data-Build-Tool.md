---
title: dbt (Data Build Tool)
date: 2026-01-22
publish: true
description: Master dbt—SQL transformations, testing, documentation, and lineage. Transform raw data into analytics-ready tables.
tags:
  - dbt
  - sql
  - data-engineering
  - analytics-engineering
category: second-brain
---
**dbt** transforms data in your warehouse using **SELECT statements**. No more messy Python scripts—just SQL, version control, testing, and documentation. dbt compiles your SQL, runs it in the right order, and gives you lineage and testing.

---

## Core Concepts

**dbt's Philosophy:** Data transformation should be in SQL, version controlled, and tested.

- **Models:** SQL files that create tables/views
- **Tests:** Assertions about your data
- **Documentation:** Auto-generated from your code
- **Lineage:** Visual graph of data flow

---

## Project Structure

```
my_dbt_project/
├── dbt_project.yml          # Project config
├── models/
│   ├── staging/
│   │   ├── stg_users.sql
│   │   └── stg_orders.sql
│   ├── marts/
│   │   ├── dim_customer.sql
│   │   └── fact_orders.sql
│   └── schema.yml           # Tests & documentation
├── seeds/                   # Static CSV data
├── tests/                   # Custom tests
├── snapshots/               # Track changes over time
└── README.md
```

---

## Your First Model

### Create a Staging Model

**models/staging/stg_users.sql:**
```sql
SELECT 
    id as user_id,
    email,
    name,
    created_at,
    CASE 
        WHEN deleted_at IS NULL THEN 'active' 
        ELSE 'inactive' 
    END as status
FROM {{ source('raw', 'users') }}
```

**models/schema.yml** (metadata + tests):
```yaml
version: 2

sources:
  - name: raw
    tables:
      - name: users

models:
  - name: stg_users
    description: Staging layer for users data
    columns:
      - name: user_id
        description: Unique user identifier
        tests:
          - unique
          - not_null
      
      - name: email
        description: User email
        tests:
          - unique
          - not_null
      
      - name: status
        description: User status
        tests:
          - accepted_values:
              values: ['active', 'inactive']
```

### Build & Test

```bash
# Build all models
dbt run

# Build specific model
dbt run --select stg_users

# Run tests
dbt test

# Build and test
dbt run && dbt test
```

---

## Model Materialization

How dbt creates your model:

```sql
-- Table (default): recreates full table each run
{{ config(materialized='table') }}
SELECT * FROM staging.raw_users

-- View: lightweight, recalculates when queried
{{ config(materialized='view') }}
SELECT * FROM staging.raw_users

-- Incremental: append-only (fast for large datasets)
{{ config(materialized='incremental') }}
SELECT * FROM staging.raw_users
{% if execute %}
  WHERE created_at > (SELECT MAX(created_at) FROM {{ this }})
{% endif %}

-- Ephemeral: temporary, only in depends_on queries
{{ config(materialized='ephemeral') }}
SELECT * FROM staging.raw_users
```

---

## Using References (Lineage)

```sql
-- models/marts/fact_orders.sql

SELECT 
    o.order_id,
    u.user_id,
    o.total,
    o.created_at
FROM {{ ref('stg_orders') }} o
JOIN {{ ref('stg_users') }} u ON o.user_id = u.user_id
WHERE o.status = 'completed'
```

**`{{ ref('model_name') }}`** creates a dependency:
- dbt knows stg_orders and stg_users must run before fact_orders
- Automatic lineage graph
- Compile to correct table names (dev vs prod)

---

## Testing & Data Quality

### Built-In Generic Tests

```yaml
models:
  - name: fact_orders
    columns:
      - name: order_id
        tests:
          - unique        # All values are unique
          - not_null      # No NULL values
      
      - name: total
        tests:
          - not_null
          - dbt_utils.expression_is_true:
              expression: "> 0"  # All amounts > 0
      
      - name: user_id
        tests:
          - relationships:   # Foreign key: must exist in users
              to: ref('dim_users')
              field: user_id
```

### Custom Tests

**tests/no_duplicate_emails.sql:**
```sql
-- This query should return 0 rows if test passes
SELECT email, COUNT(*) as count
FROM {{ ref('stg_users') }}
GROUP BY email
HAVING COUNT(*) > 1
```

Run custom tests:
```bash
dbt test --select test_no_duplicate_emails
```

---

## Documentation & Data Dictionary

Auto-generate docs:

```bash
dbt docs generate
dbt docs serve  # View at localhost:8000
```

---

## Snapshots (Track Changes)

Slowly Changing Dimensions (SCD):

```sql
{% snapshot users_snapshot %}
  {{
    config(
      target_schema='snapshots',
      unique_key='user_id',
      strategy='timestamp',
      updated_at='updated_at',
    )
  }}

  SELECT * FROM {{ source('raw', 'users') }}

{% endsnapshot %}
```

**Result:** Table with:
- `valid_from`
- `valid_to`
- `dbt_scd_id`
- All original columns

Perfect for "who changed what and when?"

---

## Real-World dbt Project

```yaml
# dbt_project.yml
name: analytics
version: 1.0.0
config-version: 2

profile: dev

model-configs:
  staging:
    materialized: view
    schema: staging
  
  marts:
    materialized: table
    schema: marts
```

**models/staging/stg_events.sql:**
```sql
SELECT 
    event_id,
    user_id,
    event_type,
    event_timestamp,
    JSON_EXTRACT_SCALAR(event_data, '$.page') as page_url,
    CURRENT_TIMESTAMP() as loaded_at
FROM {{ source('raw', 'events') }}
WHERE event_timestamp > TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 1 DAY)
```

**models/marts/fct_daily_active_users.sql:**
```sql
SELECT 
    DATE(event_timestamp) as date,
    COUNT(DISTINCT user_id) as daily_active_users,
    COUNT(DISTINCT event_id) as total_events
FROM {{ ref('stg_events') }}
GROUP BY DATE(event_timestamp)
ORDER BY date DESC
```

---

## dbt with Airflow

```python
from airflow import DAG
from airflow.operators.bash import BashOperator
from datetime import datetime

dag = DAG(
    dag_id='dbt_pipeline',
    schedule_interval='@daily',
    start_date=datetime(2026, 1, 1),
)

dbt_run = BashOperator(
    task_id='dbt_run',
    bash_command='cd /dbt && dbt run',
    dag=dag,
)

dbt_test = BashOperator(
    task_id='dbt_test',
    bash_command='cd /dbt && dbt test',
    dag=dag,
)

dbt_run >> dbt_test
```

---

## Tips & Gotchas

- **Use `{{ ref() }}` for dependencies, not hardcoded table names.**

```sql
-- ❌ Hardcoded (breaks in different environments)
SELECT * FROM public.stg_users

-- ✅ Portable
SELECT * FROM {{ ref('stg_users') }}
```

- **Test early and often.** Tests are cheap, bugs are expensive.

```bash
dbt test --select stg_users  # Test one model
dbt test --tag critical      # Test tagged models
```

- **Use sources for raw data, ref() for transformations.**

```sql
-- ✅ Correct
SELECT * FROM {{ source('raw', 'users') }}  -- Raw data
SELECT * FROM {{ ref('stg_users') }}        -- Transformed
```

---

## Related

- [[03-SQL-Aggregations]] — SQL in dbt models
- [[04-SQL-Window-Functions]] — Advanced dbt queries
- [[Apache-Airflow]] — Airflow triggers dbt
- [[Docker-Compose]] — dbt in containers
- [[TOOLS-Learning-Roadmap]] — Your complete tools learning path

---

**Key Takeaway:**  
dbt = version-controlled SQL transformations + tests + documentation. Write models in SQL, define tests in YAML, run `dbt run`, get lineage and docs automatically. Industry standard for analytics engineering.
