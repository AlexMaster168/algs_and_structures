def subset_sum(values, target):
    reached_by, reachable = [-1] * (target + 1), [False] * (target + 1)
    reachable[0] = True
    for index, value in enumerate(values):
        for total in range(target, value - 1, -1):
            if not reachable[total] and reachable[total - value]:
                reachable[total], reached_by[total] = True, index
    if not reachable[target]:
        return None
    chosen, total = [], target
    while total > 0:
        value = values[reached_by[total]]
        chosen.append(value)
        total -= value
    return chosen[::-1]


def can_partition(values):
    total = sum(values)
    return total % 2 == 0 and subset_sum(values, total // 2) is not None
