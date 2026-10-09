using Algorithms.DataStructures.Graphs;
using Algorithms.DataStructures.Heaps;
using Algorithms.Sorting;
namespace Algorithms.Graphs;
public record SpanningTree(double Weight, Edge[] Edges);
public static partial class GraphAlgorithms
{
    public static SpanningTree Kruskal(int vertexCount, IReadOnlyList<Edge> edges) { var sets = new DisjointSet(vertexCount); var result = new List<Edge>(); var weight = 0d; foreach (var e in Sort.MergeSort(edges, (a, b) => a.Weight.CompareTo(b.Weight))) { if (!sets.Union(e.From, e.To)) continue; result.Add(e); weight += e.Weight; if (result.Count == vertexCount - 1) break; } return new(weight, result.ToArray()); }
    public static SpanningTree Prim(WeightedEdge[][] graph, int start = 0) { var visited = new bool[graph.Length]; var heap = new BinaryHeap<Edge>((a, b) => a.Weight.CompareTo(b.Weight)); var result = new List<Edge>(); var weight = 0d; void Visit(int v) { visited[v] = true; foreach (var e in graph[v]) if (!visited[e.To]) heap.Push(new Edge(v, e.To, e.Weight)); } Visit(start); while (!heap.IsEmpty() && result.Count < graph.Length - 1) { var e = heap.Pop()!; if (visited[e.To]) continue; result.Add(e); weight += e.Weight; Visit(e.To); } return new(weight, result.ToArray()); }
}
