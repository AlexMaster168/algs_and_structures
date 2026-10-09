def longest_palindromic_substring(s):
    if len(s) < 2:
        return s
    separator = object()
    t = [object(), separator]
    for char in s:
        t.extend((char, separator))
    t.append(object())
    radius = [0] * len(t)
    center = right = 0
    for i in range(1, len(t) - 1):
        if i < right:
            radius[i] = min(right - i, radius[2 * center - i])
        while t[i + radius[i] + 1] == t[i - radius[i] - 1]:
            radius[i] += 1
        if i + radius[i] > right:
            center, right = i, i + radius[i]
    best_center = max(range(len(t)), key=lambda i: radius[i])
    start = (best_center - radius[best_center]) // 2
    return s[start:start + radius[best_center]]
