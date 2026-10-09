def eulerian_path_directed(graph):
    n, in_degree, edge_count = len(graph), [0] * len(graph), 0
    for neighbors in graph:
        for neighbor in neighbors:
            in_degree[neighbor] += 1
        edge_count += len(neighbors)
    if edge_count == 0:
        return [0] if n else []
    start = next(v for v, neighbors in enumerate(graph) if neighbors)
    starts = ends = 0
    for vertex in range(n):
        balance = len(graph[vertex]) - in_degree[vertex]
        if balance == 1:
            starts += 1
            start = vertex
        elif balance == -1:
            ends += 1
        elif balance != 0:
            return None
    if (starts, ends) not in ((0, 0), (1, 1)):
        return None
    next_edge, stack, path = [0] * n, [start], []
    while stack:
        vertex = stack[-1]
        if next_edge[vertex] < len(graph[vertex]):
            stack.append(graph[vertex][next_edge[vertex]])
            next_edge[vertex] += 1
        else:
            path.append(stack.pop())
    return path[::-1] if len(path) == edge_count + 1 else None
