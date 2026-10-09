def counting_sort(input):
    if not input:
        return []
    if any(not isinstance(value, int) for value in input):
        raise TypeError('Counting sort works only with integers')
    minimum, maximum = min(input), max(input)
    counts = [0] * (maximum - minimum + 1)
    for value in input:
        counts[value - minimum] += 1
    for i in range(1, len(counts)):
        counts[i] += counts[i - 1]
    output = [0] * len(input)
    for value in reversed(input):
        counts[value - minimum] -= 1
        output[counts[value - minimum]] = value
    return output
