def can_reach_end(jumps):
    farthest = 0
    for i, length in enumerate(jumps):
        if i > farthest:
            return False
        farthest = max(farthest, i + length)
    return True


def min_jumps(jumps):
    count = current_end = farthest = 0
    for i in range(len(jumps) - 1):
        farthest = max(farthest, i + jumps[i])
        if i == current_end:
            if farthest <= i:
                return -1
            count += 1
            current_end = farthest
    return count


def greedy_change(amount, denominations):
    if any(coin <= 0 for coin in denominations):
        raise ValueError('Denominations must be positive')
    result = []
    for coin in sorted(denominations, reverse=True):
        while amount >= coin:
            result.append(coin)
            amount -= coin
    return result
