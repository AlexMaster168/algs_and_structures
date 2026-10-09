from ...shared.compare import default_compare
from .insertion_sort import insertion_sort_range
from .merge_sort import merge


def _min_run_length(n):
    remainder = 0
    while n >= 32:
        remainder |= n & 1
        n >>= 1
    return n + remainder


def tim_sort(input, compare=default_compare):
    array = list(input)
    n = len(array)
    if not n:
        return array
    run = _min_run_length(n)
    for start in range(0, n, run):
        insertion_sort_range(array, start, min(start + run - 1, n - 1), compare)
    size = run
    while size < n:
        for left in range(0, n, 2 * size):
            middle = left + size
            right = min(left + 2 * size, n)
            if middle < right:
                array[left:right] = merge(array[left:middle], array[middle:right], compare)
        size *= 2
    return array
