from math import isqrt


def jump_search(sorted, target):
    n = len(sorted)
    if not n:
        return -1
    step = isqrt(n)
    previous, current = 0, step
    while current < n and sorted[current - 1] < target:
        previous = current
        current += step
    for i in range(previous, min(current, n)):
        if sorted[i] == target:
            return i
    return -1
