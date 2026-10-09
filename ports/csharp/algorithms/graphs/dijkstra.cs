using Algorithms.DataStructures.Heaps;
namespace Algorithms.Graphs;
public record ShortestPaths(double[] Distance, int[] Parent);
public static partial class GraphAlgorithms
{
    public static ShortestPaths Dijkstra(WeightedEdge[][] graph, int source) { var distance = Enumerable.Repeat(double.PositiveInfinity, graph.Length).ToArray(); var parent = Enumerable.Repeat(-1, graph.Length).ToArray(); var heap = new BinaryHeap<(int V, double Distance)>((a, b) => a.Distance.CompareTo(b.Distance)); distance[source] = 0; heap.Push((source, 0)); while (!heap.IsEmpty()) { var (v, current) = heap.Pop(); if (current > distance[v]) continue; foreach (var e in graph[v]) { if (e.Weight < 0) throw new ArgumentOutOfRangeException(nameof(graph), "Dijkstra does not support negative weights"); var c = current + e.Weight; if (c < distance[e.To]) { distance[e.To] = c; parent[e.To] = v; heap.Push((e.To, c)); } } } return new(distance, parent); }
    public static (double Distance, int[] Path)? DijkstraPath(WeightedEdge[][] graph, int source, int target) { var r = Dijkstra(graph, source); return double.IsPositiveInfinity(r.Distance[target]) ? null : (r.Distance[target], ReconstructPath(r.Parent, target)); }
}
