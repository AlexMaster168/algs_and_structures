from math import inf


def matrix_chain_order(dimensions):
    n = len(dimensions) - 1
    if n < 1:
        return {'cost': 0, 'order': ''}
    cost = [[0] * n for _ in range(n)]
    split = [[0] * n for _ in range(n)]
    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            cost[i][j] = inf
            for k in range(i, j):
                candidate = cost[i][k] + cost[k + 1][j] + dimensions[i] * dimensions[k + 1] * dimensions[j + 1]
                if candidate < cost[i][j]:
                    cost[i][j], split[i][j] = candidate, k

    def render(i, j):
        return f'A{i + 1}' if i == j else f'({render(i, split[i][j])}{render(split[i][j] + 1, j)})'

    return {'cost': cost[0][-1], 'order': render(0, n - 1)}
