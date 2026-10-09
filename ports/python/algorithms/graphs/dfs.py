def dfs(graph, start):
    visited, order, stack = [False] * len(graph), [], [start]
    while stack:
        vertex = stack.pop()
        if visited[vertex]:
            continue
        visited[vertex] = True
        order.append(vertex)
        for neighbor in reversed(graph[vertex]):
            if not visited[neighbor]:
                stack.append(neighbor)
    return order


def dfs_recursive(graph, start):
    visited, order = [False] * len(graph), []

    def visit(vertex):
        visited[vertex] = True
        order.append(vertex)
        for neighbor in graph[vertex]:
            if not visited[neighbor]:
                visit(neighbor)

    visit(start)
    return order


def has_path(graph, from_vertex, to):
    return to in dfs(graph, from_vertex)
