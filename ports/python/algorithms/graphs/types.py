AdjacencyList = list[list[int]]
WeightedAdjacencyList = list[list[dict]]


def reconstruct_path(parent, target):
    path, vertex = [], target
    while vertex != -1:
        path.append(vertex)
        vertex = parent[vertex]
    return path[::-1]


def to_undirected(vertex_count, edges):
    graph = [[] for _ in range(vertex_count)]
    for a, b in edges:
        graph[a].append(b)
        graph[b].append(a)
    return graph


def to_weighted_undirected(vertex_count, edges):
    graph = [[] for _ in range(vertex_count)]
    for edge in edges:
        a, b, weight = edge['from'], edge['to'], edge['weight']
        graph[a].append({'to': b, 'weight': weight})
        graph[b].append({'to': a, 'weight': weight})
    return graph
