from ...shared.compare import default_compare


def bubble_sort(input, compare=default_compare):
    array = list(input)
    for end in range(len(array) - 1, 0, -1):
        swapped = False
        for i in range(end):
            if compare(array[i], array[i + 1]) > 0:
                array[i], array[i + 1] = array[i + 1], array[i]
                swapped = True
        if not swapped:
            break
    return array
