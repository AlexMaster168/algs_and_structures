def prefix_function(pattern):
    pi = [0] * len(pattern)
    for i in range(1, len(pattern)):
        k = pi[i - 1]
        while k > 0 and pattern[i] != pattern[k]:
            k = pi[k - 1]
        if pattern[i] == pattern[k]:
            k += 1
        pi[i] = k
    return pi


def kmp_search(text, pattern):
    if not pattern:
        return []
    pi, matches, k = prefix_function(pattern), [], 0
    for i, char in enumerate(text):
        while k > 0 and char != pattern[k]:
            k = pi[k - 1]
        if char == pattern[k]:
            k += 1
        if k == len(pattern):
            matches.append(i - k + 1)
            k = pi[k - 1]
    return matches
