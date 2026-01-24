---
title: Data Engineering Fundamentals (Complete Guide)
date: 2026-01-22
publish: true
description: Core concepts, architecture, and best practices for modern data engineering. Foundation for understanding pipelines, ETL/ELT, storage, and orchestration.
tags:
  - data-engineering
  - fundamentals
  - etl
  - pipelines
  - architecture
category: second-brain
---
# Data Engineering Fundamentals

Data engineering builds the systems that collect, store, transform, and deliver data reliably at scale. It's the foundation enabling analytics, machine learning, and business intelligence.

---

## What is Data Engineering?

Data engineering bridges **raw data** and **actionable insights** by building:

- **Reliable pipelines** that move data from source to destination
- **Scalable systems** handling terabytes to petabytes
- **Data quality** ensuring accuracy and completeness
- **Infrastructure** that operates 24/7 with monitoring

**Data Engineer vs Data Scientist:**
- Data Engineer: "How do we get reliable data?"
- Data Scientist: "What story does the data tell?"

---

## Core Responsibilities

1. **Design systems** for collecting, storing, and processing data
2. **Build pipelines** that automate data movement and transformation
3. **Ensure quality** through testing, validation, and monitoring
4. **Optimize performance** for speed and cost
5. **Maintain reliability** with monitoring, alerting, and recovery

---

## Data Pipeline Architecture

### Typical Flow

```
┌──────────────┐
│   Sources    │ (APIs, databases, files, streams)
└──────┬───────┘
       │
       ▼
┌──────────────────────┐
│  Ingestion Layer     │ (Extract from sources)
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  Processing Layer    │ (Transform, validate, enrich)
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  Storage Layer       │ (Warehouse, lake, database)
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  Consumption Layer   │ (Dashboards, reports, ML models)
└──────────────────────┘
```

### Key Components

| Component | Purpose | Example |
|-----------|---------|---------|
| **Source Systems** | Generate data | REST APIs, databases, Kafka |
| **Ingestion** | Extract data reliably | Apache Nifi, Airflow, Fivetran |
| **Storage (Staging)** | Land raw data | S3, ADLS, GCS, PostgreSQL |
| **Processing** | Transform & clean | Spark, dbt, Python, SQL |
| **Storage (Warehouse)** | Optimized for analytics | Snowflake, BigQuery, Redshift |
| **Orchestration** | Schedule & monitor | Apache Airflow, Prefect, dbt Cloud |
| **Monitoring** | Track health & costs | DataDog, Grafana, cloud-native tools |

---

## Design Principles

### 1. **Idempotency**
Re-running the same pipeline produces identical results (no duplicates or side effects).

```python
# ❌ Not idempotent (inserts duplicates on retry)
INSERT INTO orders VALUES (1, 'Alice', 100)

# ✅ Idempotent (safe to retry)
INSERT INTO orders VALUES (1, 'Alice', 100)
ON CONFLICT (order_id) DO NOTHING
```

### 2. **Fault Tolerance**
Gracefully handle failures with retries and recovery.

```python
# Airflow example
default_args = {
    'retries': 3,
    'retry_delay': timedelta(minutes=5),
    'on_failure_callback': notify_ops,
}
```

### 3. **Scalability**
Handle growing data volume, velocity, and variety.

- **Vertical scaling:** Bigger machines (limited)
- **Horizontal scaling:** More machines (Spark, Kubernetes)

### 4. **Observability**
Comprehensive logging, monitoring, and alerting.

```python
# Log what matters
logger.info(f"Loaded {row_count} rows from {source}")
logger.warning(f"Quality check failed: {null_count} nulls found")
logger.error(f"Pipeline failed at {timestamp}", exc_info=True)
```

### 5. **Modularity**
Build reusable, testable components.

```python
# ❌ Monolithic (hard to test, reuse)
def full_etl():
    extract_and_transform_and_load()

# ✅ Modular (testable, reusable)
def extract(source):
    return data

def transform(data):
    return cleaned_data

def load(data, target):
    write(data, target)
```

---

## ETL vs ELT

### ETL (Extract, Transform, Load) — Traditional

```
Source → Extract → Transform → Load → Warehouse
```

**When:** Limited warehouse compute, pre-defined transformations  
**Pros:** Clean data arrives in warehouse  
**Cons:** Expensive middleware, rigid pipelines  
**Tools:** Informatica, Talend, Azure SSIS

**Example:**
```python
# Extract from API
raw = fetch_from_api()

# Transform (middleware)
cleaned = clean_data(raw)
deduped = remove_duplicates(cleaned)
validated = validate_schema(deduped)

# Load to warehouse
load_to_snowflake(validated)
```

### ELT (Extract, Load, Transform) — Modern

```
Source → Extract → Load → Transform (in warehouse)
```

**When:** Cloud warehouse with compute, flexible transformations  
**Pros:** Scalable, flexible, leverage warehouse compute  
**Cons:** Raw data arrives first (requires quality control)  
**Tools:** dbt, Snowflake, BigQuery, Airflow + Spark

**Example:**
```python
# Extract from API
raw = fetch_from_api()

# Load raw to warehouse immediately
load_to_snowflake(raw, schema='raw')

# Transform IN warehouse (dbt/SQL)
# SELECT * FROM raw.orders 
# WHERE status = 'completed' 
# AND created_at > '2026-01-01'
```

**Modern data teams prefer ELT** because cloud warehouses scale transformations automatically.

---

## Data Storage Systems

### Operational Databases (OLTP)

```
PostgreSQL, MySQL, Oracle
```

**Purpose:** Transactional, real-time operations  
**Schema:** Normalized (3NF) to reduce redundancy  
**Storage:** Row-based (reads entire row quickly)  
**Scale:** Gigabytes to low terabytes  
**Use:** Applications, operational data

```sql
-- Normalized: data split across tables
SELECT u.name, o.amount
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE u.id = 123
```

### Data Warehouses (OLAP)

```
Snowflake, BigQuery, Redshift, Synapse
```

**Purpose:** Analytics, business intelligence  
**Schema:** Denormalized (star/snowflake) for fast queries  
**Storage:** Columnar (reads specific columns fast)  
**Scale:** Terabytes to petabytes  
**Use:** Reporting, dashboards, ad-hoc analysis

```sql
-- Denormalized: all data pre-joined
SELECT customer_name, product_category, SUM(revenue)
FROM fact_sales
GROUP BY customer_name, product_category
-- Much faster than joining normalized tables
```

### Data Lakes

```
S3, ADLS, Google Cloud Storage
```

**Purpose:** Store raw data in original format  
**Schema:** Schema-on-read (flexible structure)  
**Storage:** Object storage (S3 = files in buckets)  
**Scale:** Unlimited, cost-effective  
**Use:** Data archives, ML training data, exploratory analysis

```
s3://my-data-lake/
├── raw/
│   ├── transactions/2026/01/22/data.parquet
│   └── users/2026/01/22/data.csv
└── processed/
    ├── staging/
    └── marts/
```

---

## Data Modeling

### Normalization (3NF) — OLTP

Minimize redundancy:

```sql
-- Users table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE
);

-- Orders table (foreign key reference)
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    amount DECIMAL(10, 2),
    created_at TIMESTAMP
);

-- Order items (many-to-many)
CREATE TABLE order_items (
    item_id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(order_id),
    product_id INT REFERENCES products(product_id),
    quantity INT
);
```

**Pros:** No redundancy, ACID compliance  
**Cons:** Requires joins (slower analytics)

### Dimensional Modeling (Star Schema) — OLAP

Center facts with denormalized dimensions:

```sql
-- Fact table (measures: numeric data to analyze)
CREATE TABLE fact_sales (
    sale_id BIGINT PRIMARY KEY,
    date_key INT,
    product_key INT,
    customer_key INT,
    quantity INT,
    revenue DECIMAL(12, 2)
);

-- Dimension tables (descriptive attributes)
CREATE TABLE dim_date (
    date_key INT PRIMARY KEY,
    date DATE,
    year INT,
    quarter INT,
    month INT,
    day_name VARCHAR(10)
);

CREATE TABLE dim_product (
    product_key INT PRIMARY KEY,
    product_id INT,
    product_name VARCHAR(100),
    category VARCHAR(50),
    brand VARCHAR(50)
);

CREATE TABLE dim_customer (
    customer_key INT PRIMARY KEY,
    customer_id INT,
    name VARCHAR(100),
    country VARCHAR(50),
    segment VARCHAR(50)
);
```

**Pros:** Fast queries (no joins), intuitive for business users  
**Cons:** Data redundancy, requires careful maintenance

### Slowly Changing Dimensions (SCD)

Track how dimension attributes change:

```sql
-- SCD Type 2: Keep history
CREATE TABLE dim_customer_scd (
    customer_key INT PRIMARY KEY,
    customer_id INT,
    name VARCHAR(100),
    country VARCHAR(50),
    valid_from DATE,
    valid_to DATE,
    is_current BOOLEAN
);

-- When customer moves from US to UK:
-- Old row: valid_to = 2026-01-22, is_current = false
-- New row: valid_from = 2026-01-22, is_current = true
```

---

## Batch vs Streaming

### Batch Processing

Process data in discrete chunks at scheduled times.

```
Extract all data from 2026-01-22 00:00 to 23:59
        ↓
Process (transform, aggregate, validate)
        ↓
Load results to warehouse (once per day)
```

**When:** Daily reports, nightly backups, periodic aggregations  
**Tools:** Spark, Airflow + dbt, Hadoop  
**Latency:** Hours to days  
**Cost:** Efficient (process when cheap)

### Streaming Processing

Process data continuously as it arrives.

```
Event arrives → Process in milliseconds → Output immediately
```

**When:** Real-time dashboards, alerts, fraud detection  
**Tools:** Kafka, Flink, Spark Streaming, PubSub  
**Latency:** Milliseconds to seconds  
**Cost:** Always running (more expensive)

**Hybrid Approach:**
- **Streaming:** Ingest events in real-time to data lake
- **Batch:** Aggregate nightly for warehouse (cost-effective)

---

## Data Quality

### Six Dimensions

| Dimension | Definition | Example |
|-----------|-----------|---------|
| **Accuracy** | Data correctly represents reality | Revenue = sum of transactions |
| **Completeness** | All required data is present | No NULL in critical fields |
| **Consistency** | Data uniform across systems | Customer ID format matches |
| **Timeliness** | Data available when needed | Report ready by 9 AM |
| **Validity** | Data conforms to rules | Email matches format `user@domain.com` |
| **Uniqueness** | No duplicate records | One order per order_id |

### Quality Checks

```python
# dbt example (declarative testing)
tests:
  - unique:
      column_name: order_id
  - not_null:
      column_name: customer_id
  - relationships:
      column_name: customer_id
      to: ref('dim_customer')
      field: customer_id
  - accepted_values:
      column_name: status
      values: ['pending', 'completed', 'failed']
```

```python
# Python example (programmatic testing)
def validate_orders(df):
    assert df['order_id'].is_unique, "Duplicate order IDs"
    assert df['amount'].min() > 0, "Negative amounts found"
    assert df['customer_id'].notna().all(), "Missing customer IDs"
    assert df['created_at'].max() <= datetime.now(), "Future dates found"
    return True
```

---

## Modern Data Stack

### Your Tools (from TOOLS Knowledge Base)

| Layer | Tool | Purpose |
|-------|------|---------|
| **Ingestion** | Airflow | Orchestrate extraction jobs |
| **Processing** | dbt | SQL transformations + tests |
| **Processing** | PySpark | Distributed computing for large scale |
| **Storage** | Snowflake/BigQuery | Cloud warehouse |
| **Orchestration** | Airflow + dbt Cloud | Schedule & monitor pipelines |
| **Version Control** | Git/GitHub | Code management & collaboration |
| **Containerization** | Docker | Package & deploy consistently |

### Complete Pipeline Example

```
API → Airflow (extract) → Postgres (staging)
                              ↓
                        dbt (transform)
                              ↓
                        Snowflake (warehouse)
                              ↓
                        BI Tool (dashboard)
                              
All versioned in Git, packaged in Docker
```

---

## Common Challenges & Solutions

| Challenge | Why It Happens | Solution |
|-----------|----------------|----------|
| **Data arrives late** | Pipelines crash silently | Add monitoring + alerts. Implement retries |
| **Data quality issues** | No validation | Write tests (dbt). Profile data before loading |
| **Duplicate records** | Non-idempotent loads | Use `ON CONFLICT DO NOTHING` or deduplication |
| **Pipeline costs explode** | Inefficient queries | Partition data. Use right-sized warehouses |
| **Can't find data** | Poor documentation | Auto-generate docs (dbt). Tag datasets |
| **Debugging is hard** | No logging | Log extraction counts, transformation steps, errors |

---

## Your Learning Path

```
1_PYTHON  →  Core programming
2_SQL     →  Query structured data
   ↓
3_TOOLS:
├─ Docker  →  Package applications
├─ Airflow →  Schedule workflows
├─ dbt     →  Transform with tests
├─ Spark   →  Process large datasets
├─ Cloud   →  Use managed services
└─ Git     →  Version control

4_BOOTCAMP → Apply at Le Wagon
5_JOB-HUNT → Build portfolio
6_PROJECTS → Real-world experience
```

---

## Key Takeaways

1. **Data engineering = Infrastructure for data**  
   Build systems that reliably move and transform data

2. **Design for scale from day 1**  
   Use partitioning, distributed computing, managed services

3. **Automate with orchestration**  
   Airflow DAGs > manual scripts. Reproducible, monitorable

4. **Test your data quality**  
   dbt tests catch errors early. Validation prevents bad data

5. **Modern stacks are cloud-native**  
   ELT > ETL. Transform in warehouse (cheaper). Use managed services

6. **Code = infrastructure**  
   Git, Docker, CI/CD. Treat pipelines like software

---

## Related

- [[TOOLS-Learning-Roadmap]] — Complete tool stack
- [[Docker-Fundamentals]] — Containerization
- [[Apache-Airflow]] — Orchestration
- [[dbt-Data-Build-Tool]] — Transformations
- [[PySpark-Fundamentals]] — Distributed computing
- [[Cloud-Data-Warehouses]] — Snowflake, BigQuery, Redshift
- [[Git-GitHub]] — Version control

---

## Resources

**Official Docs:**
- [Apache Airflow](https://airflow.apache.org)
- [dbt](https://docs.getdbt.com)
- [Apache Spark](https://spark.apache.org/docs/latest/api/python)
- [Snowflake](https://docs.snowflake.com)
- [Google BigQuery](https://cloud.google.com/bigquery/docs)

**Books:**
- Fundamentals of Data Engineering (Reis & Housley)
- The Data Warehouse Toolkit (Kimball)
- Designing Data-Intensive Applications (Kleppmann)

**Communities:**
- [Data Engineering Wiki](https://dataengineering.wiki)
- [Seattle Data Guy YouTube](https://youtube.com/@SeattleDataGuy)
- [Start Data Engineering](https://www.startdataengineering.com)

---

**Last Updated:** Jan 22, 2026  
**Status:** Production-ready for Le Wagon prep (Oct 31, 2026)
