---
title: Python List Comprehensions
date: 2026-01-22
publish: true
description: Master list comprehensions—the Pythonic way to transform and filter data in a single, readable line.
tags:
  - python
  - list-comprehension
  - fundamentals
  - performance
category: second-brain
---
A **list comprehension** is a concise, readable way to create a new list by transforming or filtering elements from an existing iterable—all in a single line. It's one of the most powerful (and Pythonic) features of Python, and it's 30-50% faster than an equivalent `for` loop.

---

## Basic Syntax

```python
[expression for item in iterable if condition]
```

**Three core parts:**
- **expression:** What to compute or transform for each item
- **item:** Current element from the iterable
- **iterable:** Sequence (list, range, tuple, dict, set, string…)
- **if condition (optional):** Filter to include only items that satisfy the condition

---

## Quick Reference Examples

### Simple Transformation

```python
# Multiply each number by 2
numbers = [1, 2, 3, 4, 5]
doubled = [x * 2 for x in numbers]
print(doubled)  # [2, 4, 6, 8, 10]

# Convert strings to uppercase
fruits = ["apple", "banana", "cherry"]
upper = [fruit.upper() for fruit in fruits]
print(upper)  # ['APPLE', 'BANANA', 'CHERRY']
```

### Filtering with Conditions

```python
# Keep only even numbers
numbers = [1, 2, 3, 4, 5, 6, 7, 8]
evens = [x for x in numbers if x % 2 == 0]
print(evens)  # [2, 4, 6, 8]

# Keep strings containing 'a'
fruits = ["apple", "banana", "cherry", "mango"]
with_a = [f for f in fruits if "a" in f]
print(with_a)  # ['apple', 'banana', 'mango']
```

### Transformation + Filtering

```python
# Square numbers that are greater than 3
numbers = [1, 2, 3, 4, 5]
result = [x**2 for x in numbers if x > 3]
print(result)  # [16, 25]

# Convert positive integers to strings (ignore negatives)
values = [10, -5, 20, -15, 30]
positive_strs = [str(v) for v in values if v > 0]
print(positive_strs)  # ['10', '20', '30']
```

### Conditional Expression (If/Else)

```python
# Replace negative with 0, keep positives
values = [10, -5, 20, -15, 30]
fixed = [v if v > 0 else 0 for v in values]
print(fixed)  # [10, 0, 20, 0, 30]

# Label numbers as "even" or "odd"
numbers = [1, 2, 3, 4, 5]
labels = ["even" if x % 2 == 0 else "odd" for x in numbers]
print(labels)  # ['odd', 'even', 'odd', 'even', 'odd']
```

---

## Advanced Patterns

### Nested List Comprehensions (Caution: Readability)

```python
# Create a 3x3 matrix
matrix = [[i*3 + j for j in range(3)] for i in range(3)]
# [[0, 1, 2], [3, 4, 5], [6, 7, 8]]

# Flatten a 2D list (matrix)
matrix = [[1, 2, 3], [4, 5], [6, 7, 8, 9]]
flat = [item for row in matrix for item in row]
print(flat)  # [1, 2, 3, 4, 5, 6, 7, 8, 9]
```

**Note:** Nested comprehensions can become hard to read. If it takes >2 seconds to understand, use a regular `for` loop instead.

### Dictionary Comprehensions

```python
# Create a dict with numbers as keys and squares as values
squares_dict = {x: x**2 for x in range(5)}
print(squares_dict)  # {0: 0, 1: 1, 2: 4, 3: 9, 4: 16}

# Transform existing dict (swap keys and values)
original = {"a": 1, "b": 2, "c": 3}
inverted = {v: k for k, v in original.items()}
print(inverted)  # {1: 'a', 2: 'b', 3: 'c'}

# Filter dict items
data = {"apple": 5, "banana": 3, "cherry": 7, "date": 2}
expensive = {k: v for k, v in data.items() if v > 3}
print(expensive)  # {'apple': 5, 'cherry': 7}
```

### Set Comprehensions

```python
# Remove duplicates and filter
numbers = [1, 2, 2, 3, 3, 3, 4, 4, 4, 4]
unique_odds = {x for x in numbers if x % 2 == 1}
print(unique_odds)  # {1, 3}
```

---

## Comparison: For Loop vs. Comprehension

| Aspect | For Loop | List Comprehension |
|--------|----------|-------------------|
| **Syntax** | Multi-line | Single line |
| **Speed** | Slower (~65ms per million items) | Faster (~45ms per million items) |
| **Readability** | Good for complex logic | Good for simple transforms |
| **Multiple statements** | Supported | Not supported (use loop instead) |
| **Pythonic** | Okay | ✅ Preferred |

**Example comparison:**

```python
# ❌ For loop (5 lines)
result = []
for x in numbers:
    if x > 0:
        result.append(x * 2)

# ✅ List comprehension (1 line)
result = [x * 2 for x in numbers if x > 0]
```

---

## When to Use Comprehensions vs. For Loops

### Use comprehensions when:
- Transforming/filtering a list into a new list
- Logic is simple and fits on one readable line
- Performance matters (30-50% faster)

### Use regular loops when:
- Multiple statements inside the loop
- Complex conditional logic that needs comments
- Printing/logging within the iteration
- Modifying existing list (not creating new one)

```python
# ✅ Comprehension: simple, clear
doubled = [x * 2 for x in numbers]

# ✅ Loop: multiple operations (don't force a comprehension!)
for order in orders:
    order.validate()
    order.save()
    print(f"Order {order.id} processed")
```

---

## Common Patterns in Data Engineering

### Extract specific columns from list of dicts

```python
records = [
    {"name": "Alice", "age": 30, "city": "Paris"},
    {"name": "Bob", "age": 25, "city": "Lyon"},
    {"name": "Charlie", "age": 35, "city": "Marseille"},
]

# Extract all names
names = [r["name"] for r in records]
# ['Alice', 'Bob', 'Charlie']

# Extract people over 25
older = [r for r in records if r["age"] > 25]
```

### Parse and normalize data

```python
csv_line = "apple, 5, 3.99  |  banana, 8, 2.50  |  cherry, 3, 4.25"
items = [item.strip() for item in csv_line.split("|")]

# Handle mixed types
values = ["10", "20", "not_a_number", "30"]
numbers = [int(v) for v in values if v.isdigit()]
# [10, 20, 30]
```

### Create lookup tables

```python
keys = ["a", "b", "c"]
lookup = {key: i for i, key in enumerate(keys)}
# {'a': 0, 'b': 1, 'c': 2}
```

---

## Tips & Gotchas

- **Readability over brevity.** If your comprehension is hard to read, use a loop. You (and your team) will thank you later.

- **Performance boost is ~30-50%, not magic.** List comprehensions are faster because they use a special `LIST_APPEND` bytecode instead of calling `.append()` each iteration—but the improvement diminishes with complex logic.

- **Can't use `break` or `continue` in comprehensions.** If you need those, use a regular loop.

- **Nested comprehensions flatten left-to-right.** `[x for row in matrix for x in row]` reads as: loop through rows, then loop through items in each row.

- **Dictionary comprehensions silently overwrite duplicate keys.** `{x % 2: x for x in range(5)}` keeps only the last value for key `0` and `1`.

- **Memory: comprehensions build the entire list immediately.** If you need to process millions of items, consider generators (`(x for x in items)`) instead.

---

## Related

- [[01-Python-Loops]]] — Traditional `for` and `while` loops
- [[03-Python-Modules-Functions-Lists]] — Lists as the primary data structure
- [Official Python Documentation: List Comprehensions](https://docs.python.org/3/tutorial/datastructures.html#list-comprehensions)
- [Real Python: When to Use List Comprehension](https://realpython.com/list-comprehension-python/)

---

**Key Takeaway:**  
List comprehensions are the Pythonic way to transform and filter data. Use them for one-line transformations, but don't sacrifice readability for brevity. When in doubt, write a loop.
