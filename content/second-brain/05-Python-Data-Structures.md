---
title: Python Data Structures (Comprehensive)
date: 2026-01-22
publish: true
description: Deep dive into lists, dictionaries, sets, tuples, and when to use each—the building blocks of data engineering.
tags:
  - python
  - data-structures
  - fundamentals
category: second-brain
---
**Data structures** are the containers you use to store and organize data. Each has different trade-offs: lists are flexible, dicts are fast lookups, sets remove duplicates, tuples are immutable. Choosing the right structure makes your code faster and more readable.

---

## Lists: Ordered, Mutable Sequences

Lists are the workhorses of Python. Use them when order matters and you need to add/remove items.

### Creating Lists

```python
# Empty list
empty = []

# With initial values
numbers = [1, 2, 3, 4, 5]
names = ["Alice", "Bob", "Charlie"]
mixed = [1, "two", 3.0, True]

# Using list() constructor
from_range = list(range(5))  # [0, 1, 2, 3, 4]
from_string = list("ABC")     # ["A", "B", "C"]

# Nested lists (list of lists)
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
```

### Accessing and Modifying

```python
numbers = [10, 20, 30, 40, 50]

# Indexing (0-based)
print(numbers[0])      # 10 (first element)
print(numbers[-1])     # 50 (last element)
print(numbers[-2])     # 40 (second from last)

# Slicing
print(numbers[1:4])    # [20, 30, 40] (index 1 to 3, excludes 4)
print(numbers[:2])     # [10, 20] (from start to index 1)
print(numbers[2:])     # [30, 40, 50] (from index 2 to end)
print(numbers[::2])    # [10, 30, 50] (every 2nd element)
print(numbers[::-1])   # [50, 40, 30, 20, 10] (reversed)

# Modify elements
numbers[0] = 99        # [99, 20, 30, 40, 50]
numbers[1:3] = [21, 31]  # [99, 21, 31, 40, 50]
```

### Common List Methods

```python
numbers = [3, 1, 4, 1, 5]

# Add elements
numbers.append(9)         # [3, 1, 4, 1, 5, 9] (add at end)
numbers.insert(0, 0)      # [0, 3, 1, 4, 1, 5, 9] (insert at index)
numbers.extend([2, 6])    # [0, 3, 1, 4, 1, 5, 9, 2, 6] (add multiple)

# Remove elements
numbers.remove(1)         # Removes first occurrence: [0, 3, 4, 1, 5, 9, 2, 6]
value = numbers.pop()     # Remove & return last: returns 6
value = numbers.pop(0)    # Remove & return at index: returns 0

# Information
print(len(numbers))       # 8 (length)
print(numbers.count(1))   # 1 (count of 1s)
print(numbers.index(5))   # 4 (index of first 5)

# Sorting
numbers.sort()            # In-place sort: [1, 2, 3, 4, 5, 9]
numbers.reverse()         # In-place reverse

# Copy
copy = numbers.copy()     # Shallow copy
copy2 = list(numbers)     # Another way to copy
```

**Performance note:** Lists are O(1) for append/pop at end, but O(n) for insert/remove at start.

---

## Dictionaries: Key-Value Pairs (Hash Maps)

Dicts store key-value pairs and provide O(1) lookups. Use them for mappings, configs, and JSON-like data.

### Creating Dictionaries

```python
# Empty dict
empty = {}

# With initial pairs
person = {"name": "Alice", "age": 30, "city": "Paris"}

# Using dict() constructor
pairs = [("a", 1), ("b", 2)]
from_pairs = dict(pairs)  # {"a": 1, "b": 2}

# Dict comprehension
squares = {x: x**2 for x in range(5)}  # {0: 0, 1: 1, 2: 4, 3: 9, 4: 16}

# From keyword arguments
config = dict(host="localhost", port=5432, debug=True)
```

### Accessing and Modifying

```python
person = {"name": "Alice", "age": 30, "city": "Paris"}

# Access with bracket (raises KeyError if missing)
print(person["name"])     # "Alice"
print(person["missing"])  # KeyError!

# Safe access with .get()
print(person.get("age"))       # 30
print(person.get("missing"))   # None
print(person.get("missing", "Unknown"))  # "Unknown" (default)

# Add/update
person["age"] = 31            # Update existing
person["email"] = "alice@example.com"  # Add new

# Delete
del person["email"]           # Delete key
removed = person.pop("age")   # Remove & return value
```

### Iterating Over Dictionaries

```python
person = {"name": "Alice", "age": 30, "city": "Paris"}

# Iterate keys (default)
for key in person:
    print(key)  # "name", "age", "city"

# Iterate values
for value in person.values():
    print(value)  # "Alice", 30, "Paris"

# Iterate key-value pairs (best practice)
for key, value in person.items():
    print(f"{key}: {value}")

# Example: build lookup table
names = ["Alice", "Bob", "Charlie"]
lookup = {name: i for i, name in enumerate(names)}
# {"Alice": 0, "Bob": 1, "Charlie": 2}
```

### Common Dict Methods

```python
config = {"host": "localhost", "port": 5432}

# Keys and values
print(config.keys())       # dict_keys(['host', 'port'])
print(config.values())     # dict_values(['localhost', 5432])
print(config.items())      # dict_items([('host', 'localhost'), ('port', 5432)])

# Update
config.update({"debug": True, "port": 3306})  # Merge another dict
config.update([("timeout", 30)])  # From list of tuples

# Merging (Python 3.9+)
merged = {**config, "new_key": "value"}  # Create new dict with merged values
merged = config | {"new_key": "value"}   # Modern syntax

# Clear
config.clear()  # Remove all items
```

---

## Sets: Unique, Unordered Collections

Sets store unique values and are fast for membership testing. Use them to remove duplicates or check existence.

### Creating Sets

```python
# Empty set (note: {} is an empty dict, not set!)
empty = set()

# With initial values
tags = {"python", "data", "engineering"}
numbers = {1, 2, 3, 1, 2}  # {1, 2, 3} (duplicates removed)

# From list (removes duplicates)
unique = set([1, 2, 2, 3, 3, 3])  # {1, 2, 3}

# Set comprehension
squares = {x**2 for x in range(5)}  # {0, 1, 4, 9, 16}
```

### Set Operations

```python
a = {1, 2, 3}
b = {2, 3, 4}

# Union (all elements)
print(a | b)           # {1, 2, 3, 4}
print(a.union(b))      # Same

# Intersection (common elements)
print(a & b)           # {2, 3}
print(a.intersection(b))  # Same

# Difference (in a but not b)
print(a - b)           # {1}
print(a.difference(b))    # Same

# Symmetric difference (in a or b but not both)
print(a ^ b)           # {1, 4}
print(a.symmetric_difference(b))  # Same
```

### Common Set Methods

```python
tags = {"python", "data"}

# Add elements
tags.add("engineering")  # {"python", "data", "engineering"}

# Remove elements
tags.remove("data")      # Raises KeyError if not found
tags.discard("data")     # No error if not found

# Check membership
print("python" in tags)  # True
print("sql" in tags)     # False

# Length and copy
print(len(tags))         # 2
copy = tags.copy()       # Shallow copy
```

**Use case: Removing duplicates from a list**
```python
numbers = [1, 2, 2, 3, 3, 3, 4, 5, 5]
unique = list(set(numbers))  # [1, 2, 3, 4, 5] (order not preserved)

# If order matters, use dict.fromkeys()
ordered_unique = list(dict.fromkeys(numbers))  # [1, 2, 3, 4, 5]
```

---

## Tuples: Immutable Sequences

Tuples are immutable (can't be changed), hashable (can be dict keys), and lightweight. Use them for fixed data and dict keys.

### Creating Tuples

```python
# With parentheses
point = (10, 20)
empty = ()

# Without parentheses (comma creates tuple)
single = (1,)            # Note: (1) is just 1, (1,) is a tuple
pair = 1, 2              # (1, 2)

# From list
from_list = tuple([1, 2, 3])  # (1, 2, 3)

# Unpacking
x, y = (10, 20)
a, *rest = (1, 2, 3, 4)  # a=1, rest=(2, 3, 4)
```

### Accessing Tuples

```python
point = (10, 20, 30)

print(point[0])      # 10 (0-based indexing)
print(point[-1])     # 30 (last element)
print(point[1:])     # (20, 30) (slicing returns tuple)
```

### Why Use Tuples?

**1. Hashable—can be dict keys or set members**
```python
# Tuples as dict keys
locations = {
    (40.7128, 74.0060): "New York",
    (48.8566, 2.3522): "Paris"
}

# Can't use lists (unhashable)
locations[([1, 2])] = "Invalid"  # TypeError!
```

**2. Function return multiple values**
```python
def get_min_max(numbers: list[int]) -> tuple[int, int]:
    return min(numbers), max(numbers)

minimum, maximum = get_min_max([3, 1, 4, 1, 5])  # 1, 5
```

**3. Lightweight and memory-efficient**
```python
# Tuples use less memory than lists
import sys
print(sys.getsizeof((1, 2, 3)))  # Smaller than [1, 2, 3]
```

---

## Choosing the Right Structure

| Structure | Ordered | Mutable | Lookup Speed | Use Case |
|-----------|---------|---------|--------------|----------|
| **List** | ✅ Yes | ✅ Yes | O(n) | Collections that change, order matters |
| **Dict** | ✅ Yes* | ✅ Yes | O(1) | Key-value mappings, lookups, configs |
| **Set** | ❌ No | ✅ Yes | O(1) | Unique items, membership tests |
| **Tuple** | ✅ Yes | ❌ No | O(n) | Immutable data, dict keys |

*Python 3.7+ dicts preserve insertion order

---

## Data Engineering Patterns

### Deduplicate Records While Preserving Order

```python
def deduplicate_records(records: list[dict]) -> list[dict]:
    """Remove duplicate records, preserve order."""
    seen = set()
    unique = []
    
    for record in records:
        # Convert to tuple for hashing
        key = tuple(sorted(record.items()))
        
        if key not in seen:
            seen.add(key)
            unique.append(record)
    
    return unique
```

### Build Lookup Tables from Lists

```python
def build_lookups(records: list[dict]) -> dict[str, dict]:
    """Create lookup table: user_id -> record."""
    lookup = {}
    
    for record in records:
        user_id = record["id"]
        lookup[user_id] = record
    
    return lookup

# Usage: O(1) lookup
record = lookup["123"]  # Fast, O(1) time
```

### Transform List of Dicts

```python
def extract_columns(records: list[dict], columns: list[str]) -> list[tuple]:
    """Extract specific columns as tuples."""
    return [
        tuple(record.get(col) for col in columns)
        for record in records
    ]

# Usage
records = [{"id": 1, "name": "Alice", "age": 30}, ...]
ids_names = extract_columns(records, ["id", "name"])
# [(1, "Alice"), (2, "Bob"), ...]
```

---

## Tips & Gotchas

- **Empty braces `{}` create a dict, not a set.** Use `set()` for empty set.

```python
# ❌ Wrong
empty = {}
print(type(empty))  # <class 'dict'>

# ✅ Correct
empty = set()
print(type(empty))  # <class 'set'>
```

- **Lists/dicts are mutable—modifying one affects all references.**

```python
original = [1, 2, 3]
copy = original  # NOT a copy, just another reference
copy[0] = 99
print(original)  # [99, 2, 3] — original changed!

# ✅ Make a copy
copy = original.copy()  # Shallow copy
copy[0] = 99
print(original)  # [1, 2, 3] — unchanged
```

- **Dict keys must be hashable** (immutable types).

```python
# ✅ Hashable keys
d = {1: "a", "key": "b", (1, 2): "c"}

# ❌ Unhashable keys
d = {[1, 2]: "a"}       # TypeError!
d = {{"inner": "dict"}: "a"}  # TypeError!
```

- **Slicing creates a new list**, not a reference.

```python
original = [1, 2, 3, 4, 5]
slice = original[1:3]  # [2, 3] — NEW list
slice[0] = 99
print(original)  # [1, 2, 3, 4, 5] — unchanged
```

---

## Related

- [[01-Python-Loops]] — Iterate over data structures
- [[02-Python-Control-Flow]] — Filter data structures
- [[03-Python-Modules-Functions-Lists]] — Function parameters with types
- [[04-Python-List-Comprehensions]] — Transform lists with one-liners
- [Official Data Structures Documentation](https://docs.python.org/3/tutorial/datastructures.html)

---

**Key Takeaway:**  
Choose the right structure for your data: lists for ordered collections, dicts for lookups, sets for unique items, tuples for immutable data. Master slicing, comprehensions, and iteration—they're the foundation of Python data work.
