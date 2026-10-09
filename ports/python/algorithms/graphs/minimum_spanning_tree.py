from ...data_structures.graphs.disjoint_set import DisjointSet
from ...data_structures.heaps.binary_heap import BinaryHeap


def kruskal(vertex_count, edges):
    sets, result, weight = DisjointSet(vertex_count), [], 0
    for edge in sorted(edges, key=lambda e: e['weight']):
        if not sets.union(edge['from'], edge['to']):
            continue
        result.append(edge)
        weight += edge['weight']
        if len(result) == vertex_count - 1:
            break
    return {'weight': weight, 'edges': result}


def prim(graph, start=0):
    if not graph:
        return {'weight': 0, 'edges': []}
    visited, heap, result, weight = [False] * len(graph), BinaryHeap(lambda a, b: a['weight'] - b['weight']), [], 0

    def visit(vertex):
        visited[vertex] = True
        for edge in graph[vertex]:
            if not visited[edge['to']]:
                heap.push({'from': vertex, 'to': edge['to'], 'weight': edge['weight']})

    visit(start)
    while not heap.is_empty() and len(result) < len(graph) - 1:
        edge = heap.pop()
        if visited[edge['to']]:
            continue
        result.append(edge)
        weight += edge['weight']
        visit(edge['to'])
    return {'weight': weight, 'edges': result}
