BASE = 256
MOD = 1_000_000_007


def rabin_karp(text, pattern):
    m = len(pattern)
    if m == 0 or m > len(text):
        return []
    highest_power = 1
    for _ in range(1, m):
        highest_power = highest_power * BASE % MOD
    pattern_hash = window_hash = 0
    for i in range(m):
        pattern_hash = (pattern_hash * BASE + ord(pattern[i])) % MOD
        window_hash = (window_hash * BASE + ord(text[i])) % MOD
    matches = []
    for start in range(len(text) - m + 1):
        if window_hash == pattern_hash and text.startswith(pattern, start):
            matches.append(start)
        if start + m == len(text):
            break
        window_hash = (window_hash - ord(text[start]) * highest_power) % MOD
        window_hash = (window_hash * BASE + ord(text[start + m])) % MOD
    return matches
