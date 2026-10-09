from math import inf


def edmonds_karp(capacity, source, sink):
    if source == sink:
        raise ValueError('Source and sink must differ')
    n, residual, flow = len(capacity), [list(row) for row in capacity], 0
    while True:
        parent = [-1] * n
        parent[source], queue, head = source, [source], 0
        while head < len(queue) and parent[sink] == -1:
            vertex = queue[head]
            head += 1
            for next_vertex in range(n):
                if parent[next_vertex] == -1 and residual[vertex][next_vertex] > 0:
                    parent[next_vertex] = vertex
                    queue.append(next_vertex)
        if parent[sink] == -1:
            return flow
        bottleneck, v = inf, sink
        while v != source:
            bottleneck = min(bottleneck, residual[parent[v]][v])
            v = parent[v]
        v = sink
        while v != source:
            residual[parent[v]][v] -= bottleneck
            residual[v][parent[v]] += bottleneck
            v = parent[v]
        flow += bottleneck
