---
title: "Python Data Structures"
date: 2025-12-28
draft: false
description: "Personal notes on Python lists, dictionaries, sets, and tuples"
tags: ["python", "data-structures", "fundamentals"]
categories: ["knowledge"]
---

## Core Data Structures

### Lists
Ordered, mutable sequences. Best for collections that change.

```python
# Creating lists
fruits = ["apple", "banana", "cherry"]

# Common operations
fruits.append("date")       # Add to end
fruits.insert(1, "blueberry")  # Insert at position
fruits.remove("banana")     # Remove by value
```

### Dictionaries
Key-value pairs. Fast lookups by key.

```python
# Creating dictionaries
person = {
    "name": "Ben",
    "role": "Data Engineer",
    "learning": True
}

# Common operations
person["skill"] = "Python"  # Add new key
value = person.get("name")  # Safe access
```

### Sets
Unordered collections of unique items. Great for removing duplicates.

```python
# Creating sets
unique_tags = {"python", "sql", "etl"}

# Common operations
unique_tags.add("docker")
unique_tags.remove("sql")
```

### Tuples
Immutable sequences. Use for data that shouldn't change.

```python
# Creating tuples
coordinates = (10, 20)
config = ("localhost", 8080, True)
```

## When to Use What

- **List**: Need to modify the collection, order matters
- **Dict**: Need fast lookups by key
- **Set**: Need unique values, order doesn't matter
- **Tuple**: Data that shouldn't change

---

*Learning notes from Codecademy Python Fundamentals*
