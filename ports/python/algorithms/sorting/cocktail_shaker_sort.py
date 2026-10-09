from ...shared.compare import default_compare


def cocktail_shaker_sort(input, compare=default_compare):
    array = list(input)
    start, end = 0, len(array) - 1
    swapped = True
    while swapped and start < end:
        swapped = False
        for i in range(start, end):
            if compare(array[i], array[i + 1]) > 0:
                array[i], array[i + 1] = array[i + 1], array[i]
                swapped = True
        end -= 1
        if not swapped:
            break
        swapped = False
        for i in range(end - 1, start - 1, -1):
            if compare(array[i], array[i + 1]) > 0:
                array[i], array[i + 1] = array[i + 1], array[i]
                swapped = True
        start += 1
    return array
