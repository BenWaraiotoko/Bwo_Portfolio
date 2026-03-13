---
title: "Codecademy Exercise: Abruptly Goblins Game Night Planner"
date: 2025-12-28
tags:
  - python
  - dictionaries
  - list-comprehension
  - functions
  - codecademy
publish: true
description: Python dictionaries, list comprehensions, and functions through a tabletop game scheduling problem.
category: learning-log
---

You've opened a game store. You sell dice, miniatures, and the false hope that people will actually show up to scheduled events. Now you need to figure out which night works best for your RPG sessions — and doing it manually is beneath you, so you write a Python script instead.

That's the premise of Codecademy's "Abruptly Goblins" exercise. It's ridiculous, charming, and genuinely useful for understanding dictionaries and list comprehensions.

## Exercise Overview

You run "Sorcery Society," and you're hosting tabletop RPG nights for "Abruptly Goblins!" Ten gamers, seven days, wildly different schedules. Your job: find the night that gets the most people through the door.

The learning targets underneath all the goblin flavoring:

- Working with dictionaries and lists
- Functions with built-in validation
- Building frequency tables from raw data
- List comprehensions for filtering
- String formatting with `.format()`

---

## Part 1: Setting Up the Gamers List

First things first — somewhere to put the players. An empty list, waiting to be filled with hopeful dungeon crawlers:

```python
gamers = []
```

Each gamer is a dictionary: a name and a list of days they can make it. Simple schema.

---

## Part 2: Adding Gamers with Validation

Can't just let anyone into the list — what if someone forgot to fill in their availability? A validation function handles that:

```python
def add_gamer(gamer, gamers_list):
    if gamer.get("name") and gamer.get("availability"):
        gamers_list.append(gamer)
    else:
        print("Gamer missing critical information")
```

`.get()` returns `None` if the key doesn't exist, instead of raising a `KeyError` and blowing everything up. It's one of those small things you start using everywhere.

### Adding the First Gamer

```python
kimberly = {
    'name': "Kimberly Warner",
    'availability': ["Monday", "Tuesday", "Friday"]
}
add_gamer(kimberly, gamers)
```

### Adding the Rest of the Crew

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

Ten players, schedules all over the place. Now let's figure out which night wins.

---

## Part 3: Finding the Perfect Night

### Building a Frequency Table

To count who's available on each day, I need a dictionary initialized to zero for every day of the week. A dictionary comprehension handles that cleanly:

```python
def build_daily_frequency_table():
    days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    return {day: 0 for day in days}

count_availability = build_daily_frequency_table()
```

Dictionary comprehension: concise, readable, and much less tedious than typing out seven key-value pairs manually.

### Calculating Availability

Now loop through every gamer, loop through every day they listed, and tick the counter:

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

Monday leads with 7 out of 10 gamers available. Thursday ties Tuesday at 6. So yeah, Monday game night it is.

### Finding the Best Night

Instead of looping through the table yourself, you can hand the whole job to `max()` with a custom key:

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

`max(availability_table, key=availability_table.get)` — pass `.get` as the key function, and `max()` compares by dictionary values instead of keys. One line, no loop. That's the kind of Pythonic shortcut worth knowing.

### Getting Attendees for Game Night

Now filter down to who can actually show up Monday:

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

List comprehension as a filter: clean, readable, and about 10x less code than a for-loop with an if-statement appending to a separate list.

---

## Part 4: Generating Email Notifications

### Creating an Email Template

Time to tell everyone the good news. A template string with placeholders for the dynamic bits:

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

Loop through the attendees, swap in the values, print the result:

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

Kimberly Warner, you're going to game night.

---

## Part 5: Bonus - Second Game Night

Three gamers couldn't make Monday. Rather than leaving them behind, I ran the whole process again on just the people who missed out:

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

The cool part is that I didn't write any new logic for this — `build_daily_frequency_table()`, `calculate_availability()`, `find_best_night()`, `send_email()` all got reused as-is. That's the payoff for building modular functions: you solve a problem once, then apply it in new contexts without touching the original code.

---

## Key Takeaways

1. **`.get()` over direct key access:** Prevents `KeyError` without try/except everywhere. Use it defensively on any dictionary you don't fully control.
2. **Dictionary comprehensions:** Clean way to initialize structured data. `{day: 0 for day in days}` beats seven manual assignments.
3. **List comprehensions as filters:** `[x for x in list if condition]` reads like English and is much more Pythonic than a for-loop + append.
4. **`max()` with a key function:** You can plug any callable in as the key. `availability_table.get` as the comparator is one of those "oh, that's elegant" moments.
5. **`.format()` for templates:** Gets verbose in large templates, but it works. In modern Python you'd use f-strings — but the pattern of separating template from data is the point.
6. **Modular functions pay off:** Writing small, reusable functions felt like extra work at first. Then the bonus section arrived and I reused four of them without changing a line.

---

## Interactive Version

Full notebook here if you want to run it yourself:
[Open in Google Colab](https://drive.google.com/file/d/1YjEMzwp3OK82g9mchv8Rj2ywvxPANljb/view?usp=sharing)

---

## Related Concepts

The goblin theming is a bit much, but the underlying patterns show up everywhere in data work:

- Data validation and cleaning
- Frequency analysis
- Filtering and aggregation
- Template-based reporting
