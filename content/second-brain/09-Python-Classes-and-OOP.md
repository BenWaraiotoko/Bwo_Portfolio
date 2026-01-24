---
title: Python Classes & Object-Oriented Programming (OOP)
date: 2026-01-22
publish: true
description: Master Python OOP—classes, inheritance, polymorphism, and design patterns. Essential for writing scalable data engineering code.
tags:
  - python
  - oop
  - classes
  - design-patterns
  - data-engineering
category: second-brain
---
# Python Classes & Object-Oriented Programming

**OOP** lets you organize code into reusable, maintainable objects. Instead of writing procedural scripts, you build abstractions that model real-world concepts. Essential for production data engineering code.

---

## Why OOP for Data Engineering?

**Without OOP (procedural):**
```python
# Messy, hard to maintain
transactions = []
users = []
orders = []

def process_transaction(trans):
    # 50 lines of logic
    pass

def process_user(user):
    # 50 lines of logic
    pass

# No reusability, no structure
```

**With OOP:**
```python
class DataEntity:
    """Base class for all data objects"""
    def validate(self):
        pass
    def transform(self):
        pass

class Transaction(DataEntity):
    """Specific behavior for transactions"""
    pass

class User(DataEntity):
    """Specific behavior for users"""
    pass
```

**Benefits:**
- Reusable code (DRY principle)
- Clear structure
- Easy to test
- Scalable

---

## Core Concepts

### 1. Classes (Blueprints)

A class is a template for creating objects.

```python
# Define a class
class User:
    """Represents a user in the system"""
    
    def __init__(self, name, email):
        """Constructor - runs when object is created"""
        self.name = name
        self.email = email
    
    def get_info(self):
        """Method - function belonging to the object"""
        return f"{self.name} ({self.email})"

# Create instances (objects)
user1 = User("Alice", "alice@example.com")
user2 = User("Bob", "bob@example.com")

# Call methods
print(user1.get_info())  # Alice (alice@example.com)
```

**Parts:**
- **Class name:** `User` (capitalized)
- **`__init__`:** Constructor (called when creating instance)
- **`self`:** Reference to the object itself
- **Attributes:** `name`, `email` (data)
- **Methods:** `get_info()` (behavior)

### 2. Attributes (Data)

Store state in objects.

```python
class Order:
    def __init__(self, order_id, customer, amount, status="pending"):
        # Instance attributes (unique per object)
        self.order_id = order_id
        self.customer = customer
        self.amount = amount
        self.status = status

order = Order(1, "Alice", 100.50)
print(order.status)  # pending

order.status = "completed"  # Modify attribute
print(order.status)  # completed
```

### 3. Methods (Behavior)

Functions that operate on object data.

```python
class Product:
    def __init__(self, name, price, tax_rate=0.1):
        self.name = name
        self.price = price
        self.tax_rate = tax_rate
    
    def get_tax(self):
        """Calculate tax"""
        return self.price * self.tax_rate
    
    def get_total_price(self):
        """Price + tax"""
        return self.price + self.get_tax()
    
    def apply_discount(self, discount_percent):
        """Apply discount to price"""
        self.price = self.price * (1 - discount_percent / 100)

product = Product("Laptop", 1000)
print(product.get_total_price())  # 1100.0
product.apply_discount(10)  # 10% off
print(product.get_total_price())  # 990.0
```

---

## Inheritance (Code Reuse)

Create specialized classes from general ones.

### Concept

```python
# Parent class (general)
class DataPipeline:
    def __init__(self, name):
        self.name = name
    
    def validate(self):
        return True
    
    def transform(self):
        raise NotImplementedError("Subclasses must implement")
    
    def load(self):
        raise NotImplementedError("Subclasses must implement")

# Child classes (specific)
class ELTPipeline(DataPipeline):
    """Extract, Load, Transform"""
    def transform(self):
        print("Transform in warehouse")
    
    def load(self):
        print("Load to warehouse")

class ETLPipeline(DataPipeline):
    """Extract, Transform, Load"""
    def transform(self):
        print("Transform before load")
    
    def load(self):
        print("Load transformed data")

# Use them
elt = ELTPipeline("elt_pipe")
etl = ETLPipeline("etl_pipe")

print(elt.validate())  # Inherited method
elt.transform()        # ELT version
```

### Inheritance Hierarchy

```
DataPipeline (parent)
    ↓
    ├─ ELTPipeline (child)
    ├─ ETLPipeline (child)
    └─ StreamingPipeline (child)
```

---

## Polymorphism (Same Interface, Different Behavior)

Different objects respond to the same method call differently.

```python
class DataSource:
    def fetch_data(self):
        raise NotImplementedError()

class PostgresSource(DataSource):
    def fetch_data(self):
        return "SELECT * FROM table"

class APISource(DataSource):
    def fetch_data(self):
        return requests.get("https://api.example.com/data")

class CSVSource(DataSource):
    def fetch_data(self):
        return pd.read_csv("data.csv")

# Same code works for all
def extract_data(source: DataSource):
    """Works with ANY data source"""
    data = source.fetch_data()
    return data

# Use with any source
postgres = PostgresSource()
api = APISource()
csv = CSVSource()

extract_data(postgres)  # SQL query
extract_data(api)       # API call
extract_data(csv)       # CSV read
```

---

## Encapsulation (Hide Implementation Details)

Control access to object data.

```python
class DatabaseConnection:
    def __init__(self, host, username, password):
        # Private attributes (by convention, prefix with _)
        self._host = host
        self._username = username
        self._password = password  # Don't expose password!
        self._connection = None
    
    # Public method
    def connect(self):
        """Connect to database"""
        self._connection = self._make_connection()
        return self._connection
    
    # Private method (internal use only)
    def _make_connection(self):
        """Internal connection logic"""
        return f"Connected to {self._host}"
    
    # Property (controlled access)
    @property
    def host(self):
        """Safe read-only access"""
        return self._host

db = DatabaseConnection("localhost", "user", "secret")
print(db.host)              # localhost (safe)
print(db._password)         # secret (accessible but shouldn't be!)
db.connect()                # Call public method
```

**Convention:**
- **Public:** `self.name` (use freely)
- **Private:** `self._name` (internal use only)

---

## Data Classes (Python 3.7+)

Cleaner syntax for simple data objects.

```python
from dataclasses import dataclass

# Old way (verbose)
class User:
    def __init__(self, name, email, age):
        self.name = name
        self.email = email
        self.age = age

# New way (concise)
@dataclass
class User:
    name: str
    email: str
    age: int

user = User("Alice", "alice@example.com", 30)
print(user)  # User(name='Alice', email='alice@example.com', age=30)
```

**Automatically generates:**
- `__init__`
- `__repr__` (readable representation)
- `__eq__` (equality comparison)

---

## Real-World Data Engineering Example

### ETL Pipeline with OOP

```python
from abc import ABC, abstractmethod
from datetime import datetime

class ELTStage(ABC):
    """Abstract base for pipeline stages"""
    
    def __init__(self, name):
        self.name = name
        self.start_time = None
        self.end_time = None
    
    @abstractmethod
    def execute(self):
        """All stages must implement execute"""
        pass
    
    def log(self, message):
        """Common logging"""
        print(f"[{self.name}] {message}")

class ExtractStage(ELTStage):
    """Extract from source"""
    
    def __init__(self, name, source):
        super().__init__(name)
        self.source = source
    
    def execute(self):
        self.start_time = datetime.now()
        self.log(f"Extracting from {self.source}")
        # Extraction logic
        data = {"rows": 1000}
        self.end_time = datetime.now()
        return data

class LoadStage(ELTStage):
    """Load to warehouse"""
    
    def __init__(self, name, warehouse):
        super().__init__(name)
        self.warehouse = warehouse
    
    def execute(self):
        self.start_time = datetime.now()
        self.log(f"Loading to {self.warehouse}")
        # Load logic
        self.log("✓ Loaded successfully")
        self.end_time = datetime.now()

class TransformStage(ELTStage):
    """Transform in warehouse"""
    
    def execute(self):
        self.start_time = datetime.now()
        self.log("Running dbt models")
        # Transform logic
        self.log("✓ Transformed successfully")
        self.end_time = datetime.now()

class DataPipeline:
    """Orchestrate pipeline stages"""
    
    def __init__(self, name):
        self.name = name
        self.stages = []
    
    def add_stage(self, stage: ELTStage):
        self.stages.append(stage)
    
    def run(self):
        print(f"\n🚀 Starting pipeline: {self.name}")
        for stage in self.stages:
            stage.execute()
        print(f"✅ Pipeline complete!\n")

# Build pipeline
pipeline = DataPipeline("daily_etl")
pipeline.add_stage(ExtractStage("Extract", "PostgreSQL"))
pipeline.add_stage(LoadStage("Load", "Snowflake"))
pipeline.add_stage(TransformStage("Transform", "dbt"))

# Run
pipeline.run()

# Output:
# 🚀 Starting pipeline: daily_etl
# [Extract] Extracting from PostgreSQL
# [Load] Loading to Snowflake
# [Load] ✓ Loaded successfully
# [Transform] Running dbt models
# [Transform] ✓ Transformed successfully
# ✅ Pipeline complete!
```

---

## Design Patterns for Data Engineers

### Factory Pattern

Create objects without specifying exact class.

```python
class ConnectorFactory:
    @staticmethod
    def create_connector(connector_type, host, **kwargs):
        if connector_type == "postgres":
            return PostgresConnector(host, **kwargs)
        elif connector_type == "snowflake":
            return SnowflakeConnector(host, **kwargs)
        elif connector_type == "bigquery":
            return BigQueryConnector(**kwargs)
        else:
            raise ValueError(f"Unknown type: {connector_type}")

# Use
postgres_conn = ConnectorFactory.create_connector("postgres", "localhost")
sf_conn = ConnectorFactory.create_connector("snowflake", "account.region")
```

### Singleton Pattern

Ensure only one instance exists (e.g., logger).

```python
class Logger:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    def log(self, message):
        print(f"[LOG] {message}")

logger1 = Logger()
logger2 = Logger()
print(logger1 is logger2)  # True (same object)
```

### Observer Pattern

Notify multiple objects about changes.

```python
class PipelineObserver:
    def update(self, status):
        raise NotImplementedError()

class EmailNotifier(PipelineObserver):
    def update(self, status):
        print(f"📧 Sending email: Pipeline {status}")

class SlackNotifier(PipelineObserver):
    def update(self, status):
        print(f"💬 Posting to Slack: Pipeline {status}")

class Pipeline:
    def __init__(self):
        self.observers = []
    
    def subscribe(self, observer):
        self.observers.append(observer)
    
    def notify(self, status):
        for observer in self.observers:
            observer.update(status)
    
    def run(self):
        self.notify("started")
        # Pipeline logic
        self.notify("completed")

# Use
pipeline = Pipeline()
pipeline.subscribe(EmailNotifier())
pipeline.subscribe(SlackNotifier())
pipeline.run()

# Output:
# 📧 Sending email: Pipeline started
# 💬 Posting to Slack: Pipeline started
# 📧 Sending email: Pipeline completed
# 💬 Posting to Slack: Pipeline completed
```

---

## Special Methods (Dunder Methods)

Python's built-in behavior customization.

```python
class Dataset:
    def __init__(self, name, rows=0):
        self.name = name
        self.rows = rows
    
    # String representation
    def __str__(self):
        return f"Dataset: {self.name} ({self.rows} rows)"
    
    # Developer representation
    def __repr__(self):
        return f"Dataset(name={self.name!r}, rows={self.rows})"
    
    # Length
    def __len__(self):
        return self.rows
    
    # Comparison
    def __eq__(self, other):
        return self.rows == other.rows
    
    def __lt__(self, other):
        return self.rows < other.rows
    
    # Iteration
    def __iter__(self):
        for i in range(self.rows):
            yield f"row_{i}"

ds = Dataset("transactions", 1000)
print(str(ds))       # Dataset: transactions (1000 rows)
print(len(ds))       # 1000
print(ds < Dataset("users", 2000))  # True
for row in ds:       # Iterate over rows
    print(row)       # row_0, row_1, ...
```

---

## Tips & Best Practices

| Practice | Why | Example |
|----------|-----|---------|
| **Single Responsibility** | Class does one thing well | `DataValidator` validates data only |
| **DRY (Don't Repeat)** | Reuse code via inheritance | `BaseStage` for common pipeline logic |
| **Composition over Inheritance** | Prefer has-a over is-a | Pipeline *has* stages, not *is* a stage |
| **Type Hints** | Clarify expected types | `def load(self, data: pd.DataFrame) -> None` |
| **Docstrings** | Document purpose | `"""Load data to warehouse"""` |
| **Private Methods** | Hide implementation | `def _validate_schema(self)` |

---

## Common Mistakes

```python
# ❌ Mutable default arguments
class Pipeline:
    def __init__(self, stages=[]):  # Shared across instances!
        self.stages = stages

# ✅ Use None
class Pipeline:
    def __init__(self, stages=None):
        self.stages = stages or []

# ❌ Too much inheritance
class ETLPipeline(DataPipeline, Loggable, Monitorable, ...):
    pass

# ✅ Use composition
class ETLPipeline(DataPipeline):
    def __init__(self):
        self.logger = Logger()
        self.monitor = Monitor()

# ❌ God object (does everything)
class DataPipeline:
    def extract(self): ...
    def transform(self): ...
    def load(self): ...
    def validate(self): ...
    def log(self): ...
    def alert(self): ...

# ✅ Separate concerns
class DataPipeline:
    def __init__(self, logger, validator):
        self.logger = logger
        self.validator = validator
```

---

## Related

- [[10-Python-for-Data-Engineering]] — Python for DE
- [[01-Python-Loops]] — Control flow
- [[02-Python-Control-Flow]] — Conditionals
- [[03-Python-Modules-Functions-Lists]] — Functions & modules
- [[Docker-Fundamentals]] — Package Python code
- [[Apache-Airflow]] — Airflow uses OOP extensively
- [[1-Fundamentals-Hub]] — Your learning guide

---

**Key Takeaway:**  
OOP = organize code into reusable objects. Use classes for data structures, inheritance for code reuse, polymorphism for flexibility. Master OOP and you'll write production-grade data engineering code.
