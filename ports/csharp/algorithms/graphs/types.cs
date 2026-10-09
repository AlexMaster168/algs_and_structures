namespace Algorithms.Graphs;
public record WeightedEdge(int To, double Weight);
public record Edge(int From, int To, double Weight);
public static partial class GraphAlgorithms
{
    public static int[] ReconstructPath(IReadOnlyList<int> parent, int target) { var path = new List<int>(); for (var v = target; v != -1; v = parent[v]) path.Add(v); path.Reverse(); return path.ToArray(); }
    public static int[][] ToUndirected(int vertexCount, IReadOnlyList<(int A, int B)> edges) { var graph = Enumerable.Range(0, vertexCount).Select(_ => new List<int>()).ToArray(); foreach (var (a, b) in edges) { graph[a].Add(b); graph[b].Add(a); } return graph.Select(r => r.ToArray()).ToArray(); }
    public static WeightedEdge[][] ToWeightedUndirected(int vertexCount, IReadOnlyList<Edge> edges) { var graph = Enumerable.Range(0, vertexCount).Select(_ => new List<WeightedEdge>()).ToArray(); foreach (var e in edges) { graph[e.From].Add(new(e.To, e.Weight)); graph[e.To].Add(new(e.From, e.Weight)); } return graph.Select(r => r.ToArray()).ToArray(); }
}
