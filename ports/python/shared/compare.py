from typing import Callable, TypeVar

T = TypeVar('T')
Comparator = Callable[[T, T], int]


def default_compare(a, b):
    return -1 if a < b else 1 if a > b else 0


def reverse_compare(compare=default_compare):
    return lambda a, b: compare(b, a)
