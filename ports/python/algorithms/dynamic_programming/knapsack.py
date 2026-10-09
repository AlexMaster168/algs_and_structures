from dataclasses import dataclass


@dataclass
class KnapsackItem:
    weight: int
    value: float


def _parts(item):
    return (item['weight'], item['value']) if isinstance(item, dict) else (item.weight, item.value)


def knapsack01(items, capacity):
    n = len(items)
    table = [[0] * (capacity + 1) for _ in range(n + 1)]
    for i, item in enumerate(items, 1):
        weight, value = _parts(item)
        for w in range(capacity + 1):
            table[i][w] = table[i - 1][w]
            if weight <= w:
                table[i][w] = max(table[i][w], table[i - 1][w - weight] + value)
    chosen, w = [], capacity
    for i in range(n, 0, -1):
        if table[i][w] != table[i - 1][w]:
            chosen.append(i - 1)
            w -= _parts(items[i - 1])[0]
    return {'value': table[n][capacity], 'items': chosen[::-1]}


def unbounded_knapsack(items, capacity):
    best = [0] * (capacity + 1)
    for w in range(1, capacity + 1):
        for item in items:
            weight, value = _parts(item)
            if weight <= w:
                best[w] = max(best[w], best[w - weight] + value)
    return best[capacity]
