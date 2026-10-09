from math import inf
from ...data_structures.heaps.binary_heap import BinaryHeap
from .types import reconstruct_path


def dijkstra(graph, source):
    distance, parent = [inf] * len(graph), [-1] * len(graph)
    heap = BinaryHeap(lambda a, b: a[1] - b[1])
    distance[source] = 0
    heap.push((source, 0))
    while not heap.is_empty():
        vertex, current = heap.pop()
        if current > distance[vertex]:
            continue
        for edge in graph[vertex]:
            to, weight = edge['to'], edge['weight']
            if weight < 0:
                raise ValueError('Dijkstra does not support negative weights')
            candidate = current + weight
            if candidate < distance[to]:
                distance[to], parent[to] = candidate, vertex
                heap.push((to, candidate))
    return {'distance': distance, 'parent': parent}


def dijkstra_path(graph, source, target):
    result = dijkstra(graph, source)
    if result['distance'][target] == inf:
        return None
    return {'distance': result['distance'][target], 'path': reconstruct_path(result['parent'], target)}
