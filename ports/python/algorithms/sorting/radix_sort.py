def _sort_non_negative(input, base):
    array = list(input)
    maximum = max(array, default=0)
    exponent = 1
    while maximum // exponent > 0:
        buckets = [[] for _ in range(base)]
        for value in array:
            buckets[value // exponent % base].append(value)
        array = [value for bucket in buckets for value in bucket]
        exponent *= base
    return array


def radix_sort(input, base=10):
    if any(not isinstance(value, int) for value in input):
        raise TypeError('Radix sort works only with integers')
    if not isinstance(base, int) or base < 2:
        raise ValueError('Base must be an integer greater than one')
    negatives = _sort_non_negative([-v for v in input if v < 0], base)
    positives = _sort_non_negative([v for v in input if v >= 0], base)
    return [-v for v in reversed(negatives)] + positives
