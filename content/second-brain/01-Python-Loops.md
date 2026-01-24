---
title: Python Loops
date: 2026-01-22
publish: true
description: Understanding for and while loops in Python—the two essential iteration patterns
tags:
  - python
  - loops
  - fundamentals
category: second-brain
---
A loop is simply telling Python: "Repeat this block of code multiple times for me."

## Basic Idea

Without a loop, Python reads your code line by line, once.  
With a loop, you take a block of code and say: "Do it again, and again… until I tell you to stop."

## Two Types You Need to Know

Think of two everyday situations:

- **You know how many times you'll repeat**
    → "I jump 5 times on the trampoline"
    → That's a `for` loop (you know the number of iterations).

- **You don't know in advance how many times**
    → "I jump until I'm tired"
    → That's a `while` loop (as long as the condition is true).

---

## For Loop (You Know the Number of Iterations)

Magic phrase to remember:  
**"For each element in the list, execute the indented block."**

Examples to think about:

- "For each student in the class, I say hello."
- "For each number in the list, I print it."

Mental model:

1. Python takes the 1st element from the list.
2. It executes the indented block.
3. It takes the 2nd element, repeats, and so on.

### Quick Reference

```python
# Loop through a list
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)

# Loop through a range of numbers
for i in range(5):  # 0, 1, 2, 3, 4
    print(i)

# Loop with enumerate (get index + value)
for index, fruit in enumerate(fruits):
    print(f"{index}: {fruit}")

# Loop through a dictionary
person = {"name": "Alice", "age": 30, "city": "Paris"}
for key, value in person.items():
    print(f"{key}: {value}")
```

---

## While Loop (As Long As…)

Magic phrase:  
**"While the condition is true, keep looping."**

Real-life examples:

- "While there's pizza, I eat."
- "While the player has lives, the game continues."

**Warning:** If the condition never becomes false, the loop never stops (infinite loop).

### Quick Reference

```python
# Simple while loop
count = 0
while count < 5:
    print(count)
    count += 1  # Don't forget to update the condition!

# Loop until user types "quit"
while True:
    user_input = input("Enter something (or 'quit'): ")
    if user_input == "quit":
        break  # Exit the loop
    print(f"You said: {user_input}")

# Loop with multiple conditions
player_lives = 3
enemies_defeated = 0
while player_lives > 0 and enemies_defeated < 10:
    # Game logic...
    player_lives -= 1
    enemies_defeated += 1
```

---

## Memory Aid

- **`for`** → You can count on your fingers before you start (3 times, 10 times, for each element in a list).
- **`while`** → You watch a condition that can change (score, lives, user input, counter…).

---

## Common Loop Control Statements

| Statement | Purpose | Example |
|-----------|---------|---------|
| **`break`** | Exit the loop immediately | `if score < 0: break` |
| **`continue`** | Skip to next iteration | `if x < 0: continue` |
| **`else`** (with loop) | Runs after loop completes normally | `for x in range(5): ... else: print("Done")` |
| **`range(start, stop, step)`** | Generate sequence of numbers | `range(0, 10, 2)` → 0, 2, 4, 6, 8 |

---

## Tips & Gotchas

- **`range()` is exclusive of the stop value.** `range(5)` gives 0–4, not 0–5.

- **Forgetting to update the `while` condition is the #1 cause of infinite loops.** Always update a counter or change state.

- **`for` loops are usually better than `while` when iterating over data.** `for` is safer (harder to create infinite loops).

- **List comprehensions are faster than loops.** `[x*2 for x in items]` is cleaner and ~30% faster than a `for` loop with `.append()`.

- **Indentation matters!** Python uses indentation to define the loop body. Wrong indent = code outside the loop.

- **You can nest loops, but keep it simple.** More than 2 levels deep gets hard to read. Consider a function instead.

---

## Related

- [[03-Python-Modules-Functions-Lists]] — Lists are the most common data structure you loop through.
- [[04-Python-List-Comprehensions]] — The Pythonic alternative to `for` loops with transformations.
- [[02-Python-Control-Flow]] — Often paired with loops for conditional logic.
- [Official Python Loop Documentation](https://docs.python.org/3/tutorial/controlflow.html#for-statements)

---

**Key Takeaway:**  
Use `for` when you have a known collection (list, range, dict). Use `while` when you have a condition that changes over time. Prefer loops to repeated code—never copy-paste the same block three times!
