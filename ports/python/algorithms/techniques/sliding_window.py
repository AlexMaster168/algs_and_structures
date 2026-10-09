from collections import Counter, deque


def max_sum_window(values, size):
    if size <= 0 or size > len(values):
        raise ValueError('Invalid window size')
    total = best = sum(values[:size])
    for i in range(size, len(values)):
        total += values[i] - values[i - size]
        best = max(best, total)
    return best


def sliding_window_maximum(values, size):
    if size <= 0:
        raise ValueError('Invalid window size')
    window, result = deque(), []
    for i, value in enumerate(values):
        while window and window[0] <= i - size:
            window.popleft()
        while window and values[window[-1]] <= value:
            window.pop()
        window.append(i)
        if i >= size - 1:
            result.append(values[window[0]])
    return result


def longest_unique_substring(text):
    seen, start, best_start, best_length = {}, 0, 0, 0
    for end, char in enumerate(text):
        start = max(start, seen.get(char, -1) + 1)
        seen[char] = end
        if end - start + 1 > best_length:
            best_start, best_length = start, end - start + 1
    return text[best_start:best_start + best_length]


def min_window_substring(text, required):
    if not required:
        return ''
    need, missing, left, best_start, best_length = Counter(required), len(required), 0, 0, float('inf')
    for right, char in enumerate(text):
        if need[char] > 0:
            missing -= 1
        need[char] -= 1
        while missing == 0:
            if right - left + 1 < best_length:
                best_start, best_length = left, right - left + 1
            old = text[left]
            left += 1
            need[old] += 1
            if need[old] > 0:
                missing += 1
    return '' if best_length == float('inf') else text[best_start:best_start + best_length]
