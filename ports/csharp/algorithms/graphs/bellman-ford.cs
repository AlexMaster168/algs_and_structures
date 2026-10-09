namespace Algorithms.Graphs;
public record BellmanFordResult(double[] Distance, int[] Parent, bool HasNegativeCycle);
public static partial class GraphAlgorithms
{
    public static BellmanFordResult BellmanFord(int vertexCount, IReadOnlyList<Edge> edges, int source) { var distance = Enumerable.Repeat(double.PositiveInfinity, vertexCount).ToArray(); var parent = Enumerable.Repeat(-1, vertexCount).ToArray(); distance[source] = 0; for (var i = 0; i < vertexCount - 1; i++) { var changed = false; foreach (var e in edges) if (distance[e.From] + e.Weight < distance[e.To]) { distance[e.To] = distance[e.From] + e.Weight; parent[e.To] = e.From; changed = true; } if (!changed) break; } return new(distance, parent, edges.Any(e => distance[e.From] + e.Weight < distance[e.To])); }
}
