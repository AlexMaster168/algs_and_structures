from ...shared.compare import default_compare


def _sift_down(array, start, end, compare):
    root = start
    while True:
        left = 2 * root + 1
        right = left + 1
        largest = root
        if left < end and compare(array[left], array[largest]) > 0:
            largest = left
        if right < end and compare(array[right], array[largest]) > 0:
            largest = right
        if largest == root:
            return
        array[root], array[largest] = array[largest], array[root]
        root = largest


def heap_sort(input, compare=default_compare):
    array = list(input)
    for i in range(len(array) // 2 - 1, -1, -1):
        _sift_down(array, i, len(array), compare)
    for end in range(len(array) - 1, 0, -1):
        array[0], array[end] = array[end], array[0]
        _sift_down(array, 0, end, compare)
    return array
