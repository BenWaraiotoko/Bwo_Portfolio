---
title: Pandas Fundamentals (Data Manipulation & Analysis)
date: 2026-03-08
publish: true
description: Master Pandas—Series, DataFrames, data cleaning, aggregation, merging, and preparing data for pipelines.
tags:
  - pandas
  - python
  - data-engineering
  - data-analysis
category: second-brain
---
**Pandas** is the go-to Python library for working with **structured, tabular data** that fits in memory. It's built on NumPy and gives you two core data structures—**Series** and **DataFrame**—with expressive, SQL-like operations. In a data pipeline, Pandas is typically used for **small-to-medium datasets** (up to a few GBs); use PySpark beyond that.

---

## Core Data Structures

### Series — 1D Labeled Array

```python
import pandas as pd

s = pd.Series([10, 20, 30], index=["a", "b", "c"])
print(s["b"])  # 20
```

### DataFrame — 2D Labeled Table

```python
df = pd.DataFrame({
    "name":   ["Alice", "Bob", "Charlie"],
    "salary": [1000,    2000,  1500],
    "dept":   ["eng",   "hr",  "eng"],
})

df.shape       # (3, 2)
df.dtypes      # column types
df.info()      # summary + null counts
df.describe()  # numeric stats
```

---

## Reading & Writing Data

```python
# Read
df = pd.read_csv("data.csv")
df = pd.read_parquet("data.parquet")
df = pd.read_json("data.json")
df = pd.read_sql("SELECT * FROM orders", con=engine)

# Write
df.to_csv("output.csv", index=False)
df.to_parquet("output.parquet", index=False)
df.to_sql("table_name", con=engine, if_exists="replace", index=False)
```

---

## Selecting Data

```python
# Column(s)
df["salary"]
df[["name", "salary"]]

# Rows by label — loc (inclusive on both ends)
df.loc[0:2, "name":"salary"]

# Rows by position — iloc (exclusive end)
df.iloc[0:2, 0:2]

# Boolean filter
df[df["salary"] > 1200]
df[(df["dept"] == "eng") & (df["salary"] > 1000)]
```

---

## Data Cleaning

### Handling Nulls

```python
df.isnull().sum()           # null count per column
df.dropna()                 # drop rows with any null
df.dropna(subset=["name"])  # drop only if specific col is null
df.fillna(0)                # replace nulls with 0
df["salary"].fillna(df["salary"].median(), inplace=True)
```

### Duplicates

```python
df.duplicated().sum()               # count duplicates
df.drop_duplicates()                # remove all duplicate rows
df.drop_duplicates(subset=["name"]) # deduplicate on specific column
```

### Types & Casting

```python
df["salary"] = df["salary"].astype(float)
df["date"]   = pd.to_datetime(df["date"])
df["code"]   = df["code"].astype("category")  # memory-efficient for low cardinality
```

### Renaming & Dropping

```python
df.rename(columns={"name": "full_name"}, inplace=True)
df.drop(columns=["dept"], inplace=True)
df.columns = df.columns.str.lower().str.replace(" ", "_")  # normalize headers
```

---

## Transforming Data

### Apply a Function

```python
df["salary_k"] = df["salary"].apply(lambda x: x / 1000)

# Row-wise (axis=1)
df["label"] = df.apply(lambda row: f"{row['name']} ({row['dept']})", axis=1)
```

### Map / Replace Values

```python
dept_map = {"eng": "Engineering", "hr": "Human Resources"}
df["dept_full"] = df["dept"].map(dept_map)

df["dept"].replace({"eng": "Engineering"}, inplace=True)
```

### String Operations

```python
df["name"].str.upper()
df["name"].str.strip()
df["email"].str.contains("@gmail")
df["name"].str.split(" ", expand=True)  # split into columns
```

### Date Operations

```python
df["date"] = pd.to_datetime(df["date"])
df["year"]  = df["date"].dt.year
df["month"] = df["date"].dt.month
df["dow"]   = df["date"].dt.day_name()
```

---

## Aggregations & GroupBy

```python
# Single aggregation
df.groupby("dept")["salary"].mean()

# Multiple aggregations
df.groupby("dept").agg(
    avg_salary=("salary", "mean"),
    max_salary=("salary", "max"),
    headcount=("name", "count"),
)

# Named agg with reset_index to flatten
summary = (
    df.groupby("dept")
    .agg(avg_salary=("salary", "mean"))
    .reset_index()
)
```

### Pivot Table

```python
pivot = df.pivot_table(
    values="salary",
    index="dept",
    columns="status",
    aggfunc="sum",
    fill_value=0,
)
```

---

## Merging & Joining

```python
orders   = pd.read_csv("orders.csv")
customers = pd.read_csv("customers.csv")

# Inner join (default)
merged = pd.merge(orders, customers, on="customer_id")

# Left join
merged = pd.merge(orders, customers, on="customer_id", how="left")

# Different key names
merged = pd.merge(orders, customers,
                  left_on="cust_id", right_on="id",
                  how="left")
```

### Concatenate

```python
# Stack rows (same columns)
combined = pd.concat([df_jan, df_feb, df_mar], ignore_index=True)

# Stack columns
combined = pd.concat([df_left, df_right], axis=1)
```

---

## Window Functions

```python
# Cumulative sum
df["running_total"] = df["amount"].cumsum()

# Rolling average (last 7 rows)
df["rolling_avg"] = df["amount"].rolling(window=7).mean()

# Rank within group
df["rank"] = df.groupby("dept")["salary"].rank(method="dense", ascending=False)
```

---

## Performance Tips

```python
# ✅ Use vectorized operations, not loops
df["tax"] = df["salary"] * 0.2          # fast
for i, row in df.iterrows():            # ❌ slow — avoid
    df.at[i, "tax"] = row["salary"] * 0.2

# ✅ Filter early to reduce data size
df = df[df["date"] >= "2026-01-01"]

# ✅ Use category dtype for string columns with few unique values
df["dept"] = df["dept"].astype("category")

# ✅ Read only needed columns
df = pd.read_csv("data.csv", usecols=["id", "amount", "date"])

# ✅ Read in chunks for large files
for chunk in pd.read_csv("big.csv", chunksize=100_000):
    process(chunk)
```

---

## Pandas vs PySpark

| Scenario | Use |
|---|---|
| < ~1 GB, fits in RAM | **Pandas** |
| > a few GB, cluster available | **PySpark** |
| Local dev / prototyping | **Pandas** |
| Production pipeline at scale | **PySpark** |
| Quick data exploration | **Pandas** |

---

## Common Patterns in Data Engineering

```python
# Load → Clean → Validate → Export (mini ELT step)
df = pd.read_csv("raw_orders.csv")

# Clean
df.columns    = df.columns.str.lower().str.replace(" ", "_")
df["amount"]  = pd.to_numeric(df["amount"], errors="coerce")
df["date"]    = pd.to_datetime(df["date"])
df.drop_duplicates(subset=["order_id"], inplace=True)

# Validate
assert df["order_id"].notna().all(), "Missing order IDs"
assert (df["amount"] > 0).all(),     "Non-positive amounts"

# Export
df.to_parquet("staging/orders_cleaned.parquet", index=False)
```

---

## Related

- [[PySpark-Fundamentals]] — When data outgrows memory
- [[Python-Fundamentals-Roadmap]] — Python prerequisites
- [[Python-for-Data-Engineering]] — Python patterns for pipelines
- [[PostgreSQL-for-Data-Engineering]] — When to use SQL instead
- [[dbt-Data-Build-Tool]] — SQL-based transformations in the warehouse

---

**Last Updated:** 2026-03-08
**Status:** Reference note
