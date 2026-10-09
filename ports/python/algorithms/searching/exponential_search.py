from ...shared.compare import default_compare
from .binary_search import binary_search


def exponential_search(sorted, target, compare=default_compare):
    if not sorted:
        return -1
    if compare(sorted[0], target) == 0:
        return 0
    bound = 1
    while bound < len(sorted) and compare(sorted[bound], target) < 0:
        bound *= 2
    return binary_search(sorted, target, compare, bound // 2, min(bound, len(sorted) - 1))
