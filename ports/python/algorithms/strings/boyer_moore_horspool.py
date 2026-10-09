def boyer_moore_horspool(text, pattern):
    m = len(pattern)
    if m == 0 or m > len(text):
        return []
    shift = {pattern[i]: m - 1 - i for i in range(m - 1)}
    matches, position = [], 0
    while position <= len(text) - m:
        j = m - 1
        while j >= 0 and text[position + j] == pattern[j]:
            j -= 1
        if j < 0:
            matches.append(position)
        position += shift.get(text[position + m - 1], m)
    return matches
