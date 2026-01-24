---
title: Cloud Data Warehouses (Snowflake, BigQuery, Redshift)
date: 2026-01-22
publish: true
description: Master cloud data warehouses—Snowflake, Google BigQuery, AWS Redshift. Modern, scalable analytics platforms for data engineering.
tags:
  - cloud
  - data-warehouse
  - snowflake
  - bigquery
  - redshift
  - data-engineering
category: second-brain
---
**Cloud Data Warehouses** are scalable, managed databases for analytics. Instead of managing servers, you pay for compute and storage on-demand. Industry standard for modern data teams.

---

## The Big Three

| Platform | Pricing | Best For | Architecture |
|----------|---------|----------|--------------|
| **Snowflake** | Compute + storage (separate) | Multi-cloud, ease of use, Zero-copy cloning | Proprietary cloud-agnostic |
| **Google BigQuery** | Storage + queries | Google ecosystem, speed, built-in ML | Google Cloud native |
| **AWS Redshift** | Nodes (compute + storage bundled) | Cost-optimized, large scale, AWS ecosystem | AWS native |

---

## Snowflake (Most Popular)

### Why Snowflake?

- **Separate compute & storage:** Scale independently
- **Multi-cloud:** AWS, Azure, GCP
- **Instant scalability:** Add compute in seconds
- **Zero-copy cloning:** Copy entire DB instantly (no extra storage)
- **Time-travel:** Query historical snapshots

### Architecture

```
┌─────────────────────────────────────┐
│  Application Layer (Clients)        │
├─────────────────────────────────────┤
│  Compute Layer (Virtual Warehouses) │ ← Scale independently
├─────────────────────────────────────┤
│  Cloud Services Layer (Metadata)    │
├─────────────────────────────────────┤
│  Storage Layer (Cloud Storage)      │ ← Pay per GB
└─────────────────────────────────────┘
```

### Connecting to Snowflake

```python
from snowflake.connector import connect

# Connect
conn = connect(
    account='xy12345',
    user='dbt_user',
    password='secret',
    warehouse='compute_wh',
    database='analytics',
    schema='public'
)

# Query
cursor = conn.cursor()
cursor.execute('SELECT COUNT(*) FROM fact_orders')
result = cursor.fetchall()
print(result)
```

### Virtual Warehouses (Compute)

```sql
-- Create warehouse (scales independently)
CREATE WAREHOUSE analytics_wh
  WAREHOUSE_SIZE = 'LARGE'  -- XS, S, M, L, XL, XXL
  AUTO_SUSPEND = 300        -- Pause after 5 min idle
  AUTO_RESUME = TRUE;       -- Resume on query

-- Scale up
ALTER WAREHOUSE analytics_wh SET WAREHOUSE_SIZE = 'XL';

-- Show warehouses
SHOW WAREHOUSES;

-- Use warehouse in query
USE WAREHOUSE analytics_wh;
SELECT * FROM transactions;
```

### Storage Layers

```sql
-- External stage (cloud storage)
CREATE STAGE s3_stage
  URL = 's3://my-bucket/data/'
  CREDENTIALS = (AWS_KEY_ID='xxx' AWS_SECRET_KEY='yyy');

-- Load from S3
COPY INTO raw_transactions
FROM @s3_stage/transactions.parquet
FILE_FORMAT = (TYPE = 'PARQUET')
ON_ERROR = 'SKIP_FILE';

-- Unload to S3
COPY (SELECT * FROM fact_orders)
TO @s3_stage/orders_export/
FILE_FORMAT = (TYPE = 'PARQUET');
```

### Time Travel (Query History)

```sql
-- Query as of 1 hour ago
SELECT * FROM transactions
AT (OFFSET => -3600);  -- 1 hour = 3600 seconds

-- Query as of specific time
SELECT * FROM transactions
BEFORE (TIMESTAMP => '2026-01-22 10:00:00'::TIMESTAMP_NTZ);

-- Show object history
SHOW OBJECT HISTORY IN DATABASE analytics;
```

### dbt + Snowflake

```yaml
# profiles.yml
my_snowflake_db:
  target: dev
  outputs:
    dev:
      type: snowflake
      account: xy12345.us-east-1
      user: dbt_user
      password: "{{ env_var('SNOWFLAKE_PASSWORD') }}"
      database: analytics
      schema: dbt_dev
      warehouse: dbt_wh
      threads: 4
      client_session_keep_alive: false
```

---

## Google BigQuery

### Why BigQuery?

- **Petabyte-scale analytics:** Instant queries on TB/PB datasets
- **No infrastructure:** Fully managed, pay per query
- **SQL on any data:** GCS, BigTable, Cloud SQL
- **Built-in ML:** BigQuery ML for predictions
- **Integration:** Seamless with Google ecosystem

### Architecture

```
┌──────────────────────────────────────┐
│  BigQuery API                        │
├──────────────────────────────────────┤
│  Query Engine (Dremel)               │ ← Massively parallel
├──────────────────────────────────────┤
│  Columnar Storage                    │ ← Optimized for analytics
└──────────────────────────────────────┘
```

### Connecting & Querying

```python
from google.cloud import bigquery
import pandas as pd

# Connect (uses GOOGLE_APPLICATION_CREDENTIALS)
client = bigquery.Client(project='my-project')

# Query
query = """
    SELECT 
        DATE(created_at) as date,
        COUNT(*) as order_count,
        SUM(amount) as total_revenue
    FROM `my-project.analytics.orders`
    WHERE created_at >= '2026-01-01'
    GROUP BY date
    ORDER BY date DESC
"""

df = client.query(query).to_pandas()
print(df)

# Cost estimation
job_config = bigquery.QueryJobConfig()
query_job = client.query(query, job_config=job_config)
print(f"Query bytes scanned: {query_job.total_bytes_processed}")
print(f"Estimated cost: ${query_job.total_bytes_processed / 1e12 * 6.25:.2f}")  # $6.25/TB
```

### Datasets & Tables

```python
# Create dataset
dataset = bigquery.Dataset('my-project.raw_data')
dataset.location = 'US'
dataset = client.create_dataset(dataset, exists_ok=True)

# Load data from GCS
job_config = bigquery.LoadJobConfig(
    source_format=bigquery.SourceFormat.PARQUET,
    autodetect=True,
)

load_job = client.load_table_from_uri(
    'gs://my-bucket/transactions/*.parquet',
    'my-project.raw_data.transactions',
    job_config=job_config,
)

load_job.result()  # Wait for job to complete
```

### BigQuery ML (Machine Learning)

```sql
-- Create linear regression model
CREATE OR REPLACE MODEL `my-project.analytics.revenue_forecast`
OPTIONS(model_type='linear_reg') AS
SELECT
  amount as label,
  quantity,
  customer_age,
  discount
FROM `my-project.analytics.historical_orders`
WHERE amount IS NOT NULL;

-- Predict
SELECT
  *,
  ROUND(predicted_amount, 2) as forecast
FROM ML.PREDICT(
  MODEL `my-project.analytics.revenue_forecast`,
  SELECT 100 as quantity, 35 as customer_age, 0.1 as discount
);
```

### dbt + BigQuery

```yaml
# profiles.yml
my_bigquery_project:
  target: dev
  outputs:
    dev:
      type: bigquery
      project: my-gcp-project
      dataset: dbt_dev
      threads: 4
      location: US
      priority: interactive  # interactive or batch
      retries: 1
```

---

## AWS Redshift

### Why Redshift?

- **AWS ecosystem integration:** Works with S3, Lambda, Kinesis
- **Column-oriented:** Optimized for OLAP (analytics)
- **Cost-effective:** On-demand or reserved instances
- **Massive Parallel Processing (MPP):** Scales with nodes

### Node Types

```
dc2.large     | 160 GB SSD per node
dc2.xlarge    | 2 TB SSD per node
ra3.xlplus    | 32 TB managed storage per node
```

### Connecting to Redshift

```python
import psycopg2

conn = psycopg2.connect(
    host='redshift-cluster-1.xxxxx.us-east-1.redshift.amazonaws.com',
    port=5439,
    user='awsuser',
    password='secret',
    database='dev'
)

cursor = conn.cursor()
cursor.execute('SELECT COUNT(*) FROM transactions')
print(cursor.fetchone())
```

### Loading from S3

```sql
-- Create table
CREATE TABLE transactions (
    transaction_id INT,
    amount DECIMAL(10, 2),
    created_at TIMESTAMP
);

-- Load from S3
COPY transactions
FROM 's3://my-bucket/data/transactions/'
IAM_ROLE 'arn:aws:iam::ACCOUNT:role/RedshiftRole'
FORMAT AS PARQUET;

-- Unload to S3
UNLOAD (
    SELECT * FROM transactions WHERE DATE(created_at) = CURRENT_DATE
)
TO 's3://my-bucket/output/transactions_today/'
IAM_ROLE 'arn:aws:iam::ACCOUNT:role/RedshiftRole'
PARQUET;
```

---

## Comparison for Your Context

### For Le Wagon Bootcamp

**Snowflake** is most likely used because:
- Clean SQL interface
- Easy to learn
- Free tier available (12-month trial)
- Widely adopted in industry

### Setup Cost

| Platform | Free Trial | Startup Cost |
|----------|-----------|--------------|
| **Snowflake** | 12 months, $400 credits | ✅ Free |
| **BigQuery** | $300 credits | ✅ Free tier (1 TB/month free) |
| **Redshift** | 2 months, 2 months 2 nodes | ❌ ~$200/month minimum |

---

## dbt + Cloud Data Warehouse

### Unified Architecture

```
┌─────────────────────┐
│  Data Source        │ (API, CSV, Database)
│ (Extract)           │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Cloud Warehouse    │ (Snowflake, BigQuery, Redshift)
│  Staging Layer      │ (Raw, unprocessed)
└──────────┬──────────┘
           │
           ▼ (dbt runs here)
┌─────────────────────┐
│  Transformations    │
│  (Models)           │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Analytics Layer    │
│  (Marts, fact/dim)  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Analytics Apps     │ (Dashboards, BI tools)
└─────────────────────┘
```

### Real Pipeline

```yaml
# profiles.yml (dbt uses this to connect)
my_analytics:
  target: prod
  outputs:
    prod:
      type: snowflake  # or bigquery, redshift
      account: xy12345
      user: dbt_prod
      password: "{{ env_var('SNOWFLAKE_PASSWORD') }}"
      database: analytics_prod
      schema: marts
      threads: 4
      warehouse: prod_wh
```

```sql
-- models/staging/stg_orders.sql
SELECT 
    order_id,
    customer_id,
    total_amount,
    created_at,
    CURRENT_TIMESTAMP() as loaded_at
FROM {{ source('raw', 'orders_raw') }}
WHERE created_at >= '2026-01-01'
```

```sql
-- models/marts/fact_daily_revenue.sql
SELECT 
    DATE(created_at) as date,
    SUM(total_amount) as total_revenue,
    COUNT(*) as order_count
FROM {{ ref('stg_orders') }}
GROUP BY DATE(created_at)
```

---

## Cloud Warehouse in Docker/Airflow

Most teams run:

```yaml
services:
  airflow:
    # Orchestrates jobs
    
  postgres_local:
    # Local development
    
  # No DW in Docker—connect to cloud
```

Then in Airflow DAG:

```python
from airflow.operators.python import PythonOperator
from snowflake.connector import connect

def load_to_snowflake(**context):
    conn = connect(account='xy12345', ...)
    cursor = conn.cursor()
    cursor.execute('INSERT INTO fact_orders SELECT * FROM staging')
    conn.commit()

load = PythonOperator(
    task_id='load',
    python_callable=load_to_snowflake,
)
```

---

## Tips & Best Practices

- **Use external staging.** Load via S3/GCS, not direct inserts.
- **Partition tables.** Query only data you need.
- **Archive old data.** Move to cheaper storage.
- **Use clusters (dbt).** Multi-threaded transformations.
- **Monitor costs.** BigQuery: check bytes scanned. Snowflake: warehouse size × hours.

---

## Related

- [[dbt-Data-Build-Tool]] — Transforms in cloud warehouses
- [[Apache-Airflow]] — Orchestrates cloud pipelines
- [[PySpark-Fundamentals]] — Alternative for very large scale
- [[TOOLS-Learning-Roadmap]] — Your complete tools learning path

---

**Key Takeaway:**  
Cloud data warehouses = managed, scalable SQL. Snowflake (multi-cloud), BigQuery (Google + speed), Redshift (AWS + cost). Connect via dbt for version-controlled transformations. Essential for modern data teams.
