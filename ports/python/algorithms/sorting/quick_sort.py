import random
from ...shared.compare import default_compare


def partition3(array, low, high, compare):
    pivot = array[random.randrange(low, high + 1)]
    lt, gt, i = low, high, low
    while i <= gt:
        order = compare(array[i], pivot)
        if order < 0:
            array[lt], array[i] = array[i], array[lt]
            lt += 1
            i += 1
        elif order > 0:
            array[i], array[gt] = array[gt], array[i]
            gt -= 1
        else:
            i += 1
    return lt, gt


def quick_sort(input, compare=default_compare):
    array = list(input)
    stack = [(0, len(array) - 1)]
    while stack:
        low, high = stack.pop()
        if low >= high:
            continue
        lt, gt = partition3(array, low, high, compare)
        stack.extend(((low, lt - 1), (gt + 1, high)))
    return array


def lomuto_partition(array, low, high, compare):
    pivot = array[high]
    boundary = low
    for i in range(low, high):
        if compare(array[i], pivot) < 0:
            array[i], array[boundary] = array[boundary], array[i]
            boundary += 1
    array[boundary], array[high] = array[high], array[boundary]
    return boundary


def quick_sort_functional(input, compare=default_compare):
    if len(input) <= 1:
        return list(input)
    pivot = input[0]
    less = [value for value in input[1:] if compare(value, pivot) < 0]
    greater = [value for value in input[1:] if compare(value, pivot) >= 0]
    return quick_sort_functional(less, compare) + [pivot] + quick_sort_functional(greater, compare)
