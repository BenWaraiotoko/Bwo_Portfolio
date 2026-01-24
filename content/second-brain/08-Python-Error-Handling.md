---
title: Python Error Handling (try/except/finally)
date: 2026-01-22
publish: true
description: Master exception handling—the foundation of writing robust, production-ready Python code for data pipelines.
tags:
  - python
  - error-handling
  - exceptions
  - fundamentals
  - data-engineering
category: second-brain
---
**Error handling** is about anticipating what can go wrong and gracefully managing failures instead of crashing. In Data Engineering, pipelines fail for many reasons—API timeouts, corrupted data, missing files. Robust error handling means your pipeline logs the problem, tries again, or fails safely without losing progress.

---

## Basic Syntax

### Try-Except Block

```python
try:
    # Code that might raise an exception
    result = 10 / x
except ZeroDivisionError:
    # Handle the specific exception
    print("Cannot divide by zero")
```

### Multiple Except Blocks

```python
try:
    # Risky code
    file = open("data.csv")
    value = int(file.read())
    result = 100 / value
except FileNotFoundError:
    print("File does not exist")
except ValueError:
    print("Could not convert to integer")
except ZeroDivisionError:
    print("Cannot divide by zero")
except Exception as e:
    # Catch any other exception
    print(f"Unexpected error: {e}")
```

### Try-Except-Else-Finally

```python
try:
    file = open("data.txt")
    content = file.read()
except FileNotFoundError:
    print("File not found")
else:
    # Executes ONLY if no exception occurred
    print(f"Read {len(content)} characters")
finally:
    # ALWAYS executes, even if exception or return in except
    if file:
        file.close()
    print("Cleanup complete")
```

**Key concept:** Only ONE except block executes. Python checks top-to-bottom and stops at the first match.

---

## Quick Reference Examples

### Catching and Logging Exceptions

```python
import logging

logger = logging.getLogger(__name__)

try:
    data = fetch_from_api()
    process(data)
except ConnectionError as e:
    logger.error(f"API connection failed: {e}", exc_info=True)
    # exc_info=True includes full traceback in logs
except Exception as e:
    logger.critical(f"Unexpected error: {e}", exc_info=True)
    raise  # Re-raise to propagate to caller
```

### Using Else and Finally (Resource Cleanup)

```python
database_connection = None

try:
    database_connection = connect_to_db("postgresql://...")
    cursor = database_connection.cursor()
    cursor.execute("SELECT * FROM users")
    results = cursor.fetchall()
except ConnectionError as e:
    logger.error(f"Could not connect to database: {e}")
    results = []
else:
    print(f"Successfully retrieved {len(results)} rows")
finally:
    # Always close the connection, whether success or failure
    if database_connection:
        database_connection.close()
        logger.info("Database connection closed")
```

### Re-raising Exceptions with Context

```python
try:
    validate_csv(file)
except ValidationError as e:
    logger.error(f"CSV validation failed: {e}")
    raise ValueError(f"Invalid CSV: {e}") from e
    # 'from e' preserves original exception in traceback
```

### Custom Exception Handling Pattern

```python
def load_config(config_file: str) -> dict:
    """Load config safely with fallback."""
    try:
        with open(config_file) as f:
            return json.load(f)
    except FileNotFoundError:
        logger.warning(f"Config not found: {config_file}, using defaults")
        return DEFAULT_CONFIG
    except json.JSONDecodeError as e:
        logger.error(f"Invalid JSON in {config_file}: {e}")
        raise ValueError(f"Corrupted config file: {e}") from e
```

---

## Common Built-in Exceptions

| Exception | When It Occurs | Example |
|-----------|---|---------|
| **ValueError** | Invalid value for operation | `int("abc")` |
| **TypeError** | Wrong type for operation | `"5" + 5` |
| **KeyError** | Key not found in dict | `d["missing_key"]` |
| **IndexError** | List index out of range | `lst[999]` |
| **FileNotFoundError** | File doesn't exist | `open("missing.txt")` |
| **ZeroDivisionError** | Division by zero | `10 / 0` |
| **ConnectionError** | Network/database failure | API call times out |
| **TimeoutError** | Operation takes too long | Slow API response |
| **AttributeError** | Attribute doesn't exist | `obj.missing_attr` |

---

## Creating Custom Exceptions

Custom exceptions help you handle domain-specific errors clearly.

### Simple Custom Exception

```python
class InvalidTemperatureError(Exception):
    """Raised when temperature is outside valid range."""
    pass

def validate_temperature(celsius: float) -> float:
    if celsius < -273.15:
        raise InvalidTemperatureError(
            f"Temperature {celsius}°C is below absolute zero"
        )
    return celsius
```

### Custom Exception with Additional Data

```python
class DataValidationError(Exception):
    """Raised when data validation fails."""
    
    def __init__(self, message: str, invalid_rows: list, row_count: int):
        super().__init__(message)
        self.invalid_rows = invalid_rows
        self.row_count = row_count
    
    def summary(self) -> str:
        percent = (len(self.invalid_rows) / self.row_count) * 100
        return f"{len(self.invalid_rows)} invalid rows ({percent:.1f}%)"

# Usage
try:
    validate_csv(data)
except DataValidationError as e:
    logger.error(f"Validation failed: {e.summary()}")
    logger.debug(f"Invalid rows: {e.invalid_rows[:10]}")  # Show first 10
```

---

## Data Engineering Patterns

### Retry Logic with Exponential Backoff

```python
import time
from typing import Callable, Any

def retry(max_attempts: int = 3, delay: float = 1.0, backoff: float = 2.0):
    """Decorator to retry a function with exponential backoff."""
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
                        f"{func.__name__} failed (attempt {attempt}/{max_attempts}), "
                        f"retrying in {current_delay}s: {e}"
                    )
                    time.sleep(current_delay)
                    current_delay *= backoff
        return wrapper
    return decorator

@retry(max_attempts=5, delay=1.0, backoff=2.0)
def fetch_from_api(url: str) -> dict:
    """Retry up to 5 times with exponential backoff (1s, 2s, 4s, 8s, 16s)."""
    response = requests.get(url, timeout=5)
    response.raise_for_status()
    return response.json()
```

### Validating ETL Data with Custom Exceptions

```python
def extract_and_validate(file_path: str) -> list[dict]:
    """Extract CSV with validation."""
    try:
        with open(file_path) as f:
            reader = csv.DictReader(f)
            records = list(reader)
    except FileNotFoundError:
        raise DataSourceError(f"File not found: {file_path}")
    except csv.Error as e:
        raise DataSourceError(f"CSV parsing error: {e}") from e
    
    # Validate data
    invalid_rows = []
    for i, record in enumerate(records, start=1):
        try:
            validate_record(record)
        except ValueError as e:
            invalid_rows.append((i, record, str(e)))
    
    if invalid_rows:
        raise DataValidationError(
            f"Found {len(invalid_rows)} invalid records",
            invalid_rows,
            len(records)
        )
    
    return records

def validate_record(record: dict) -> None:
    """Validate a single record."""
    if not record.get("id"):
        raise ValueError("Missing required field: id")
    
    try:
        int(record["id"])
    except ValueError:
        raise ValueError(f"id must be integer, got: {record['id']}")
```

### Fallback Pattern for Missing Data

```python
def load_data_with_fallback(primary_source: str, fallback_source: str) -> list[dict]:
    """Try primary source, fall back to secondary on failure."""
    try:
        logger.info(f"Attempting to load from {primary_source}")
        return load_from_database(primary_source)
    except ConnectionError as e:
        logger.warning(f"Primary source failed: {e}, using fallback")
        try:
            return load_from_database(fallback_source)
        except Exception as e:
            logger.critical(f"Both sources failed: {e}")
            raise DataUnavailableError(
                f"Could not load data from {primary_source} or {fallback_source}"
            ) from e
```

---

## Tips & Gotchas

- **Never use bare `except:`** — It catches everything including `KeyboardInterrupt` and `SystemExit`, making it impossible to stop your program.

```python
# ❌ BAD: Catches ALL exceptions, even Ctrl+C
try:
    process_data()
except:
    print("Error")

# ✅ GOOD: Catch specific exceptions
try:
    process_data()
except (ValueError, TypeError) as e:
    logger.error(f"Data error: {e}")
except Exception as e:
    logger.critical(f"Unexpected error: {e}")
```

- **Catch specific exceptions first, generic ones last.** Python stops at the first match.

```python
# ❌ Wrong order (ValueError will never match)
try:
    int("abc")
except Exception as e:
    print(e)
except ValueError as e:
    print("Invalid number")

# ✅ Correct order
try:
    int("abc")
except ValueError as e:
    print("Invalid number")
except Exception as e:
    print(e)
```

- **Use `from e` when re-raising to preserve the original traceback.** This is critical for debugging.

```python
# ❌ Loses original error context
try:
    risky_operation()
except Exception:
    raise ValueError("Operation failed")

# ✅ Preserves traceback
try:
    risky_operation()
except Exception as e:
    raise ValueError("Operation failed") from e
```

- **The `finally` block always executes**, even if you `return` in the `except` block. Use it for cleanup (closing files, connections, releasing locks).

```python
try:
    file = open("data.txt")
    return file.read()  # Looks like function ends here
except FileNotFoundError:
    return "No data"
finally:
    file.close()  # But this STILL executes!
```

- **The `else` block runs ONLY if no exception occurred.** Use it to separate "success path" from "error handling."

```python
try:
    result = compute_expensive_operation()
except ValueError as e:
    logger.error(f"Computation failed: {e}")
else:
    # Only executes if compute_expensive_operation() succeeded
    save_result_to_database(result)
    logger.info("Successfully saved result")
```

- **Log exceptions with `exc_info=True` to get full tracebacks.** Don't just print the message.

```python
# ❌ Loses debugging info
except Exception as e:
    print(f"Error: {e}")

# ✅ Includes full traceback in logs
except Exception as e:
    logger.error(f"Error: {e}", exc_info=True)
```

---

## Related

- [[02-Python-Control-Flow]] — Conditionals work alongside exception handling for validation
- [[03-Python-Modules-Functions-Lists]] — Functions are where exceptions typically occur
- [Official Python Exception Documentation](https://docs.python.org/3/tutorial/errors.html)
- [Real Python: Exception Handling](https://realpython.com/python-raise-exception/)

---

**Key Takeaway:**  
Anticipate failures, catch specific exceptions, log with full context, and always clean up resources in `finally` blocks. Production code is not about preventing errors—it's about handling them gracefully.
