def two_sum_sorted(sorted, target):
    left, right = 0, len(sorted) - 1
    while left < right:
        total = sorted[left] + sorted[right]
        if total == target:
            return [left, right]
        if total < target:
            left += 1
        else:
            right -= 1
    return None


def two_sum(values, target):
    seen = {}
    for i, value in enumerate(values):
        if target - value in seen:
            return [seen[target - value], i]
        seen[value] = i
    return None


def three_sum(values, target=0):
    values = sorted(values)
    result = []
    for i in range(len(values) - 2):
        if i > 0 and values[i] == values[i - 1]:
            continue
        left, right = i + 1, len(values) - 1
        while left < right:
            total = values[i] + values[left] + values[right]
            if total < target:
                left += 1
            elif total > target:
                right -= 1
            else:
                result.append([values[i], values[left], values[right]])
                while left < right and values[left] == values[left + 1]:
                    left += 1
                while left < right and values[right] == values[right - 1]:
                    right -= 1
                left += 1
                right -= 1
    return result


def container_with_most_water(heights):
    left, right, best = 0, len(heights) - 1, 0
    while left < right:
        best = max(best, min(heights[left], heights[right]) * (right - left))
        if heights[left] < heights[right]:
            left += 1
        else:
            right -= 1
    return best


def remove_duplicates_sorted(values):
    write = 0
    for value in values:
        if write == 0 or value != values[write - 1]:
            values[write] = value
            write += 1
    del values[write:]
    return write


def dutch_national_flag(values, pivot):
    low = middle = 0
    high = len(values) - 1
    while middle <= high:
        if values[middle] < pivot:
            values[low], values[middle] = values[middle], values[low]
            low += 1
            middle += 1
        elif values[middle] > pivot:
            values[middle], values[high] = values[high], values[middle]
            high -= 1
        else:
            middle += 1
    return values


def has_cycle_floyd(start, next):
    slow = fast = start
    while fast is not None:
        fast = next(fast)
        if fast is None:
            return False
        fast, slow = next(fast), next(slow)
        if fast is not None and fast is slow:
            return True
    return False
