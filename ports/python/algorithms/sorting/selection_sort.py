from ...shared.compare import default_compare


def selection_sort(input, compare=default_compare):
    array = list(input)
    for i in range(len(array) - 1):
        minimum = i
        for j in range(i + 1, len(array)):
            if compare(array[j], array[minimum]) < 0:
                minimum = j
        array[i], array[minimum] = array[minimum], array[i]
    return array
