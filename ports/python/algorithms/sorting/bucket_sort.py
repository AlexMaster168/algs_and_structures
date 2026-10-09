from math import sqrt, floor
from .insertion_sort import insertion_sort


def bucket_sort(input, bucket_count=None):
    if len(input) <= 1:
        return list(input)
    bucket_count = max(1, floor(sqrt(len(input)) + 0.5)) if bucket_count is None else bucket_count
    if bucket_count <= 0:
        raise ValueError('Bucket count must be positive')
    minimum, maximum = min(input), max(input)
    if minimum == maximum:
        return list(input)
    buckets = [[] for _ in range(bucket_count)]
    width = (maximum - minimum) / bucket_count
    for value in input:
        buckets[min(bucket_count - 1, floor((value - minimum) / width))].append(value)
    return [value for bucket in buckets for value in insertion_sort(bucket)]
