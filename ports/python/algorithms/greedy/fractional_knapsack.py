def fractional_knapsack(items, capacity):
    if any(item['weight'] <= 0 for item in items) or capacity < 0:
        raise ValueError('Weights must be positive and capacity nonnegative')
    total = 0
    for item in sorted(items, key=lambda item: item['value'] / item['weight'], reverse=True):
        amount = min(capacity, item['weight'])
        total += amount * item['value'] / item['weight']
        capacity -= amount
        if capacity == 0:
            break
    return total
