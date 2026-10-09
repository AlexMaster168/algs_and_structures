using Algorithms.DataStructures.Graphs;
namespace Algorithms.Graphs;
public static partial class GraphAlgorithms
{
    public static bool HasCycleDirected(int[][] graph) => TopologicalSortKahn(graph) is null;
    public static bool HasCycleUndirected(int vertexCount, IReadOnlyList<(int A, int B)> edges) { var sets = new DisjointSet(vertexCount); foreach (var (a, b) in edges) if (!sets.Union(a, b)) return true; return false; }
}
