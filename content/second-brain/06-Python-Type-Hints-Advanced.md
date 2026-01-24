---
title: Python Type Hints (Advanced)
date: 2026-01-22
publish: true
description: Master advanced type hints—write self-documenting, production-ready Python code for data engineering.
tags:
  - python
  - type-hints
  - typing
  - fundamentals
  - mypy
category: second-brain
---
**Type hints** tell Python (and other developers) what types your variables, parameters, and return values should be. While basic type hints (`x: int`, `def func(a: str) -> bool:`) are straightforward, advanced hints unlock IDE intelligence, catch bugs before runtime, and make code self-documenting—essential for production data pipelines.

---

## Basic Type Hints Refresher

```python
# Function with type hints
def calculate_average(numbers: list[int]) -> float:
    """Calculate the average of integers."""
    return sum(numbers) / len(numbers)

# Variable type hints
name: str = "Alice"
age: int = 30
salary: float = 50000.50
is_active: bool = True
```

---

## Advanced Type Hints

### Optional: Value or None

`Optional[T]` means the value can be of type `T` or `None`. Use this for optional parameters.

```python
from typing import Optional

def find_user_by_id(user_id: int) -> Optional[str]:
    """Return user name or None if not found."""
    users = {1: "Alice", 2: "Bob"}
    return users.get(user_id)  # Returns None if not found

# With default None
def update_config(timeout: Optional[int] = None) -> None:
    """Update config with optional timeout."""
    timeout = timeout or 30  # Use 30 if None
    print(f"Timeout set to {timeout}s")
```

**Modern syntax (Python 3.10+):**
```python
def find_user_by_id(user_id: int) -> str | None:
    """Cleaner syntax using pipe operator."""
    users = {1: "Alice", 2: "Bob"}
    return users.get(user_id)
```

### Union: Multiple Types

`Union[A, B, C]` means the value can be any of the listed types.

```python
from typing import Union

def process_id(value: Union[int, str]) -> str:
    """Accept either an integer or string ID."""
    if isinstance(value, int):
        return f"ID-{value:05d}"
    else:
        return value.upper()

result1 = process_id(42)      # ✅ "ID-00042"
result2 = process_id("ABC")   # ✅ "ABC"
```

**Modern syntax (Python 3.10+):**
```python
def process_id(value: int | str) -> str:
    """Cleaner syntax using pipe operator."""
    if isinstance(value, int):
        return f"ID-{value:05d}"
    else:
        return value.upper()
```

### List, Dict, and Tuple with Type Parameters

Specify what types a collection contains.

```python
from typing import List, Dict, Tuple

# Lists
numbers: List[int] = [1, 2, 3]
names: List[str] = ["Alice", "Bob"]
mixed: List[int | str] = [1, "two", 3]

# Dictionaries
user_ages: Dict[str, int] = {"Alice": 30, "Bob": 25}
config: Dict[str, bool | int] = {"enabled": True, "retries": 3}

# Tuples (fixed length with specific types)
coordinates: Tuple[int, int] = (10, 20)
record: Tuple[str, int, float] = ("Alice", 30, 50000.50)

# Variable-length tuple
numbers_tuple: Tuple[int, ...] = (1, 2, 3, 4, 5)
```

**Modern syntax (Python 3.9+):**
```python
# Use built-in types directly (no need to import from typing)
numbers: list[int] = [1, 2, 3]
user_ages: dict[str, int] = {"Alice": 30, "Bob": 25}
coordinates: tuple[int, int] = (10, 20)
```

### Callable: Function Types

Specify that a parameter is a function with certain signature.

```python
from typing import Callable

def apply_operation(x: int, y: int, operation: Callable[[int, int], int]) -> int:
    """Apply an operation to two integers."""
    return operation(x, y)

def add(a: int, b: int) -> int:
    return a + b

result = apply_operation(5, 3, add)  # ✅ 8

# Common in callbacks
def process_with_callback(data: list, callback: Callable[[str], None]) -> None:
    """Process data and call callback for each item."""
    for item in data:
        callback(str(item))
```

### Literal: Specific Values Only

```python
from typing import Literal

def set_log_level(level: Literal["DEBUG", "INFO", "WARNING", "ERROR"]) -> None:
    """Set log level to one of the allowed values."""
    print(f"Log level: {level}")

set_log_level("DEBUG")    # ✅ OK
set_log_level("INVALID")  # ❌ Type checker error
```

### Generic Types (TypeVar)

Create functions that work with any type while maintaining type safety.

```python
from typing import TypeVar, List

T = TypeVar('T')  # Generic type variable

def get_first(items: List[T]) -> T:
    """Get first item from list (any type)."""
    return items[0]

first_int = get_first([1, 2, 3])        # Type: int
first_str = get_first(["a", "b"])       # Type: str
```

---

## Data Engineering Type Hints

### Processing Records (List of Dicts)

```python
from typing import List, Dict, Any

Record = Dict[str, Any]  # Type alias
Records = List[Record]

def extract_from_csv(file_path: str) -> Records:
    """Extract records from CSV."""
    records = []
    with open(file_path) as f:
        reader = csv.DictReader(f)
        records = list(reader)
    return records

def transform_records(records: Records) -> Records:
    """Transform records (normalize, validate)."""
    return [
        {
            "id": r["id"],
            "name": r["name"].strip().lower(),
            "age": int(r["age"])
        }
        for r in records
    ]

def load_to_database(records: Records, table: str) -> int:
    """Load records to database, return count."""
    engine = create_engine("postgresql://...")
    df = pd.DataFrame(records)
    df.to_sql(table, engine, if_exists="append", index=False)
    return len(records)
```

### Pipeline with Optional Error Handling

```python
from typing import Optional, Tuple

def run_etl_pipeline(
    source: str,
    destination: str,
    on_error: Optional[Callable[[Exception], None]] = None
) -> Tuple[int, Optional[Exception]]:
    """
    Run ETL pipeline.
    
    Args:
        source: Data source path
        destination: Target database
        on_error: Optional callback for errors
        
    Returns:
        Tuple of (records_processed, error_if_any)
    """
    try:
        records = extract_from_csv(source)
        transformed = transform_records(records)
        count = load_to_database(transformed, destination)
        return count, None
    except Exception as e:
        if on_error:
            on_error(e)
        return 0, e
```

### Validation with Union Return Types

```python
from typing import Union

class ValidationError(Exception):
    pass

def validate_record(record: Dict[str, Any]) -> Union[bool, ValidationError]:
    """Validate record, return True or error."""
    if not record.get("id"):
        return ValidationError("Missing id field")
    
    if not isinstance(record["id"], int):
        return ValidationError("id must be integer")
    
    return True

# Usage
result = validate_record({"id": 1, "name": "Alice"})
if isinstance(result, ValidationError):
    logger.error(f"Validation failed: {result}")
else:
    logger.info("Record is valid")
```

---

## Type Aliases for Clarity

Create reusable type aliases to make code more readable.

```python
from typing import Dict, List, Callable

# Define aliases
JSON = Dict[str, Any]
Handler = Callable[[Exception], None]
Pipeline = Callable[[str], List[Dict[str, Any]]]

# Use in functions
def register_error_handler(handler: Handler) -> None:
    """Register a function to handle errors."""
    pass

def create_pipeline(extractor: Pipeline) -> None:
    """Create pipeline with custom extractor."""
    pass
```

---

## Common Patterns

| Pattern | Use Case | Example |
|---------|----------|---------|
| **Optional[T]** | Value might be None | `Optional[int] = None` |
| **Union[A, B]** | Value is A or B | `Union[int, str]` for flexible input |
| **List[T]** | Homogeneous collection | `List[str]` for list of names |
| **Dict[K, V]** | Key-value pairs | `Dict[str, int]` for lookup table |
| **Tuple[T, ...]** | Variable-length tuple | `Tuple[int, ...]` for coordinates |
| **Callable[[A, B], C]** | Function type | Callbacks, decorators |
| **Literal[A, B]** | Specific values only | `Literal["on", "off"]` for enum-like |
| **TypeVar** | Generic type | Create reusable generic functions |

---

## Runtime Checking with Mypy

Type hints are **not enforced at runtime** by default—Python ignores them. Use `mypy` to catch type errors before runtime.

```bash
# Install mypy
pip install mypy

# Check your code
mypy my_script.py

# Example output:
# error: Argument 1 to "process_id" has incompatible type "float"; expected "Union[int, str]"
```

### Example: Catching a Bug with Mypy

```python
def process_id(value: int | str) -> str:
    return str(value).upper()

# In your code:
result = process_id(3.14)  # ❌ Mypy error: float not allowed

# Mypy catches this before runtime!
```

---

## Tips & Gotchas

- **Type hints are optional.** Python runs code without them, but they improve IDE support and catch bugs.

- **`Optional[T]` is shorthand for `Union[T, None]`.** Both mean the value can be `T` or `None`.

```python
# These are equivalent
Optional[int]
Union[int, None]
int | None  # Modern syntax
```

- **Type hints in function signatures don't enforce types.** They're hints for developers and tools.

```python
def add(a: int, b: int) -> int:
    return a + b

result = add("5", "3")  # ❌ No error! Returns "53"
# Type checkers (mypy) would flag this, but Python doesn't care
```

- **Use type aliases for complex types.** Makes code more readable.

```python
# ❌ Hard to read
def process(data: List[Dict[str, Union[int, str, float]]]) -> None:
    pass

# ✅ Clearer with alias
Record = Dict[str, int | str | float]
def process(data: List[Record]) -> None:
    pass
```

- **Be specific with generics.** `List[Any]` loses type information.

```python
# ❌ No type information
def process(items: List[Any]) -> Any:
    return items[0]

# ✅ Specific types
def process(items: List[int]) -> int:
    return items[0]
```

- **Use `|` over `Union` in Python 3.10+.** Cleaner syntax.

```python
# Python 3.9 and earlier
Union[int, str]

# Python 3.10+
int | str
```

---

## Related

- [[03-Python-Modules-Functions-Lists]] — Functions are where type hints shine
- [[08-Python-Error-Handling]] — Type hints help catch errors early
- [[02-Python-Control-Flow]] — Type narrowing with isinstance() checks
- [Official Python Typing Module](https://docs.python.org/3/library/typing.html)
- [Real Python: Type Hints Guide](https://realpython.com/python-type-hints/)
- [Mypy Documentation](https://mypy.readthedocs.io/)

---

**Key Takeaway:**  
Type hints are documentation and bug prevention combined. Use them in functions, especially in data pipelines. Start with simple hints (`int`, `str`, `list[dict]`), add `Optional` and `Union` as needed, and use `mypy` to catch errors before they hit production.
