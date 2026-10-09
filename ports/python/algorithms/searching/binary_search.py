from ...shared.compare import default_compare


def binary_search(sorted, target, compare=default_compare, low=0, high=None):
    high = len(sorted) - 1 if high is None else high
    while low <= high:
        mid = low + (high - low) // 2
        order = compare(sorted[mid], target)
        if order == 0:
            return mid
        if order < 0:
            low = mid + 1
        else:
            high = mid - 1
    return -1


def binary_search_recursive(sorted, target, compare=default_compare, low=0, high=None):
    high = len(sorted) - 1 if high is None else high
    if low > high:
        return -1
    mid = low + (high - low) // 2
    order = compare(sorted[mid], target)
    if order == 0:
        return mid
    if order < 0:
        return binary_search_recursive(sorted, target, compare, mid + 1, high)
    return binary_search_recursive(sorted, target, compare, low, mid - 1)


def lower_bound(sorted, target, compare=default_compare):
    low, high = 0, len(sorted)
    while low < high:
        mid = (low + high) // 2
        if compare(sorted[mid], target) < 0:
            low = mid + 1
        else:
            high = mid
    return low


def upper_bound(sorted, target, compare=default_compare):
    low, high = 0, len(sorted)
    while low < high:
        mid = (low + high) // 2
        if compare(sorted[mid], target) <= 0:
            low = mid + 1
        else:
            high = mid
    return low


def first_true(low, high, predicate):
    while low < high:
        mid = low + (high - low) // 2
        if predicate(mid):
            high = mid
        else:
            low = mid + 1
    return low
