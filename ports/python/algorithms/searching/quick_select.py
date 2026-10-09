import random
from ...shared.compare import default_compare
from ..sorting.quick_sort import lomuto_partition


def quick_select(input, k, compare=default_compare):
    if k < 0 or k >= len(input):
        raise ValueError(f'k={k} is out of bounds')
    array = list(input)
    low, high = 0, len(array) - 1
    while True:
        pivot_index = random.randrange(low, high + 1)
        array[pivot_index], array[high] = array[high], array[pivot_index]
        position = lomuto_partition(array, low, high, compare)
        if position == k:
            return array[position]
        if position < k:
            low = position + 1
        else:
            high = position - 1


def median(values):
    if not values:
        raise ValueError('Median of an empty array is undefined')
    middle = len(values) // 2
    if len(values) % 2:
        return quick_select(values, middle)
    return (quick_select(values, middle - 1) + quick_select(values, middle)) / 2
