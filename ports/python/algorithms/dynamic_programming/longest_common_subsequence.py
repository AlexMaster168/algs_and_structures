def longest_common_subsequence(a, b):
    table = [[0] * (len(b) + 1) for _ in range(len(a) + 1)]
    for i in range(1, len(a) + 1):
        for j in range(1, len(b) + 1):
            table[i][j] = table[i - 1][j - 1] + 1 if a[i - 1] == b[j - 1] else max(table[i - 1][j], table[i][j - 1])
    result, i, j = [], len(a), len(b)
    while i > 0 and j > 0:
        if a[i - 1] == b[j - 1]:
            result.append(a[i - 1])
            i -= 1
            j -= 1
        elif table[i - 1][j] >= table[i][j - 1]:
            i -= 1
        else:
            j -= 1
    return ''.join(reversed(result))


def longest_common_substring(a, b):
    previous = [0] * (len(b) + 1)
    best_length = best_end = 0
    for i in range(1, len(a) + 1):
        current = [0] * (len(b) + 1)
        for j in range(1, len(b) + 1):
            if a[i - 1] == b[j - 1]:
                current[j] = previous[j - 1] + 1
                if current[j] > best_length:
                    best_length, best_end = current[j], i
        previous = current
    return a[best_end - best_length:best_end]
