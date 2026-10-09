from ...shared.compare import default_compare


def insertion_sort_range(array, left, right, compare):
    for i in range(left + 1, right + 1):
        current = array[i]
        j = i - 1
        while j >= left and compare(array[j], current) > 0:
            array[j + 1] = array[j]
            j -= 1
        array[j + 1] = current


def insertion_sort(input, compare=default_compare):
    array = list(input)
    insertion_sort_range(array, 0, len(array) - 1, compare)
    return array
