def longest_increasing_subsequence(values):
    tails, previous = [], [-1] * len(values)
    for i, value in enumerate(values):
        low, high = 0, len(tails)
        while low < high:
            mid = (low + high) // 2
            if values[tails[mid]] < value:
                low = mid + 1
            else:
                high = mid
        if low:
            previous[i] = tails[low - 1]
        if low == len(tails):
            tails.append(i)
        else:
            tails[low] = i
    result = []
    i = tails[-1] if tails else -1
    while i != -1:
        result.append(values[i])
        i = previous[i]
    return result[::-1]
