def topological_sort_kahn(graph):
    in_degree = [0] * len(graph)
    for neighbors in graph:
        for neighbor in neighbors:
            in_degree[neighbor] += 1
    queue = [vertex for vertex, degree in enumerate(in_degree) if degree == 0]
    order, head = [], 0
    while head < len(queue):
        vertex = queue[head]
        head += 1
        order.append(vertex)
        for neighbor in graph[vertex]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
    return order if len(order) == len(graph) else None


def topological_sort_dfs(graph):
    state, order = [0] * len(graph), []

    def visit(vertex):
        state[vertex] = 1
        for neighbor in graph[vertex]:
            if state[neighbor] == 1 or state[neighbor] == 0 and not visit(neighbor):
                return False
        state[vertex] = 2
        order.append(vertex)
        return True

    for vertex in range(len(graph)):
        if state[vertex] == 0 and not visit(vertex):
            return None
    return order[::-1]
