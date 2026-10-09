def tarjan_scc(graph):
    n = len(graph)
    index, low, on_stack, stack, components = [-1] * n, [0] * n, [False] * n, [], []
    counter = 0

    def connect(vertex):
        nonlocal counter
        index[vertex] = low[vertex] = counter
        counter += 1
        stack.append(vertex)
        on_stack[vertex] = True
        for neighbor in graph[vertex]:
            if index[neighbor] == -1:
                connect(neighbor)
                low[vertex] = min(low[vertex], low[neighbor])
            elif on_stack[neighbor]:
                low[vertex] = min(low[vertex], index[neighbor])
        if low[vertex] != index[vertex]:
            return
        component = []
        while True:
            member = stack.pop()
            on_stack[member] = False
            component.append(member)
            if member == vertex:
                break
        components.append(sorted(component))

    for vertex in range(n):
        if index[vertex] == -1:
            connect(vertex)
    return components


def kosaraju_scc(graph):
    n = len(graph)
    reversed_graph, visited, finish_order = [[] for _ in range(n)], [False] * n, []
    for vertex, neighbors in enumerate(graph):
        for neighbor in neighbors:
            reversed_graph[neighbor].append(vertex)

    def fill(vertex):
        visited[vertex] = True
        for neighbor in graph[vertex]:
            if not visited[neighbor]:
                fill(neighbor)
        finish_order.append(vertex)

    def collect(vertex, component):
        visited[vertex] = True
        component.append(vertex)
        for neighbor in reversed_graph[vertex]:
            if not visited[neighbor]:
                collect(neighbor, component)

    for vertex in range(n):
        if not visited[vertex]:
            fill(vertex)
    visited, components = [False] * n, []
    for vertex in reversed(finish_order):
        if visited[vertex]:
            continue
        component = []
        collect(vertex, component)
        components.append(sorted(component))
    return components
