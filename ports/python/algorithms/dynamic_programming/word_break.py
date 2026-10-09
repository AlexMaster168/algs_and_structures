def word_break(text, dictionary):
    words = set(dictionary)
    max_length = max(map(len, words), default=0)
    previous, reachable = [-1] * (len(text) + 1), [False] * (len(text) + 1)
    reachable[0] = True
    for end in range(1, len(text) + 1):
        for start in range(max(0, end - max_length), end):
            if reachable[start] and text[start:end] in words:
                reachable[end], previous[end] = True, start
                break
    if not reachable[-1]:
        return None
    parts, end = [], len(text)
    while end > 0:
        parts.append(text[previous[end]:end])
        end = previous[end]
    return parts[::-1]
