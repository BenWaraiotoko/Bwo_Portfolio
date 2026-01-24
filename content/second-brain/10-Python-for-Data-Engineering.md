---
title: Python for Data Engineering (Complete)
date: 2026-01-22
publish: true
description: Comprehensive guide to Python libraries and patterns for production data pipelines.
tags:
  - python
  - data-engineering
  - pandas
  - pyspark
  - etl
category: second-brain
---
**Data Engineering in Python** means moving data reliably from source to destination, transforming it along the way, and doing it at scale. This page covers the libraries, patterns, and practices you'll use every day in production pipelines—from pandas DataFrames to PySpark clusters to Airflow orchestration.

---

## Essential Libraries Overview

| Library | Purpose | When to Use |
|---------|---------|-------------|
| **pandas** | DataFrame manipulation | Small-medium datasets (<10GB in memory) |
| **polars** | Fast DataFrame library | Performance-critical transforms, modern Python |
| **SQLAlchemy** | SQL toolkit & ORM | Database abstraction, migrations |
| **PySpark** | Distributed computing | Large datasets (>100GB), cluster processing |
| **requests** | HTTP client | API calls, webhooks |
| **boto3** | AWS SDK | S3, Lambda, DynamoDB access |
| **logging** | Structured logging | Pipeline observability, debugging |

---

## Data Import/Export Patterns

### Reading Data (Multiple Sources)

```python
import pandas as pd
from sqlalchemy import create_engine

# CSV
df = pd.read_csv('data.csv', parse_dates=['date'], dtype={'id': str})

# SQL Database
engine = create_engine('postgresql://user:pass@host:5432/db')
df = pd.read_sql('SELECT * FROM table WHERE date > %(date)s',
                 engine, params={'date': '2026-01-01'})

# Parquet (columnar, efficient)
df = pd.read_parquet('data.parquet')

# JSON Lines (streaming format)
df = pd.read_json('data.jsonl', lines=True)
```

### Writing Data (Multiple Destinations)

```python
# CSV (simple but slow for large files)
df.to_csv('output.csv', index=False)

# Parquet (recommended for production)
df.to_parquet('output.parquet', compression='snappy')

# Database
df.to_sql('target_table', engine, if_exists='append', 
          index=False, method='multi', chunksize=1000)

# JSON Lines
df.to_json('output.jsonl', orient='records', lines=True)
```

---

## Core Data Transformation Patterns

### Cleaning & Validation

```python
def clean_data(df: pd.DataFrame) -> pd.DataFrame:
    """Standardized data cleaning pipeline."""
    # Remove duplicates
    df = df.drop_duplicates(subset=['id'], keep='first')
    
    # Handle missing values
    df['age'].fillna(df['age'].median(), inplace=True)
    df.dropna(subset=['critical_column'], inplace=True)
    
    # Fix types
    df['created_at'] = pd.to_datetime(df['created_at'])
    df['user_id'] = df['user_id'].astype(str)
    
    # String normalization
    df['email'] = df['email'].str.lower().str.strip()
    df['phone'] = df['phone'].str.replace('-', '', regex=False)
    
    return df
```

### Filtering & Selection

```python
# Filter rows
active_users = df[df['status'] == 'active']

# Complex filter (readable with .query())
expensive_recent = df.query('amount > 100 and created_at > @cutoff_date')

# Select columns
subset = df[['id', 'name', 'email']]

# Column-wise operations
df['amount_usd'] = df['amount_cents'] / 100
df['is_premium'] = df['tier'].isin(['gold', 'platinum'])
```

### Grouping & Aggregation

```python
# Simple groupby
daily_revenue = df.groupby('date')['amount'].sum()

# Multiple aggregations
summary = df.groupby('user_id').agg({
    'amount': ['sum', 'mean', 'max'],
    'transaction_id': 'count',
    'created_at': 'min'
}).reset_index()

# Group & transform (add back to original shape)
df['user_total'] = df.groupby('user_id')['amount'].transform('sum')
df['rank_by_date'] = df.groupby('date').cumcount() + 1
```

### Joining Data

```python
# Inner join (rows present in both)
merged = pd.merge(users, orders, on='user_id', how='inner')

# Left join (all rows from left, matching from right)
merged = pd.merge(orders, users, on='user_id', how='left')

# Join on different column names
merged = pd.merge(df1, df2, left_on='user_id', right_on='customer_id')

# Multiple keys
merged = pd.merge(df1, df2, on=['user_id', 'date'])
```

---

## ETL Pipeline Structure

### The Classic Extract-Transform-Load Pattern

```python
import logging
from datetime import datetime, timedelta
from sqlalchemy import create_engine
import pandas as pd

logger = logging.getLogger(__name__)

def extract(source_db: str, execution_date: str) -> pd.DataFrame:
    """Extract raw data from source."""
    logger.info(f"Extracting data for {execution_date}")
    
    engine = create_engine(source_db)
    query = """
        SELECT id, user_id, amount, created_at
        FROM transactions
        WHERE DATE(created_at) = %(date)s
    """
    
    try:
        df = pd.read_sql(query, engine, params={'date': execution_date})
        logger.info(f"✓ Extracted {len(df):,} rows")
        return df
    except Exception as e:
        logger.error(f"✗ Extract failed: {e}", exc_info=True)
        raise

def transform(df: pd.DataFrame) -> pd.DataFrame:
    """Apply business logic and validations."""
    logger.info("Starting transformations")
    
    # Validate input
    if df.empty:
        logger.warning("Empty dataset received")
        return df
    
    # Data cleaning
    df = df.dropna(subset=['user_id', 'amount'])
    df = df[df['amount'] > 0]
    
    # Feature engineering
    df['amount_usd'] = df['amount'] / 100
    df['date'] = pd.to_datetime(df['created_at']).dt.date
    df['hour'] = pd.to_datetime(df['created_at']).dt.hour
    
    # Deduplication
    df = df.drop_duplicates(subset=['id'])
    
    logger.info(f"✓ Transformed {len(df):,} rows")
    return df[['id', 'user_id', 'amount_usd', 'date', 'hour']]

def load(df: pd.DataFrame, target_db: str, table_name: str) -> int:
    """Load transformed data to warehouse."""
    logger.info(f"Loading {len(df):,} rows to {table_name}")
    
    try:
        engine = create_engine(target_db)
        
        # Use method='multi' for better performance
        df.to_sql(table_name, engine, if_exists='append', 
                  index=False, method='multi', chunksize=1000)
        
        logger.info(f"✓ Loaded {len(df):,} rows successfully")
        return len(df)
    except Exception as e:
        logger.error(f"✗ Load failed: {e}", exc_info=True)
        raise

def run_pipeline(execution_date: str, source_db: str, target_db: str) -> dict:
    """Orchestrate ETL pipeline."""
    logger.info(f"Starting pipeline for {execution_date}")
    start_time = datetime.now()
    
    try:
        # Extract
        raw_data = extract(source_db, execution_date)
        
        # Transform
        clean_data = transform(raw_data)
        
        # Load
        rows_loaded = load(clean_data, target_db, 'fact_transactions')
        
        duration = (datetime.now() - start_time).total_seconds()
        logger.info(f"✓ Pipeline completed in {duration:.2f}s")
        
        return {
            'status': 'success',
            'rows_processed': len(raw_data),
            'rows_loaded': rows_loaded,
            'duration_seconds': duration
        }
    
    except Exception as e:
        logger.error(f"✗ Pipeline failed: {e}", exc_info=True)
        return {
            'status': 'failed',
            'error': str(e)
        }

# Entry point
if __name__ == '__main__':
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    result = run_pipeline(
        execution_date='2026-01-22',
        source_db='postgresql://source_user:pass@source:5432/source_db',
        target_db='postgresql://target_user:pass@warehouse:5432/target_db'
    )
    
    print(result)
```

---

## Production Best Practices

### 1. Error Handling & Retry Logic

```python
import time
from functools import wraps
from typing import Callable, Any

def retry(max_attempts: int = 3, delay: float = 1.0, backoff: float = 2.0):
    """Decorator to retry functions with exponential backoff."""
    def decorator(func: Callable) -> Callable:
        def wrapper(*args, **kwargs) -> Any:
            attempt = 0
            current_delay = delay
            
            while attempt < max_attempts:
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    attempt += 1
                    if attempt >= max_attempts:
                        logger.error(f"{func.__name__} failed after {max_attempts} attempts")
                        raise
                    
                    logger.warning(
                        f"{func.__name__} attempt {attempt}/{max_attempts} failed, "
                        f"retrying in {current_delay}s: {e}"
                    )
                    time.sleep(current_delay)
                    current_delay *= backoff
        
        return wrapper
    return decorator

@retry(max_attempts=5, delay=1.0, backoff=2.0)
def fetch_from_api(url: str) -> dict:
    """Fetch data with automatic retries."""
    response = requests.get(url, timeout=5)
    response.raise_for_status()
    return response.json()
```

### 2. Data Quality Validation

```python
def validate_dataframe(df: pd.DataFrame, schema: dict) -> bool:
    """Validate DataFrame against schema."""
    # Check required columns
    missing_cols = set(schema.keys()) - set(df.columns)
    if missing_cols:
        logger.error(f"Missing columns: {missing_cols}")
        return False
    
    # Check types and constraints
    for col, dtype_info in schema.items():
        expected_type = dtype_info['type']
        nullable = dtype_info.get('nullable', False)
        
        # Check nulls
        if not nullable and df[col].isna().any():
            logger.error(f"Column {col} has null values")
            return False
        
        # Check type (basic)
        if expected_type == 'numeric' and not pd.api.types.is_numeric_dtype(df[col]):
            logger.error(f"Column {col} is not numeric")
            return False
    
    logger.info("✓ Data validation passed")
    return True

# Usage
schema = {
    'id': {'type': 'numeric', 'nullable': False},
    'email': {'type': 'string', 'nullable': False},
    'created_at': {'type': 'datetime', 'nullable': False}
}

if not validate_dataframe(df, schema):
    raise ValueError("Data validation failed")
```

### 3. Incremental Processing

```python
def get_last_processed_date(target_db: str, table: str) -> str:
    """Get the date of last successful load."""
    engine = create_engine(target_db)
    query = f"SELECT MAX(created_at) FROM {table}"
    
    result = pd.read_sql(query, engine)
    last_date = result.iloc[0, 0]
    
    if pd.isna(last_date):
        # First run: start from a default date
        return '2026-01-01'
    
    return last_date.strftime('%Y-%m-%d')

# Only process new data
last_date = get_last_processed_date(target_db, 'transactions')
df = extract(source_db, start_date=last_date)
```

### 4. Logging & Monitoring

```python
import json
from datetime import datetime

def log_pipeline_event(stage: str, status: str, metrics: dict) -> None:
    """Log structured pipeline event."""
    event = {
        'timestamp': datetime.utcnow().isoformat(),
        'stage': stage,
        'status': status,
        **metrics
    }
    
    # Log as JSON for easy parsing
    logger.info(json.dumps(event))

# Usage
log_pipeline_event(
    stage='extract',
    status='success',
    metrics={
        'rows': 50000,
        'duration_seconds': 12.5,
        'file_size_mb': 125.3
    }
)
```

---

## Scaling Patterns

### When to Move from pandas to PySpark

Use **pandas** for:
- < 10GB of data
- Interactive/exploratory work
- Simple transformations
- Development & testing

Use **PySpark** for:
- > 100GB of data
- Complex distributed processing
- Production pipelines at scale
- When you need fault tolerance

### PySpark Example

```python
from pyspark.sql import SparkSession
from pyspark.sql.functions import col, sum as spark_sum, avg

spark = SparkSession.builder \
    .appName('ETL') \
    .config('spark.executor.memory', '4g') \
    .getOrCreate()

# Read
df = spark.read.parquet('large_data/')

# Transform
df_filtered = df.filter(col('amount') > 100)
df_agg = df_filtered.groupby('user_id').agg(
    spark_sum('amount').alias('total'),
    avg('amount').alias('avg_amount')
)

# Write
df_agg.write.mode('overwrite').parquet('output/')
```

---

## Related

- [[03-Python-Modules-Functions-Lists]] — Functions are ETL building blocks
- [[08-Python-Error-Handling]] — Try/except for robust pipelines
- [[06-Python-Type-Hints-Advanced]] — Type safety for data transformations
- [[05-Python-Data-Structures]] — Dictionaries & lists in data processing
- [pandas Documentation](https://pandas.pydata.org/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [PySpark Documentation](https://spark.apache.org/docs/latest/api/python/)

---

**Key Takeaway:**  
ETL is **Extract** (get data), **Transform** (clean & enrich), **Load** (store safely). Do it with error handling, logging, validation, and incremental processing. Start with pandas, scale to Spark as data grows.
