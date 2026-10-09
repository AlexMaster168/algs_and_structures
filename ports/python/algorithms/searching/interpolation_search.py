def interpolation_search(sorted, target):
    low, high = 0, len(sorted) - 1
    while low <= high and sorted[low] <= target <= sorted[high]:
        if sorted[high] == sorted[low]:
            return low if sorted[low] == target else -1
        position = low + int((target - sorted[low]) * (high - low) // (sorted[high] - sorted[low]))
        value = sorted[position]
        if value == target:
            return position
        if value < target:
            low = position + 1
        else:
            high = position - 1
    return -1
