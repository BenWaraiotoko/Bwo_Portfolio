---
title: Python Modules, Functions & Lists
date: 2026-01-22
publish: true
description: "Core Python fundamentals for data engineering: modules for code organization, functions for encapsulation, and lists as the primary data structure in ETL pipelines."
tags:
  - python
  - fundamentals
  - data-engineering
  - le-wagon-prep
category: second-brain
---
## Overview

**Modules**, **functions**, and **lists** form the backbone of Python development in Data Engineering. Modules organize code into reusable components; functions encapsulate logic with clear inputs/outputs; lists are the workhorse for batch data processing. Mastery of these three concepts is a prerequisite for Le Wagon bootcamp and daily pipeline work.

Why it matters: Production ETL pipelines live inside modules (e.g., `extractors.py`, `transformers.py`). Each transformation is a function with type hints. Data moves through lists (before DataFrames). Without solid fundamentals here, debugging and refactoring become painful.

---

## Quick Reference

### Module Import (Standard Pattern)

```python
# ✅ PREFERRED: Standard library → third-party → local (blank lines between)
import os
import sys
from datetime import datetime

import pandas as pd
import requests

from my_pipeline import extract_data, load_data
```

### Function with Type Hints

```python
def transform_temperature(celsius: float, target_unit: str = "F") -> float:
    """
    Convert Celsius to Fahrenheit or Kelvin.
    
    Args:
        celsius: Temperature value in Celsius
        target_unit: "F" for Fahrenheit, "K" for Kelvin
        
    Returns:
        Converted temperature as float
        
    Raises:
        ValueError: If target_unit is not recognized
    """
    if target_unit == "F":
        return (celsius * 9/5) + 32
    elif target_unit == "K":
        return celsius + 273.15
    else:
        raise ValueError(f"Unknown unit: {target_unit}")
```

### List Comprehension (Pythonic Loop)

```python
# ❌ Old way: imperative loop
celsius = [0, 10, 20, 30, 40]
fahrenheit = []
for c in celsius:
    fahrenheit.append((c * 9/5) + 32)

# ✅ Pythonic way: comprehension
fahrenheit = [(c * 9/5) + 32 for c in celsius]

# With filtering
hot_celsius = [c for c in celsius if c >= 20]  # [20, 30, 40]
```

---

## Key Concepts

### 1. Modules

**Definition:** A module is a `.py` file containing Python code (functions, classes, variables). Modules prevent code duplication and provide namespaces—essential when scaling from scripts to pipelines.

**Usage:** Organize related functionality into separate modules. In ETL, typical structure is `extract.py`, `transform.py`, `load.py`. Import at the top of your file; Python caches imports (runs once per session).

**Best practices:**
- Import at module level (top of file), not inside functions.
- Group imports: standard library → third-party → local.
- Use absolute imports (`from my_package import func`) over relative imports.
- Never use `from module import *` (pollutes namespace, unclear where names come from).

### 2. Functions

**Definition:** Functions are reusable blocks of code that take inputs (parameters) and return outputs. They're the atoms of transformations in data pipelines.

**Usage:** Wrap any logic you'd repeat twice into a function. Use type hints to document expected types. Write docstrings to explain what the function does and edge cases.

**Core patterns:**
- **Positional arguments:** `func(a, b)` — order matters, best for ≤3 params.
- **Keyword arguments:** `func(a=1, b=2)` — explicit, readable, best for complex calls.
- **Default arguments:** `func(a, b="default")` — optional parameters.
- **`*args`:** `func(*items)` — variable-length tuple of positional args.
- **`**kwargs`:** `func(**config)` — variable-length dict of keyword args.

### 3. Lists

**Definition:** Lists are ordered, mutable sequences of items. They're the primary data structure for processing batches of records before moving to DataFrames.

**Usage:** Create with `[...]`, access with indexing (`list[0]`, `list[-1]`), modify with `.append()`, `.insert()`, `.remove()`, `.pop()`. Iterate with `for item in list:`.

**Key methods:**
- `.append(x)` — add to end.
- `.insert(i, x)` — insert at index.
- `.remove(x)` — remove first occurrence.
- `.pop(i)` — remove and return at index.
- `.sort()`, `.reverse()` — in-place modifications.

---

## Common Patterns

| Pattern | Use Case | Example |
|---------|----------|---------|
| **Import organization** | Keeping code readable and imports debuggable | `import os; import pandas as pd; from .utils import helper` |
| **Function with type hints** | Making functions self-documenting and IDE-friendly | `def process(data: list[dict]) -> list[dict]:` |
| **List comprehension with filter** | Transforming and selecting data in one pass | `[x*2 for x in nums if x > 0]` |
| **Nested comprehension** | Flattening 2D structures (matrices, lists of lists) | `[item for row in matrix for item in row]` |
| **Default function argument** | Optional parameters without overloading | `def run(config_path: str = "default.yaml"):` |
| **`*args` in function** | Unknown number of similar arguments | `def log_events(*events): for e in events: print(e)` |
| **`**kwargs` in function** | Configuration dicts (common in Airflow) | `def task(task_id: str, **context): ...` |

---

## Tips & Gotchas

- **Imports must be at the top of the file.** If an import fails inside a function, it will crash at runtime, not on load. Put imports where Python sees them first.

- **`from module import *` is dangerous.** If two modules export the same name, which one wins? Use explicit imports like `from module import func1, func2`.

- **Functions return `None` by default.** If you write a function without a `return` statement, it returns `None`. Check every code path.

- **Mutable default arguments are shared.** Don't use `def func(items=[]):` because the list persists across calls. Use `def func(items=None): items = items or []` instead.

- **List comprehensions must be readable.** If your comprehension is more than one line or has >2 conditions, use a regular loop. Code clarity beats cleverness.

- **Lists are ordered, dicts are not (well, 3.7+ dicts preserve insertion order but don't rely on it for logic).** Use a list when order matters, a dict when you need key-value pairs.

- **Remember: imports are cached.** If you reload a module in a Jupyter notebook, Python doesn't automatically re-run the import. Use `importlib.reload()` or restart the kernel.

---

## Related

- [[09-1-python-oop-bakery-analogy]] 
- [Official Python Modules Tutorial](https://docs.python.org/3/tutorial/modules.html)
- [PEP 8 – Style Guide for Python Code](https://peps.python.org/pep-0008/)
- [Real Python: Importing Modules](https://realpython.com/python-import/)
