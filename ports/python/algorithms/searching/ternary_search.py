def ternary_search_max(f, low, high, epsilon=1e-9):
    if epsilon <= 0:
        raise ValueError('Epsilon must be positive')
    while high - low > epsilon:
        m1 = low + (high - low) / 3
        m2 = high - (high - low) / 3
        if f(m1) < f(m2):
            low = m1
        else:
            high = m2
    return (low + high) / 2


def ternary_search_min(f, low, high, epsilon=1e-9):
    return ternary_search_max(lambda x: -f(x), low, high, epsilon)


def find_peak_index(values):
    low, high = 0, len(values) - 1
    while low < high:
        mid = (low + high) // 2
        if values[mid] < values[mid + 1]:
            low = mid + 1
        else:
            high = mid
    return low
