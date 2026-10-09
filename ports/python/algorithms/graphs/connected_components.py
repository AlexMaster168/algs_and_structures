def connected_components(graph):
    visited, components = [False] * len(graph), []
    for start in range(len(graph)):
        if visited[start]:
            continue
        component, stack = [], [start]
        visited[start] = True
        while stack:
            vertex = stack.pop()
            component.append(vertex)
            for neighbor in graph[vertex]:
                if not visited[neighbor]:
                    visited[neighbor] = True
                    stack.append(neighbor)
        components.append(sorted(component))
    return components
