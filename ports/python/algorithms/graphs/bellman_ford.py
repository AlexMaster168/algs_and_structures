from math import inf


def bellman_ford(vertex_count, edges, source):
    distance, parent = [inf] * vertex_count, [-1] * vertex_count
    distance[source] = 0
    for _ in range(vertex_count - 1):
        changed = False
        for edge in edges:
            a, b, weight = edge['from'], edge['to'], edge['weight']
            if distance[a] + weight < distance[b]:
                distance[b], parent[b], changed = distance[a] + weight, a, True
        if not changed:
            break
    negative = any(distance[e['from']] + e['weight'] < distance[e['to']] for e in edges)
    return {'distance': distance, 'parent': parent, 'has_negative_cycle': negative}
