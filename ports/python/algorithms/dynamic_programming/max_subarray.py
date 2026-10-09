def max_subarray(values):
    if not values:
        raise ValueError('Array must not be empty')
    best = {'sum': values[0], 'start': 0, 'end': 0}
    current_sum, current_start = values[0], 0
    for i in range(1, len(values)):
        if current_sum < 0:
            current_sum, current_start = values[i], i
        else:
            current_sum += values[i]
        if current_sum > best['sum']:
            best = {'sum': current_sum, 'start': current_start, 'end': i}
    return best
