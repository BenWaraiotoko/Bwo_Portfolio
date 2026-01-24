---
title: "Codecademy Exercise: Coded Correspondence"
date: 2025-12-28
tags:
  - python
  - cryptography
  - strings
  - algorithms
  - codecademy
publish: true
description: Python string manipulation and cryptography through Caesar and Vigenère cipher implementations.
category: learning-log
---

This learning log documents my version of the Codecademy "Coded Correspondence" exercise, which teaches Python fundamentals including string manipulation, modular arithmetic, and cryptography algorithms through practical cipher implementation.

## Exercise Overview

The scenario: You and your pen pal Vishal have been exchanging encoded letters. He's teaching you about classical cryptography ciphers, and you need to use Python to decode his messages and send encrypted replies!

**Key Learning Objectives:**

- String manipulation and character operations
- Modular arithmetic with the `%` operator
- Caesar Cipher encoding and decoding
- Brute force attack techniques
- Vigenère Cipher (polyalphabetic substitution)
- Function design for reusable cryptographic operations

---

## Part 1: Understanding the Caesar Cipher

The **Caesar Cipher** is a substitution cipher where each letter is shifted by a fixed number of positions in the alphabet. For example, with an offset of 3:
- `h` → `e`
- `e` → `b`
- `l` → `i`
- `o` → `l`

So `"hello"` becomes `"ebiil"`.

---

## Part 2: Decoding Vishal's First Message

Vishal sent this encoded message with an offset of 10:

```text
xuo jxuhu! jxyi yi qd unqcfbu ev q squiqh syfxuh. muhu oek qrbu je tusetu yj? y xefu ie! iudt cu q cuiiqwu rqsa myjx jxu iqcu evviuj!
```

### Creating a Caesar Decode Function

```python
def caesar_decode(message, offset):
    decrypted = []
    for char in message:
        if char.isalpha():
            base = ord('a') if char.islower() else ord('A')
            decrypted_char = chr((ord(char) - base - offset) % 26 + base)
            decrypted.append(decrypted_char)
        else:
            decrypted.append(char)
    return ''.join(decrypted)

# Decode with offset of -10 (or shift back 10)
decoded_message = caesar_decode(caesar_cipher_vishal, -10)
print(decoded_message)
```

**Output:**
```text
hey there! this is an example of a caesar cipher. were you able to decode it? i hope so! send me a message back with the same offset!
```

**Key Concepts:**
- **`ord()` and `chr()`**: Convert between characters and ASCII values
- **`.isalpha()`**: Check if character is alphabetic (skips spaces and punctuation)
- **Modular arithmetic**: `% 26` wraps around the alphabet
- **Base calculation**: Handles both uppercase and lowercase letters

---

## Part 3: Encoding a Reply

Now let's send Vishal an encoded reply using the same offset:

```python
def caesar_encode(message, offset):
    encoded_chars = []
    for char in message:
        if char.isalpha():
            base = ord('a') if char.islower() else ord('A')
            encoded_char = chr((ord(char) - base + offset) % 26 + base)
            encoded_chars.append(encoded_char)
        else:
            encoded_chars.append(char)
    return ''.join(encoded_chars)

my_message = "hey bro! yes i got it"
encoded_reply = caesar_encode(my_message, 10)
print(encoded_reply)
```

**Output:**
```text
roi lby! ioc s qyd sd
```

**✌🏼 Pythonic Note:** Encoding uses `+ offset` while decoding uses `- offset`. The modulo operator ensures we always stay within the 26-letter alphabet.

---

## Part 4: Decoding Messages with Hints

Vishal sent two more messages. The first reveals the offset for the second:

### Message 1 (offset 10):
```python
message1 = "jxu evviuj veh jxu iusedt cuiiqwu yi vekhjuud."
decoded1 = caesar_decode(message1, -10)
print(decoded1)
```

**Output:**
```text
the offset for the second message is fourteen.
```

### Message 2 (offset 14):
```python
message2 = "bqdradyuzs ygxfubxq omqemd oubtqde fa oapq kagd yqeemsqe ue qhqz yadq eqogdq!"
decoded2 = caesar_decode(message2, -14)
print(decoded2)
```

**Output:**
```text
performing multiple caesar ciphers to code your messages is even more secure!
```

**Key Concept:** Cascading Caesar ciphers increases security, but Vigenère ciphers (coming later) accomplish this more elegantly.

---

## Part 5: Brute Force Attack

Vishal's next challenge: decode a message **without knowing the offset**! The solution? Try all 25 possible shifts.

```python
mystery_message = "vhfinmxkl atox kxgwxkxw tee hy maxlx hew vbiaxkl hulhexmx. px'ee atox mh kxteer lmxi ni hnk ztfx by px ptgm mh dxxi hnk fxlltzxl ltyx."

for offset_value in range(1, 26):
    decoded_message = caesar_decode(mystery_message, offset_value)
    print(f"Offset {offset_value}: {decoded_message}")
```

**Output (partial):**
```text
Offset 1: ugehmlwjk zsnw jwfvwjwv sdd gx lzwkw gdv uahzwjk gtkgdwlw...
Offset 2: tfdglkvij yrmv iveuvivu rcc fw kyvjv fcu tzgyvij fsjfcvkv...
...
Offset 19: computers have rendered all of these old ciphers obsolete. we'll have to really step up our game if we want to keep our messages safe.
```

**Key Concept:** Brute force attacks demonstrate why simple Caesar ciphers are weak. With only 25 possible shifts, they're trivial to crack with modern computing power.

---

## Part 6: The Vigenère Cipher

The **Vigenère Cipher** is a polyalphabetic substitution cipher that uses a **keyword** to determine different shifts for each letter.

### How It Works

Given the message `"barry is the spy"` and keyword `"dog"`:

1. Repeat the keyword to match message length (skip spaces): `"dogdo gd ogd ogd"`
2. Shift each letter by the corresponding keyword letter's position

```text
message:           b  a  r  r  y    i  s    t  h  e    s  p  y
keyword phrase:    d  o  g  d  o    g  d    o  g  d    o  g  d
resulting values:  24 12 11 14 10   2  15   5  1  1    4  9  21
encoded message:   y  m  l  o  k    c  p    f  b  b    e  j  v
```

Result: `"ymlok cp fbb ejv"`

### Decoding Vigenère Messages

Vishal's encoded message:
```text
txm srom vkda gl lzlgzr qpdb? fepb ejac! ubr imn tapludwy mhfbz cza ruxzal wg zztcgcexxch!
```

Keyword: `"friends"`

```python
def vigenere_decode(ciphertext, keyword):
    decrypted = []
    keyword_length = len(keyword)
    keyword_index = 0

    for char in ciphertext:
        if char.isalpha():
            base = ord('a') if char.islower() else ord('A')
            key_char = keyword[keyword_index % keyword_length].lower()
            key_shift = ord(key_char) - ord('a')
            decrypted_char = chr((ord(char) - base + key_shift) % 26 + base)
            decrypted.append(decrypted_char)
            keyword_index += 1
        else:
            decrypted.append(char)

    return ''.join(decrypted)

decoded = vigenere_decode(ciphertext, "friends")
print(decoded)
```

**Output:**
```text
you were able to decode this? nice work! you are becoming quite the expert at cracking codes!
```

**Important:** The `keyword_index` only increments for alphabetic characters, so spaces and punctuation don't affect the keyword alignment.

---

## Part 7: Encoding with Vigenère

Finally, let's encode our own message to send back:

```python
def vigenere_encode(plaintext, keyword):
    encrypted = []
    keyword_length = len(keyword)
    keyword_index = 0

    for char in plaintext:
        if char.isalpha():
            base = ord('a') if char.islower() else ord('A')
            key_char = keyword[keyword_index % keyword_length].lower()
            key_shift = ord(key_char) - ord('a')
            encrypted_char = chr((ord(char) - base - key_shift) % 26 + base)
            encrypted.append(encrypted_char)
            keyword_index += 1
        else:
            encrypted.append(char)

    return ''.join(encrypted)

my_message = "Hey bro! your exercise was really hard but I succeeded"
encoded = vigenere_encode(my_message, "friends")
print(f"Encoded: {encoded}")

# Verify by decoding
verified = vigenere_decode(encoded, "friends")
print(f"Verified: {verified}")
```

**Output:**
```text
Encoded: Cnq xel! tjho wtrokdlw pne hmnuuq zho ldb S afllntatp
Verified: Hey bro! your exercise was really hard but I succeeded
```

---

## Key Takeaways

1. **Character Operations:** `ord()` and `chr()` enable ASCII-based manipulation for encryption
2. **Modular Arithmetic:** The `% 26` operator wraps alphabet indices elegantly
3. **Conditional Processing:** Using `.isalpha()` preserves spaces and punctuation
4. **Caesar vs. Vigenère:**
   - Caesar Cipher: Single shift (monoalphabetic)
   - Vigenère Cipher: Multiple shifts with keyword (polyalphabetic)
5. **Brute Force Weakness:** Caesar ciphers are trivial to crack (only 25 attempts)
6. **Function Design:** Reusable `encode` and `decode` functions follow DRY principles
7. **Index Management:** Careful tracking of keyword position for Vigenère cipher

---

## Refactored Code

Here's the complete refactored solution with better organization:

```python
# ============================================
# CAESAR CIPHER FUNCTIONS
# ============================================

def caesar_decode(message, offset):
    """Decodes a message encrypted with Caesar cipher."""
    decrypted = []
    for char in message:
        if char.isalpha():
            base = ord('a') if char.islower() else ord('A')
            decrypted_char = chr((ord(char) - base - offset) % 26 + base)
            decrypted.append(decrypted_char)
        else:
            decrypted.append(char)
    return ''.join(decrypted)


def caesar_encode(message, offset):
    """Encodes a message using Caesar cipher."""
    encoded_chars = []
    for char in message:
        if char.isalpha():
            base = ord('a') if char.islower() else ord('A')
            encoded_char = chr((ord(char) - base + offset) % 26 + base)
            encoded_chars.append(encoded_char)
        else:
            encoded_chars.append(char)
    return ''.join(encoded_chars)


def caesar_brute_force(message):
    """Attempts all possible shifts to decode a Caesar cipher message."""
    for offset in range(1, 26):
        decoded = caesar_decode(message, offset)
        print(f"Offset {offset}: {decoded}")


# ============================================
# VIGENÈRE CIPHER FUNCTIONS
# ============================================

def vigenere_decode(ciphertext, keyword):
    """Decodes a message encrypted with Vigenère cipher."""
    decrypted = []
    keyword_length = len(keyword)
    keyword_index = 0

    for char in ciphertext:
        if char.isalpha():
            base = ord('a') if char.islower() else ord('A')
            key_char = keyword[keyword_index % keyword_length].lower()
            key_shift = ord(key_char) - ord('a')
            decrypted_char = chr((ord(char) - base + key_shift) % 26 + base)
            decrypted.append(decrypted_char)
            keyword_index += 1
        else:
            decrypted.append(char)

    return ''.join(decrypted)


def vigenere_encode(plaintext, keyword):
    """Encodes a message using Vigenère cipher."""
    encrypted = []
    keyword_length = len(keyword)
    keyword_index = 0

    for char in plaintext:
        if char.isalpha():
            base = ord('a') if char.islower() else ord('A')
            key_char = keyword[keyword_index % keyword_length].lower()
            key_shift = ord(key_char) - ord('a')
            encrypted_char = chr((ord(char) - base - key_shift) % 26 + base)
            encrypted.append(encrypted_char)
            keyword_index += 1
        else:
            encrypted.append(char)

    return ''.join(encrypted)
```

---

## Interactive Version

You can view and run the full interactive notebook here:
[View Jupyter Notebook](https://drive.google.com/file/d/1tjxbs18TpSffFVIQ1wgS2oL6d4Fx7z3V/view?usp=sharing)

---

## Related Concepts

This exercise reinforced important computer science and cryptography concepts:

- **String manipulation and iteration**
- **ASCII encoding and character operations**
- **Modular arithmetic for wrapping values**
- **Algorithm complexity and brute force attacks**
- **Classical cryptography history (Caesar, Vigenère)**
- **Security principles and cipher strength**
