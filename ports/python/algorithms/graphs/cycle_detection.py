from ...data_structures.graphs.disjoint_set import DisjointSet
from .topological_sort import topological_sort_kahn


def has_cycle_directed(graph):
    return topological_sort_kahn(graph) is None


def has_cycle_undirected(vertex_count, edges):
    sets = DisjointSet(vertex_count)
    return any(not sets.union(a, b) for a, b in edges)
