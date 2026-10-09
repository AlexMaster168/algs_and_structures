def find_bridges_and_articulation_points(graph):
    n = len(graph)
    entry, low, articulation, bridges = [-1] * n, [0] * n, [False] * n, []
    timer = 0

    def visit(vertex, parent):
        nonlocal timer
        entry[vertex] = low[vertex] = timer
        timer += 1
        children, skipped_parent = 0, False
        for neighbor in graph[vertex]:
            if neighbor == parent and not skipped_parent:
                skipped_parent = True
                continue
            if entry[neighbor] != -1:
                low[vertex] = min(low[vertex], entry[neighbor])
                continue
            visit(neighbor, vertex)
            children += 1
            low[vertex] = min(low[vertex], low[neighbor])
            if low[neighbor] > entry[vertex]:
                bridges.append([min(vertex, neighbor), max(vertex, neighbor)])
            if parent != -1 and low[neighbor] >= entry[vertex]:
                articulation[vertex] = True
        if parent == -1 and children > 1:
            articulation[vertex] = True

    for vertex in range(n):
        if entry[vertex] == -1:
            visit(vertex, -1)
    return {'bridges': sorted(bridges), 'articulation_points': [v for v, flag in enumerate(articulation) if flag]}
