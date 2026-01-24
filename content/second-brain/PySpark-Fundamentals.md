---
title: PySpark Fundamentals (Distributed Data Processing)
date: 2026-01-22
publish: true
description: Master Apache Spark and PySpark—RDDs, DataFrames, SQL, and distributed computing for big data pipelines.
tags:
  - pyspark
  - spark
  - distributed-computing
  - data-engineering
category: second-brain
---
**Apache Spark** processes **massive datasets in parallel** across clusters. **PySpark** is the Python API. Instead of loading all data into memory, Spark splits work across machines and combines results—essential for scaling data pipelines.

---

## Why Spark?

**Without Spark (pandas):**
```python
import pandas as pd

# Must fit entire dataset in memory
df = pd.read_csv('huge_file.csv')  # 100 GB? 💥 Memory error
df.groupby('city').sum()
```

**With Spark:**
```python
from pyspark.sql import SparkSession

spark = SparkSession.builder.appName("pipeline").getOrCreate()

# Processes 100 GB across cluster, returns results
df = spark.read.csv('huge_file.csv', header=True)
df.groupBy('city').sum().show()
```

---

## Core Concepts

### RDD (Resilient Distributed Dataset)

The foundation—immutable, partitioned data across nodes.

```python
from pyspark import SparkContext

sc = SparkContext("local", "RDD example")

# Create RDD from list
rdd = sc.parallelize([1, 2, 3, 4, 5])

# Transform
result = rdd.map(lambda x: x * 2).collect()  # [2, 4, 6, 8, 10]
```

**But:** RDDs are low-level. Use **DataFrames** instead (you'll 95% of the time).

### DataFrame (Recommended)

Like SQL tables, but distributed.

```python
from pyspark.sql import SparkSession

spark = SparkSession.builder.appName("pipeline").getOrCreate()

# Create DataFrame
data = [
    ("Alice", 1000),
    ("Bob", 2000),
    ("Charlie", 1500),
]

df = spark.createDataFrame(data, ["name", "salary"])

# Show
df.show()
# +-------+------+
# |   name|salary|
# +-------+------+
# |  Alice|  1000|
# |    Bob|  2000|
# |Charlie|  1500|
# +-------+------+
```

---

## Loading Data

### CSV

```python
df = spark.read.csv('data.csv', header=True, inferSchema=True)
# header=True: first row is column names
# inferSchema=True: guess column types (slower, but convenient)
```

### Parquet (Recommended for big data)

```python
# Read
df = spark.read.parquet('data.parquet')

# Write
df.write.mode('overwrite').parquet('output.parquet')
```

### PostgreSQL

```python
df = spark.read \
    .format("jdbc") \
    .option("url", "jdbc:postgresql://localhost:5432/mydb") \
    .option("dbtable", "public.users") \
    .option("user", "postgres") \
    .option("password", "secret") \
    .load()
```

---

## DataFrame Operations

### Selecting & Filtering

```python
# Select columns
df.select('name', 'salary').show()

# Filter
df.filter(df.salary > 1000).show()

# Multiple conditions
df.filter((df.salary > 1000) & (df.name == 'Alice')).show()
```

### Aggregations

```python
# Count rows
df.count()

# Group by
df.groupBy('department').agg({'salary': 'sum', 'id': 'count'}).show()

# Using SQL functions
from pyspark.sql.functions import sum, count, avg

df.groupBy('department').agg(
    sum('salary').alias('total_salary'),
    count('id').alias('employee_count'),
    avg('salary').alias('avg_salary')
).show()
```

### Joins

```python
# Inner join
orders.join(users, orders.user_id == users.id, 'inner').show()

# Left join
orders.join(users, orders.user_id == users.id, 'left').show()

# Types: inner, left, right, outer, cross, semi, anti
```

### Window Functions

```python
from pyspark.sql.functions import row_number, rank, dense_rank, lag, lead
from pyspark.sql.window import Window

# Rank employees by salary within department
window = Window.partitionBy('department').orderBy(desc('salary'))

df_ranked = df.withColumn('rank', rank().over(window))

df_ranked.show()
```

---

## SQL Interface

Run **SQL queries directly** on DataFrames:

```python
# Register as temporary table
df.createOrReplaceTempView('users')

# Write SQL
result = spark.sql("""
    SELECT 
        department,
        COUNT(*) as employee_count,
        AVG(salary) as avg_salary
    FROM users
    WHERE salary > 1000
    GROUP BY department
    ORDER BY avg_salary DESC
""")

result.show()
```

---

## Real-World ETL Pipeline (PySpark)

```python
from pyspark.sql import SparkSession
from pyspark.sql.functions import col, when, sum, count, concat_ws
from datetime import datetime, timedelta

# Initialize Spark
spark = SparkSession.builder \
    .appName("daily_revenue_pipeline") \
    .getOrCreate()

# 1. EXTRACT: Read from PostgreSQL
source_url = "jdbc:postgresql://source:5432/production"
orders = spark.read \
    .format("jdbc") \
    .option("url", source_url) \
    .option("dbtable", "orders") \
    .option("user", "postgres") \
    .option("password", "secret") \
    .load()

# 2. TRANSFORM: Clean & aggregate
yesterday = (datetime.now() - timedelta(days=1)).date()

revenue_by_category = orders \
    .filter(col('created_at').cast('date') == yesterday) \
    .filter(col('status') == 'completed') \
    .groupBy('product_category') \
    .agg(
        sum('amount').alias('total_revenue'),
        count('order_id').alias('order_count'),
        (sum('amount') / count('order_id')).alias('avg_order_value')
    )

# Data quality checks
assert revenue_by_category.count() > 0, "No revenue data found"
assert revenue_by_category.filter(col('total_revenue') < 0).count() == 0, "Negative revenue!"

# 3. LOAD: Write to warehouse
warehouse_url = "jdbc:postgresql://warehouse:5432/analytics"
revenue_by_category.write \
    .format("jdbc") \
    .option("url", warehouse_url) \
    .option("dbtable", "fact_daily_revenue") \
    .option("user", "warehouse_user") \
    .option("password", "warehouse_pass") \
    .mode("append") \
    .save()

print(f"✓ Loaded {revenue_by_category.count()} rows to warehouse")
```

---

## Spark in Docker

```dockerfile
FROM bitnami/spark:3.5.0

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY pipeline.py .

CMD ["spark-submit", "--master", "local[*]", "pipeline.py"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  spark-master:
    image: bitnami/spark:3.5.0
    environment:
      SPARK_MODE: master
      SPARK_RPC_AUTHENTICATION_ENABLED: "no"
      SPARK_RPC_ENCRYPTION_ENABLED: "no"
    ports:
      - "7077:7077"
      - "8080:8080"

  spark-worker:
    image: bitnami/spark:3.5.0
    environment:
      SPARK_MODE: worker
      SPARK_MASTER_URL: spark://spark-master:7077
    depends_on:
      - spark-master

  postgres:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: secret

  pipeline:
    build: .
    depends_on:
      - spark-master
      - postgres
    environment:
      SPARK_MASTER: spark://spark-master:7077
```

---

## Performance Tips

### Partitioning

Split data across cluster for parallel processing:

```python
# Read data partitioned by date
df = spark.read.parquet('data/transactions/year=2024/month=01/')

# Write with partitioning
df.write \
    .partitionBy('year', 'month') \
    .mode('overwrite') \
    .parquet('output/')
```

### Caching

Hold DataFrames in memory if reused:

```python
df = spark.read.csv('large_file.csv')

# Cache for reuse
df.cache()

# Now queries reuse cached version (fast)
df.groupBy('category').count().show()
df.filter(df.price > 100).show()

# Remove from cache
df.unpersist()
```

### Broadcast

Send small table to all workers (useful for joins):

```python
from pyspark.sql.functions import broadcast

# reference_data is small
result = orders.join(
    broadcast(reference_data),
    orders.category_id == reference_data.id
)
```

---

## Common Operations

| Operation | Code |
|-----------|------|
| **Row count** | `df.count()` |
| **Columns** | `df.columns` |
| **Schema** | `df.printSchema()` |
| **First row** | `df.first()` |
| **Distinct values** | `df.select('category').distinct().show()` |
| **Rename column** | `df.withColumnRenamed('old', 'new')` |
| **Add column** | `df.withColumn('new_col', df.price * 1.1)` |
| **Drop column** | `df.drop('old_col')` |
| **Sort** | `df.orderBy(desc('salary')).show()` |
| **Limit** | `df.limit(10).show()` |

---

## PySpark with Airflow

```python
from airflow import DAG
from airflow.operators.bash import BashOperator
from datetime import datetime

dag = DAG(
    dag_id='pyspark_pipeline',
    schedule_interval='@daily',
    start_date=datetime(2026, 1, 1),
)

# Submit Spark job
spark_job = BashOperator(
    task_id='run_spark_pipeline',
    bash_command="""
        spark-submit \
        --master local[*] \
        --driver-memory 4g \
        --executor-memory 4g \
        /app/pipeline.py
    """,
    dag=dag,
)
```

---

## Tips & Gotchas

- **Spark is lazy.** Transformations don't run until you call `.show()`, `.collect()`, or `.write()`.

```python
# ❌ This doesn't actually process
df.filter(df.salary > 1000)

# ✅ This triggers computation
df.filter(df.salary > 1000).show()
```

- **`.collect()` brings ALL data to driver.** Use carefully on large datasets.

```python
# ❌ Loads entire 100 GB into memory
data = df.collect()

# ✅ Safe—returns one row
df.limit(1).collect()
```

- **Schema inference is slow.** Specify schema explicitly for production.

```python
# ❌ Slow—scans file twice
df = spark.read.csv('file.csv', inferSchema=True)

# ✅ Fast—uses defined schema
from pyspark.sql.types import StructType, StructField, StringType, IntegerType

schema = StructType([
    StructField('name', StringType()),
    StructField('salary', IntegerType()),
])

df = spark.read.csv('file.csv', schema=schema)
```

---

## Related

- [[dbt-Data-Build-Tool]] — dbt for SQL transformations
- [[Apache-Airflow]] — Airflow orchestrates Spark jobs
- [[Docker-Compose]] — Run Spark in containers
- [[Cloud-Data-Warehouses]] — Spark on cloud platforms
- [[TOOLS-Learning-Roadmap]] — Your complete tools learning path

---

**Key Takeaway:**  
PySpark = distributed SQL + analytics at scale. Load data → transform via SQL or DataFrame API → write results. Essential for processing datasets that don't fit in memory. Master DataFrames, use SQL when possible, optimize with partitioning and caching.
