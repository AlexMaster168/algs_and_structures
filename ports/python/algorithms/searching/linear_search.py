def linear_search(array, target):
    for i, value in enumerate(array):
        if value == target:
            return i
    return -1


def linear_search_all(array, predicate):
    return [i for i, value in enumerate(array) if predicate(value, i)]
