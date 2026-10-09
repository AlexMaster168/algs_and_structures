class Graph:
    def __init__(self, directed=False):
        self.directed, self.adjacency = directed, {}

    @property
    def vertex_count(self):
        return len(self.adjacency)

    @property
    def edge_count(self):
        return len(self.edges())

    def add_vertex(self, vertex):
        self.adjacency.setdefault(vertex, {})
        return self

    def add_edge(self, from_vertex, to, weight=1):
        self.add_vertex(from_vertex).add_vertex(to)
        self.adjacency[from_vertex][to] = weight
        if not self.directed:
            self.adjacency[to][from_vertex] = weight
        return self

    def remove_edge(self, from_vertex, to):
        if to not in self.adjacency.get(from_vertex, {}):
            return False
        del self.adjacency[from_vertex][to]
        if not self.directed and from_vertex in self.adjacency[to]:
            del self.adjacency[to][from_vertex]
        return True

    def remove_vertex(self, vertex):
        if vertex not in self.adjacency:
            return False
        del self.adjacency[vertex]
        for neighbors in self.adjacency.values():
            neighbors.pop(vertex, None)
        return True

    def has_vertex(self, vertex):
        return vertex in self.adjacency

    def has_edge(self, from_vertex, to):
        return to in self.adjacency.get(from_vertex, {})

    def weight(self, from_vertex, to):
        return self.adjacency.get(from_vertex, {}).get(to)

    def neighbors(self, vertex):
        return list(self.adjacency.get(vertex, {}))

    def degree(self, vertex):
        return len(self.adjacency.get(vertex, {}))

    def vertices(self):
        return list(self.adjacency)

    def edges(self):
        result, seen = [], set()
        for from_vertex, neighbors in self.adjacency.items():
            for to, weight in neighbors.items():
                if not self.directed and to in seen:
                    continue
                result.append({'from': from_vertex, 'to': to, 'weight': weight})
            seen.add(from_vertex)
        return result

    def to_adjacency_matrix(self):
        vertices = self.vertices()
        index = {vertex: i for i, vertex in enumerate(vertices)}
        matrix = [[0] * len(vertices) for _ in vertices]
        for from_vertex, neighbors in self.adjacency.items():
            for to, weight in neighbors.items():
                matrix[index[from_vertex]][index[to]] = weight
        return {'vertices': vertices, 'matrix': matrix}

    def to_adjacency_list(self):
        vertices = self.vertices()
        index = {vertex: i for i, vertex in enumerate(vertices)}
        return {'vertices': vertices, 'list': [[index[neighbor] for neighbor in self.neighbors(vertex)] for vertex in vertices]}
