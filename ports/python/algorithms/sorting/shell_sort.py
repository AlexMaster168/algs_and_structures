from ...shared.compare import default_compare


def shell_sort(input, compare=default_compare):
    array = list(input)
    gap = 1
    while gap < len(array) / 3:
        gap = gap * 3 + 1
    while gap >= 1:
        for i in range(gap, len(array)):
            current = array[i]
            j = i
            while j >= gap and compare(array[j - gap], current) > 0:
                array[j] = array[j - gap]
                j -= gap
            array[j] = current
        gap = (gap - 1) // 3
    return array
