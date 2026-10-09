def z_function(s):
    z = [0] * len(s)
    if s:
        z[0] = len(s)
    left = right = 0
    for i in range(1, len(s)):
        if i < right:
            z[i] = min(right - i, z[i - left])
        while i + z[i] < len(s) and s[z[i]] == s[i + z[i]]:
            z[i] += 1
        if i + z[i] > right:
            left, right = i, i + z[i]
    return z


def z_search(text, pattern):
    if not pattern:
        return []
    z = z_function(list(pattern) + [object()] + list(text))
    return [i - len(pattern) - 1 for i in range(len(pattern) + 1, len(z)) if z[i] >= len(pattern)]
