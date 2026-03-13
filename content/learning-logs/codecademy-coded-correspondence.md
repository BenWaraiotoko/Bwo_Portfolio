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

Your pen pal Vishal has been sending you scrambled gibberish, and the goal is to unscramble it using Python. That's the entire premise of this Codecademy exercise, and honestly — it's a great one.

Behind the spy-correspondence flavor is a genuinely useful set of concepts: string manipulation, modular arithmetic, and the kind of character-by-character iteration you'll find yourself doing in all kinds of text processing tasks. Plus classical cryptography is just inherently interesting.

## Exercise Overview

You and Vishal have been exchanging encoded letters using classic ciphers. He sends you a scrambled message; you decode it with Python, write a reply, and encode that too. Then it escalates.

The learning targets:

- String manipulation and character operations
- Modular arithmetic with `%`
- Caesar Cipher: encoding, decoding, and brute-force cracking
- Vigenère Cipher: polyalphabetic substitution with a keyword
- Building reusable functions for both

---

## Part 1: Understanding the Caesar Cipher

The Caesar Cipher is the simplest cipher there is: take every letter in your message and shift it a fixed number of positions down the alphabet. Julius Caesar used a shift of 3, which means even Roman senators were sending what amounted to ROT3 messages.

For a shift of 3:
- `h` → `e`
- `e` → `b`
- `l` → `i`
- `o` → `l`

So `"hello"` becomes `"ebiil"`. Uncrackable, clearly.

---

## Part 2: Decoding Vishal's First Message

Vishal sends this as his opening move, with an offset of 10:

```text
xuo jxuhu! jxyi yi qd unqcfbu ev q squiqh syfxuh. muhu oek qrbu je tusetu yj? y xefu ie! iudt cu q cuiiqwu rqsa myjx jxu iqcu evviuj!
```

### Writing the Decode Function

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

A few things worth pausing on here:
- `ord()` and `chr()` convert between characters and their ASCII integer values — the actual mechanism behind the shift
- `.isalpha()` skips spaces and punctuation, which is why the output preserves them
- `% 26` wraps around: if you shift `z` forward by 3 you don't fall off the alphabet, you land at `c`
- The `base` calculation handles uppercase and lowercase separately so both work correctly

---

## Part 3: Encoding a Reply

Message decoded. Now I need to reply. Same offset, direction reversed:

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

Encoding adds the offset, decoding subtracts it. The modulo keeps everything inside the 26-letter alphabet. And honestly? It just works.

---

## Part 4: Decoding Messages with Hints

Vishal levels it up: he sends two messages, and the first one tells you the offset for the second.

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

Layering multiple Caesar ciphers adds some security — but as Vishal's decoded message itself points out, there are much more elegant ways to do this. The Vigenère cipher is coming.

---

## Part 5: Brute Force Attack

Next challenge: decode a message with no hint about the offset. No problem — there are only 25 possible shifts. Just try all of them.

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

Offset 19 decodes to plain English. You didn't need the key — you just needed a loop and a second to scan the output. This is why Caesar ciphers are in the "historical curiosity" category and not the "actual security" category.

---

## Part 6: The Vigenère Cipher

The Vigenère Cipher is what you graduate to when you realize a single fixed shift is trivial to crack. Instead of one offset, you use a **keyword** — and each letter in your message gets a different shift based on the corresponding letter in that keyword.

### How It Works

Take the message `"barry is the spy"` and the keyword `"dog"`:

1. Repeat the keyword to match message length (skip spaces): `"dogdo gd ogd ogd"`
2. Shift each letter by the corresponding keyword letter's position

```text
message:           b  a  r  r  y    i  s    t  h  e    s  p  y
keyword phrase:    d  o  g  d  o    g  d    o  g  d    o  g  d
resulting values:  24 12 11 14 10   2  15   5  1  1    4  9  21
encoded message:   y  m  l  o  k    c  p    f  b  b    e  j  v
```

Result: `"ymlok cp fbb ejv"`

Every letter gets a different shift depending on where you are in the keyword cycle. Brute-forcing this is a different problem entirely — you'd need to know the keyword length and crack each "stream" separately. Way harder.

### Decoding Vigenère Messages

Vishal's next encoded message, using the keyword `"friends"`:
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

The key implementation detail: `keyword_index` only increments for alphabetic characters. Spaces and punctuation pass through untouched and don't advance the keyword position. Get this wrong and your alignment breaks after the first space.

---

## Part 7: Encoding with Vigenère

And finally, send something back:

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

Encode, then immediately verify by decoding. If the roundtrip works, the implementation is correct. Satisfying.

---

## Key Takeaways

1. **`ord()` and `chr()`** are the foundation of any character-level manipulation. They convert between the symbol and its numeric representation — essential for arithmetic on letters.
2. **`% 26`** wraps the alphabet. Without it, shifting `z` by 3 would take you off the end. With it, you cycle back to `c`. Modular arithmetic is cleaner than any if-statement you'd write instead.
3. **`.isalpha()`** is your gatekeeper. It lets you skip spaces, punctuation, and numbers without special-casing each one.
4. **Caesar vs. Vigenère:** Caesar is one shift for every letter. Vigenère cycles through a keyword, giving each letter a different shift. Fundamentally harder to crack — brute-forcing requires knowing the keyword length first.
5. **25 attempts breaks Caesar.** That's not a theoretical weakness; it's a practical one. A loop and a human glancing at the output is all it takes.
6. **Index management matters in Vigenère.** The `keyword_index` must only advance on alphabetic characters. A small logic bug here produces garbled output with no obvious error message.

---

## Refactored Code

Here's the complete solution cleaned up and organized:

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

Full notebook if you want to run the code:
[View Jupyter Notebook](https://drive.google.com/file/d/1tjxbs18TpSffFVIQ1wgS2oL6d4Fx7z3V/view?usp=sharing)

---

## Related Concepts

The crypto angle is fun, but the transferable skills here are:

- **String manipulation and iteration** — character-by-character processing shows up everywhere in text parsing
- **ASCII encoding and `ord()`/`chr()`** — useful any time you need to work at the level of individual characters
- **Modular arithmetic** — wrapping, cycling, indexing in rings — comes back in hashing, calendars, circular buffers
- **Brute force and complexity** — understanding why some problems are trivially easy to crack by exhaustion vs. ones that aren't
- **Clean function design** — encode/decode as separate, reusable functions with a consistent interface
