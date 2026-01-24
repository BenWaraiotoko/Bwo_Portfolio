---
title: Python Control Flow (if/elif/else)
date: 2026-01-22
publish: true
description: Master conditional statements—the foundation of decision-making logic in Python programs.
tags:
  - python
  - control-flow
  - conditionals
  - fundamentals
category: second-brain
---
**Control flow** is how your program makes decisions. Instead of executing code line-by-line, conditionals let you say: "If this is true, do that. Otherwise, do something else." This is the foundation of all decision-making in programming—used everywhere from validating data to routing requests in pipelines.

---

## Basic Syntax

### If Statement

```python
if condition:
    # This block executes only if condition is True
    print("Condition was true")
```

### If-Else Statement

```python
if condition:
    # Executes if condition is True
    print("Condition was true")
else:
    # Executes if condition is False
    print("Condition was false")
```

### If-Elif-Else Chain

```python
if condition1:
    # Executes if condition1 is True
    print("First condition was true")
elif condition2:
    # Executes if condition1 is False AND condition2 is True
    print("Second condition was true")
elif condition3:
    # Executes if condition1 and condition2 are False AND condition3 is True
    print("Third condition was true")
else:
    # Executes if all previous conditions are False
    print("None of the conditions were true")
```

**Key point:** Only ONE block executes. Python checks conditions top-to-bottom and stops at the first True condition.

---

## Quick Reference Examples

### Simple If-Else

```python
age = 18

if age >= 18:
    print("You are an adult")
else:
    print("You are a minor")
# Output: You are an adult
```

### If-Elif-Else Chain

```python
score = 75

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
elif score >= 60:
    grade = "D"
else:
    grade = "F"

print(f"Your grade is {grade}")  # Your grade is C
```

### Multiple Conditions with Logical Operators

```python
age = 25
salary = 60000

# AND: both conditions must be True
if age >= 21 and salary >= 50000:
    print("Eligible for premium membership")
# Output: Eligible for premium membership

# OR: at least one condition must be True
if age < 18 or salary < 30000:
    print("Not eligible for loan")
else:
    print("Eligible for loan")
# Output: Eligible for loan

# NOT: reverses the condition
if not (age < 18):
    print("You are 18 or older")
# Output: You are 18 or older
```

### Membership Testing

```python
fruits = ["apple", "banana", "cherry"]
user_choice = "banana"

if user_choice in fruits:
    print(f"{user_choice} is available")
else:
    print(f"{user_choice} is not available")
# Output: banana is available

# Check if value is NOT in list
if "grape" not in fruits:
    print("We don't have grapes")
# Output: We don't have grapes
```

### Ternary Operator (Conditional Expression)

```python
# One-line if-else for simple assignments
age = 20
status = "adult" if age >= 18 else "minor"
print(status)  # adult

# Works with any expression
score = 85
result = "Pass" if score >= 60 else "Fail"
print(result)  # Pass

# Chained ternary (use with caution—can become unreadable)
temperature = 25
weather = "hot" if temperature > 30 else "warm" if temperature > 20 else "cold"
print(weather)  # warm
```

---

## Boolean Operators (Logical Operators)

### AND Operator

`and` returns `True` only if **both** conditions are true.

```python
age = 25
license = True

if age >= 18 and license:
    print("You can drive")  # This executes
else:
    print("You cannot drive")

# AND with multiple conditions
if age >= 21 and license and license != False:
    print("Eligible for everything")
```

**Short-circuit evaluation:** Python stops evaluating as soon as it finds a `False`. If the first condition is false, it doesn't check the rest.

```python
def check_age():
    print("Checking age...")
    return False

def check_license():
    print("Checking license...")
    return True

if check_age() and check_license():
    print("Can drive")

# Output:
# Checking age...
# (Note: check_license is NOT called because check_age was False)
```

### OR Operator

`or` returns `True` if **at least one** condition is true.

```python
day = "Saturday"

if day == "Saturday" or day == "Sunday":
    print("It's the weekend!")  # This executes
else:
    print("It's a weekday")

# OR with multiple conditions
if temperature < 0 or temperature > 40:
    print("Extreme weather warning")
```

### NOT Operator

`not` reverses a boolean value.

```python
is_raining = False

if not is_raining:
    print("Let's go outside")  # This executes
else:
    print("Stay inside")

# NOT with conditions
if not (age < 18):
    print("You are 18 or older")

# Avoid double negatives (not recommended)
# if not not is_raining:  # ❌ confusing
if is_raining:  # ✅ clearer
    print("It's raining")
```

---

## Comparison Operators

These return `True` or `False` and are commonly used in conditions.

| Operator | Meaning | Example |
|----------|---------|---------|
| `==` | Equal to | `x == 5` |
| `!=` | Not equal to | `x != 5` |
| `<` | Less than | `x < 5` |
| `>` | Greater than | `x > 5` |
| `<=` | Less than or equal | `x <= 5` |
| `>=` | Greater than or equal | `x >= 5` |
| `in` | Member of sequence | `"a" in "apple"` |
| `not in` | Not in sequence | `3 not in [1, 2, 4]` |
| `is` | Same object (identity) | `x is None` |
| `is not` | Not same object | `x is not None` |

---

## Common Patterns in Data Engineering

### Validating Input

```python
def process_record(data: dict) -> bool:
    """Validate record before processing."""
    if "id" not in data:
        print("Error: Missing ID")
        return False
    
    if not isinstance(data["id"], int):
        print("Error: ID must be integer")
        return False
    
    if data["id"] <= 0:
        print("Error: ID must be positive")
        return False
    
    return True
```

### Handling Missing Values

```python
temperature = None

if temperature is None:
    temperature = 20.0  # Default value
    print(f"Using default temperature: {temperature}")

# Or more concise:
temperature = temperature or 20.0
```

### Routing Based on Data Type

```python
value = "42"

if isinstance(value, int):
    result = value * 2
elif isinstance(value, str):
    result = int(value) * 2
elif isinstance(value, float):
    result = int(value) * 2
else:
    result = None

print(result)  # 84
```

### Filtering Records

```python
records = [
    {"name": "Alice", "age": 30, "active": True},
    {"name": "Bob", "age": 25, "active": False},
    {"name": "Charlie", "age": 35, "active": True},
]

# Filter active adults
valid_records = [
    r for r in records 
    if r["active"] and r["age"] >= 18
]
```

---

## Tips & Gotchas

- **Use `==` for value comparison, not `is`.** `is` checks if two variables point to the same object in memory. `x == 5` asks "are the values equal?" while `x is 5` asks "are they the exact same object?"

```python
a = [1, 2, 3]
b = [1, 2, 3]

a == b  # True (same contents)
a is b  # False (different objects in memory)
```

- **`None` should be checked with `is None`, not `== None`.** By convention, use `if x is None:` rather than `if x == None:`.

```python
x = None

if x is None:  # ✅ Pythonic
    print("x is None")

if x == None:  # ⚠️ Works, but not conventional
    print("x is None")
```

- **Truthiness vs explicit comparison.** Don't rely on truthiness when you mean to compare values.

```python
# ❌ What does "if items:" mean? Is it checking for existence?
if items:
    process(items)

# ✅ Explicit is better than implicit
if items is not None and len(items) > 0:
    process(items)

# ✅ Or use explicit length check
if len(items) > 0:
    process(items)
```

- **Avoid deeply nested if-else.** If you have more than 2–3 levels, consider using a dictionary lookup or early returns.

```python
# ❌ Deeply nested (hard to read)
if condition1:
    if condition2:
        if condition3:
            do_something()

# ✅ Use early returns (clearer)
if not condition1:
    return
if not condition2:
    return
if not condition3:
    return
do_something()
```

- **Use `elif` instead of multiple `if` statements when conditions are mutually exclusive.** It's clearer and slightly faster.

```python
# ❌ Multiple if statements (all are evaluated)
if x > 0:
    print("positive")
if x == 0:
    print("zero")
if x < 0:
    print("negative")

# ✅ If-elif-else (stops at first match)
if x > 0:
    print("positive")
elif x == 0:
    print("zero")
else:
    print("negative")
```

- **Ternary operator is readable up to one level.** Beyond that, use `if-elif-else`.

```python
# ✅ Readable
status = "pass" if score >= 60 else "fail"

# ⚠️ Getting hard to read
grade = "A" if score >= 90 else "B" if score >= 80 else "C" if score >= 70 else "F"

# ✅ Use if-elif-else instead
if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
else:
    grade = "F"
```

- **Empty lists/dicts are falsy; non-empty are truthy.** But be explicit.

```python
items = []

# ❌ Implicit truthiness check
if not items:
    print("No items")

# ✅ Explicit (clearer intent)
if len(items) == 0:
    print("No items")
```

---

## Related

- [[01-Python-Loops]] — Often paired with conditionals for iteration control
- [[04-Python-List-Comprehensions]] — Filtering data with conditions inside comprehensions
- [[03-Python-Modules-Functions-Lists]] — Using conditionals for input validation
- [Official Python Documentation: if Statements](https://docs.python.org/3/tutorial/controlflow.html#if-statements)
- [Real Python: Boolean Operators](https://realpython.com/python-and-operator/)

---

**Key Takeaway:**  
Control flow is decision-making. Use `if-elif-else` for multiple paths, boolean operators (`and`, `or`, `not`) for complex conditions, and ternary operators for simple assignments. Keep conditions readable—your future self will thank you.
