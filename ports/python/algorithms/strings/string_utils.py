import re


def is_balanced(input):
    brackets, stack = {')': '(', ']': '[', '}': '{'}, []
    for char in input:
        if char in '([{':
            stack.append(char)
        elif char in brackets and (not stack or stack.pop() != brackets[char]):
            return False
    return not stack


def is_palindrome(input):
    normalized = ''.join(char for char in input.lower() if char.isalnum())
    i, j = 0, len(normalized) - 1
    while i < j:
        if normalized[i] != normalized[j]:
            return False
        i += 1
        j -= 1
    return True


def is_anagram(a, b):
    if len(a) != len(b):
        return False
    counts = {}
    for char in a:
        counts[char] = counts.get(char, 0) + 1
    for char in b:
        if not counts.get(char, 0):
            return False
        counts[char] -= 1
    return True


def group_anagrams(words):
    groups = {}
    for word in words:
        groups.setdefault(''.join(sorted(word)), []).append(word)
    return list(groups.values())


def run_length_encode(input):
    return re.sub(r'(.)\1*', lambda match: f'{len(match[0])}{match[1]}', input, flags=re.S)


def run_length_decode(input):
    return re.sub(r'(\d+)(.)', lambda match: match[2] * int(match[1]), input, flags=re.S)


def reverse_words(input):
    return ' '.join(reversed(input.split()))
