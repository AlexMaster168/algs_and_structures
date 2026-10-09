def bipartite_coloring(graph):
    colors = [-1] * len(graph)
    for start in range(len(graph)):
        if colors[start] != -1:
            continue
        colors[start], queue, head = 0, [start], 0
        while head < len(queue):
            vertex = queue[head]
            head += 1
            for neighbor in graph[vertex]:
                if colors[neighbor] == -1:
                    colors[neighbor] = 1 - colors[vertex]
                    queue.append(neighbor)
                elif colors[neighbor] == colors[vertex]:
                    return None
    return colors


def is_bipartite(graph):
    return bipartite_coloring(graph) is not None
