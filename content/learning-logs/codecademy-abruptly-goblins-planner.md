---
title: "Codecademy Exercise: Abruptly Goblins Game Night Planner"
date: 2025-12-28
tags: ["python", "dictionaries", "list-comprehension", "functions", "codecademy"]
categories: ["Learning Logs"]
draft: false
description: "Python dictionaries, list comprehensions, and functions through a tabletop game scheduling problem."
---

This learning log documents my version of the Codecademy "Abruptly Goblins Planner" exercise, which teaches Python fundamentals including dictionaries, list comprehensions, and function design through a practical scheduling problem.

## Exercise Overview

The scenario: You've opened a game store called "Sorcery Society" and want to host tabletop RPG nights for "Abruptly Goblins!" To maximize attendance, you need to automate the process of finding the best night based on player availability.

**Key Learning Objectives:**

- Working with dictionaries and lists
- Creating and using functions with validation
- Building frequency tables
- Using list comprehensions for filtering
- String formatting with `.format()`

---

## Part 1: Setting Up the Gamers List

First, I created an empty list to store all the gamers who want to attend game night:

```python
gamers = []
```

Each gamer will be represented as a dictionary with `"name"` and `"availability"` keys.

---

## Part 2: Adding Gamers with Validation

I created a function to add gamers to the list with built-in validation to ensure each gamer has both required fields:

```python
def add_gamer(gamer, gamers_list):
    if gamer.get("name") and gamer.get("availability"):
        gamers_list.append(gamer)
    else:
        print("Gamer missing critical information")
```

**Key Concept:** Using `.get()` method safely checks for dictionary keys without raising `KeyError`.

### Adding the First Gamer

```python
kimberly = {
    'name': "Kimberly Warner",
    'availability': ["Monday", "Tuesday", "Friday"]
}
add_gamer(kimberly, gamers)
```

### Adding More Gamers

```python
add_gamer({'name':'Thomas Nelson', 'availability': ["Tuesday", "Thursday", "Saturday"]}, gamers)
add_gamer({'name':'Joyce Sellers', 'availability': ["Monday", "Wednesday", "Friday", "Saturday"]}, gamers)
add_gamer({'name':'Michelle Reyes', 'availability': ["Wednesday", "Thursday", "Sunday"]}, gamers)
add_gamer({'name':'Stephen Adams', 'availability': ["Thursday", "Saturday"]}, gamers)
add_gamer({'name': 'Joanne Lynn', 'availability': ["Monday", "Thursday"]}, gamers)
add_gamer({'name':'Latasha Bryan', 'availability': ["Monday", "Sunday"]}, gamers)
add_gamer({'name':'Crystal Brewer', 'availability': ["Thursday", "Friday", "Saturday"]}, gamers)
add_gamer({'name':'James Barnes Jr.', 'availability': ["Tuesday", "Wednesday", "Thursday", "Sunday"]}, gamers)
add_gamer({'name':'Michel Trujillo', 'availability': ["Monday", "Tuesday", "Wednesday"]}, gamers)
```

---

## Part 3: Finding the Perfect Night

### Building a Frequency Table

To count availability per day, I created a function that initializes a dictionary with all days set to zero:

```python
def build_daily_frequency_table():
    days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    return {day: 0 for day in days}

count_availability = build_daily_frequency_table()
```

**Key Concept:** Dictionary comprehension provides a clean way to initialize structured data.

### Calculating Availability

This function iterates through all gamers and increments the count for each day they're available:

```python
def calculate_availability(gamers_list, available_frequency):
    for gamer in gamers_list:
        for day in gamer["availability"]:
            available_frequency[day] += 1

calculate_availability(gamers, count_availability)
print(count_availability)
```

**Output:**

```python
{'Monday': 7, 'Tuesday': 6, 'Wednesday': 4, 'Thursday': 6, 'Friday': 5, 'Saturday': 4, 'Sunday': 3}
```

### Finding the Best Night

I used Python's `max()` function with a custom key to find the day with maximum availability:

```python
def find_best_night(availability_table):
    return max(availability_table, key=availability_table.get)

game_night = find_best_night(count_availability)
print(f"The best night to host the game is: {game_night}")
```

**Output:**

```text
The best night to host the game is: Monday
```

**✌🏼 Pythonic Approach:** This function uses `max()` with `.get` as the key parameter, which is more concise than manually looping through the dictionary to compare values.

### Getting Attendees for Game Night

Using list comprehension to filter gamers available on the chosen night:

```python
def available_on_night(gamers_list, day):
    return [gamer for gamer in gamers_list if day in gamer["availability"]]

attending_game_night = available_on_night(gamers, game_night)
print(attending_game_night)
```

**Output:**

```python
[{'name': 'Kimberly Warner', 'availability': ['Monday', 'Tuesday', 'Friday']}, ...]
```

---

## Part 4: Generating Email Notifications

### Creating an Email Template

I created a template string with placeholder variables for dynamic content:

```python
form_email = """
Subject: Game Night this {day_of_week}!

Dear {name},

We are excited to invite you to our "{game}" night on {day_of_week}.
Please let us know if you can make it.

Magically Yours,
the Sorcery Society
"""
```

### Sending Emails

This function iterates through attendees and formats the email for each person:

```python
def send_email(gamers_who_can_attend, day, game):
    for gamer in gamers_who_can_attend:
        print(form_email.format(
            day_of_week=day,
            name=gamer["name"],
            game=game
        ))

send_email(attending_game_night, game_night, "Abruptly Goblins")
```

**Output:**

```text
Subject: Game Night this Monday!

Dear Kimberly Warner,

We are excited to invite you to our "Abruptly Goblins" night on Monday.
Please let us know if you can make it.

Magically Yours,
the Sorcery Society
```

---

## Part 5: Bonus - Second Game Night

To accommodate gamers who couldn't make the first night, I implemented a second game night:

```python
# Find gamers who can't attend the best night
unable_to_attend_best_night = [
    gamer for gamer in gamers
    if gamer not in attending_game_night
]

# Build frequency table for remaining gamers
second_night_availability = build_daily_frequency_table()
calculate_availability(unable_to_attend_best_night, second_night_availability)
second_night = find_best_night(second_night_availability)

# Notify all gamers available on the second night
available_second_game_night = available_on_night(gamers, second_night)
send_email(available_second_game_night, second_night, "Abruptly Goblins")
```

**Key Concept:** Reusing existing functions demonstrates the power of modular, reusable code design.

---

## Key Takeaways

1. **Dictionary Validation:** Using `.get()` prevents `KeyError` exceptions when checking for keys
2. **Dictionary Comprehensions:** Concise syntax for initializing structured data
3. **List Comprehensions:** Clean filtering syntax that's more readable than traditional loops
4. **The `max()` Function:** Can accept custom key functions for complex comparisons
5. **String Formatting:** `.format()` method allows dynamic string construction
6. **Functional Programming:** Writing reusable functions makes code more maintainable and testable

---

## Interactive Version

You can view and run the full interactive notebook here:
[Open in Google Colab](https://drive.google.com/file/d/1YjEMzwp3OK82g9mchv8Rj2ywvxPANljb/view?usp=sharing)

---

## Related Concepts

This exercise reinforced important data engineering concepts:

- Data validation and cleaning
- Frequency analysis
- Filtering and aggregation
- Template-based reporting
