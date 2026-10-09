from math import inf


def floyd_warshall(weights):
    n, distance = len(weights), [list(row) for row in weights]
    next_vertex = [[j if i == j or weight != inf else -1 for j, weight in enumerate(row)] for i, row in enumerate(weights)]
    for i in range(n):
        if distance[i][i] > 0:
            distance[i][i] = 0
    for k in range(n):
        for i in range(n):
            if distance[i][k] == inf:
                continue
            for j in range(n):
                candidate = distance[i][k] + distance[k][j]
                if candidate < distance[i][j]:
                    distance[i][j], next_vertex[i][j] = candidate, next_vertex[i][k]
    return {'distance': distance, 'next': next_vertex, 'has_negative_cycle': any(distance[i][i] < 0 for i in range(n))}


def floyd_warshall_path(next, from_vertex, to):
    if next[from_vertex][to] == -1:
        return None
    path = [from_vertex]
    while from_vertex != to:
        from_vertex = next[from_vertex][to]
        path.append(from_vertex)
        if len(path) > len(next) + 1:
            raise ValueError('Path contains a cycle')
    return path
