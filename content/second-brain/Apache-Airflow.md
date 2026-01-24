---
title: Apache Airflow for Data Pipelines
date: 2026-01-22
publish: true
description: Master Apache Airflow—DAGs, operators, scheduling, and monitoring. Build production-grade data orchestration.
tags:
  - airflow
  - orchestration
  - data-engineering
  - etl
category: second-brain
---
**Apache Airflow** is the industry standard for data pipeline orchestration. Instead of cron jobs and scripts, you define workflows as **DAGs** (Directed Acyclic Graphs)—code, version control, monitoring, retries, and error handling included.

---

## Core Concepts

### DAG (Directed Acyclic Graph)

A DAG is a workflow:
- **Directed:** Tasks flow in one direction (left to right)
- **Acyclic:** No loops (tasks don't repeat infinitely)
- **Graph:** Tasks are nodes, dependencies are edges

```
extract → transform_1 → load
            ↓
         transform_2 ↓
            ↓--------↓
             validate_final
```

---

## Your First DAG

```python
from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.operators.bash import BashOperator
from datetime import datetime, timedelta

# Default arguments for all tasks
default_args = {
    'owner': 'data-engineer',
    'start_date': datetime(2026, 1, 1),
    'retries': 2,
    'retry_delay': timedelta(minutes=5),
    'email_on_failure': ['admin@example.com'],
}

# Define DAG
dag = DAG(
    dag_id='my_first_pipeline',
    default_args=default_args,
    description='Simple ETL pipeline',
    schedule_interval='@daily',  # Run daily at midnight UTC
    catchup=False,  # Don't backfill past runs
)

# Python task
def extract_data(**context):
    """Extract data from source"""
    print("Extracting data...")
    data = {"rows": 1000, "status": "success"}
    return data

# Task 1: Extract
extract_task = PythonOperator(
    task_id='extract',
    python_callable=extract_data,
    dag=dag,
)

# Task 2: Transform (bash command)
transform_task = BashOperator(
    task_id='transform',
    bash_command='echo "Transforming data..."',
    dag=dag,
)

# Task 3: Load
load_task = BashOperator(
    task_id='load',
    bash_command='echo "Loading to warehouse..."',
    dag=dag,
)

# Define dependencies: extract → transform → load
extract_task >> transform_task >> load_task
```

---

## Operators (Task Types)

| Operator | Use Case |
|----------|----------|
| `PythonOperator` | Run Python functions |
| `BashOperator` | Run bash commands |
| `SqlOperator` | Execute SQL queries |
| `PostgresOperator` | PostgreSQL-specific operations |
| `EmailOperator` | Send emails on events |
| `TriggerDagRunOperator` | Trigger another DAG |
| `SensorOperator` | Wait for a condition (file, DB, time) |

### PythonOperator Example

```python
def transform_data(ti):
    """
    Transform data. 'ti' = task instance.
    Use ti.xcom_push() to share data between tasks.
    """
    # Pull data from previous task
    data = ti.xcom_pull(task_ids='extract')
    
    # Transform
    transformed = {**data, 'transformed': True}
    
    # Push to next task
    ti.xcom_push(key='transformed_data', value=transformed)
    
    return transformed

transform = PythonOperator(
    task_id='transform',
    python_callable=transform_data,
    provide_context=True,  # Pass 'ti' parameter
    dag=dag,
)
```

### Sensor (Wait for Condition)

```python
from airflow.sensors.filesystem import FileSensor
from airflow.sensors.sql import SqlSensor

# Wait for a file to arrive
wait_for_file = FileSensor(
    task_id='wait_for_file',
    filepath='/data/incoming/file.csv',
    poke_interval=60,  # Check every 60 seconds
    timeout=3600,      # Timeout after 1 hour
    dag=dag,
)

# Wait for rows in database
wait_for_data = SqlSensor(
    task_id='wait_for_data',
    conn_id='postgres_warehouse',
    sql='SELECT COUNT(*) FROM staging.raw_data WHERE created_at > NOW() - INTERVAL 1 HOUR',
    poke_interval=30,
    dag=dag,
)
```

---

## Scheduling

```python
# These all go in DAG constructor:

# Daily at 2 AM UTC
schedule_interval='0 2 * * *'  # Cron format

# Every 6 hours
schedule_interval=timedelta(hours=6)

# Daily preset
schedule_interval='@daily'

# Other presets: @hourly, @weekly, @monthly, @yearly, @once

# No automatic schedule (trigger manually)
schedule_interval=None
```

---

## Error Handling & Retries

```python
default_args = {
    'owner': 'data-engineer',
    'start_date': datetime(2026, 1, 1),
    
    # Retry configuration
    'retries': 3,                           # Retry up to 3 times
    'retry_delay': timedelta(minutes=5),    # Wait 5 min between retries
    'retry_exponential_backoff': True,      # Double wait time each retry
    'max_retry_delay': timedelta(hours=1),  # Cap retry delay at 1 hour
    
    # Alerting
    'email_on_failure': ['ops@example.com'],
    'email_on_retry': False,
}

dag = DAG(
    dag_id='pipeline_with_error_handling',
    default_args=default_args,
    description='ETL with retries',
    on_failure_callback=notify_failure,  # Custom error handler
)
```

---

## Task Dependencies (Complex Workflows)

```python
# Linear: A → B → C
a >> b >> c

# Branching: A → (B, C, D)
a >> [b, c, d]

# Multiple upstream: (A, B, C) → D
[a, b, c] >> d

# Complex DAG:
extract >> [transform1, transform2]
transform1 >> [validate1, validate2]
transform2 >> [validate1, validate2]
[validate1, validate2] >> load
```

---

## Real-World ETL Pipeline

```python
from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.operators.postgres_operator import PostgresOperator
from datetime import datetime, timedelta
import pandas as pd
from sqlalchemy import create_engine

default_args = {
    'owner': 'data-team',
    'start_date': datetime(2026, 1, 1),
    'retries': 2,
    'retry_delay': timedelta(minutes=10),
}

dag = DAG(
    dag_id='etl_daily_pipeline',
    default_args=default_args,
    schedule_interval='0 2 * * *',  # 2 AM daily
)

def extract_from_source(**context):
    """Extract from PostgreSQL source"""
    engine = create_engine('postgresql://source_user:pass@source:5432/source_db')
    query = "SELECT * FROM transactions WHERE created_at > NOW() - INTERVAL '1 day'"
    df = pd.read_sql(query, engine)
    
    # Save row count for monitoring
    context['ti'].xcom_push(key='row_count', value=len(df))
    
    # Save to local CSV for next task
    df.to_csv('/tmp/transactions.csv', index=False)

def validate_data(**context):
    """Data quality checks"""
    df = pd.read_csv('/tmp/transactions.csv')
    
    # Checks
    assert df['amount'].notna().all(), "Found NULL amounts"
    assert (df['amount'] > 0).all(), "Found negative amounts"
    
    print(f"✓ Validated {len(df)} rows")

def load_to_warehouse(**context):
    """Load to PostgreSQL warehouse"""
    df = pd.read_csv('/tmp/transactions.csv')
    
    engine = create_engine('postgresql://warehouse_user:pass@warehouse:5432/prod_db')
    df.to_sql('fact_transactions', engine, if_exists='append', index=False)
    
    print(f"✓ Loaded {len(df)} rows to warehouse")

# Define tasks
extract = PythonOperator(
    task_id='extract',
    python_callable=extract_from_source,
    dag=dag,
)

validate = PythonOperator(
    task_id='validate',
    python_callable=validate_data,
    dag=dag,
)

load = PythonOperator(
    task_id='load',
    python_callable=load_to_warehouse,
    dag=dag,
)

# SQL task: Update metadata
update_metadata = PostgresOperator(
    task_id='update_metadata',
    sql="""
    UPDATE pipeline_metadata 
    SET last_run = NOW(), status = 'success' 
    WHERE pipeline_id = 'etl_daily_pipeline'
    """,
    postgres_conn_id='warehouse',
    dag=dag,
)

# Dependencies
extract >> validate >> load >> update_metadata
```

---

## Running Airflow Locally

```bash
# Initialize database
airflow db init

# Create user
airflow users create --username admin --password admin --firstname Admin --lastname User --role Admin --email admin@example.com

# Start web UI (localhost:8080)
airflow webserver -p 8080

# Start scheduler (in another terminal)
airflow scheduler

# Test a DAG
airflow dags test my_first_pipeline 2026-01-22

# Run a specific task
airflow tasks test my_first_pipeline extract 2026-01-22
```

---

## Airflow in Docker Compose

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: airflow
      POSTGRES_PASSWORD: airflow
    volumes:
      - postgres_data:/var/lib/postgresql/data

  airflow_webserver:
    image: apache/airflow:2.7.0
    environment:
      AIRFLOW__CORE__SQL_ALCHEMY_CONN: "postgresql+psycopg2://postgres:airflow@postgres:5432/airflow"
      AIRFLOW__CORE__EXECUTOR: LocalExecutor
    ports:
      - "8080:8080"
    volumes:
      - ./dags:/opt/airflow/dags
      - ./logs:/opt/airflow/logs
    command: airflow webserver
    depends_on:
      - postgres

  airflow_scheduler:
    image: apache/airflow:2.7.0
    environment:
      AIRFLOW__CORE__SQL_ALCHEMY_CONN: "postgresql+psycopg2://postgres:airflow@postgres:5432/airflow"
      AIRFLOW__CORE__EXECUTOR: LocalExecutor
    volumes:
      - ./dags:/opt/airflow/dags
      - ./logs:/opt/airflow/logs
    command: airflow scheduler
    depends_on:
      - postgres

volumes:
  postgres_data:
```

---

## Tips & Gotchas

- **DAG ID must be unique.** Airflow uses it to identify the DAG.

```python
dag = DAG(dag_id='my_unique_pipeline_name', ...)
```

- **Task IDs must be unique within a DAG.** But can repeat across DAGs.

```python
extract = PythonOperator(task_id='extract', ...)  # Unique per DAG
```

- **start_date matters.** Airflow backfills from start_date if `catchup=True`.

```python
# If start_date is 2020-01-01 and catchup=True, Airflow will run all daily runs until today
start_date=datetime(2026, 1, 1),
catchup=False,  # Don't backfill
```

- **XCom is for small data only.** Don't use it for GB-sized datasets.

```python
# ✅ Good: small values
ti.xcom_push(key='status', value='success')

# ❌ Bad: huge dataset
ti.xcom_push(key='data', value=large_dataframe)  # Use files instead
```

---

## Related

- [[Docker-Compose]] — Run Airflow in containers
- [[10-Python-for-Data-Engineering]] — Write Python operators
- [[05-PostgreSQL-for-Data-Engineering]] — Airflow with PostgreSQL
- [[TOOLS-Learning-Roadmap]] — Your complete tools learning path

---

**Key Takeaway:**  
Airflow = workflow orchestration. Define DAGs (tasks + dependencies), set schedules, add retries, get monitoring. Version control your pipelines, scale horizontally with executors, and sleep knowing your data pipelines run reliably.
