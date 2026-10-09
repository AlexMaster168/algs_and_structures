namespace Algorithms.Graphs;
public static partial class GraphAlgorithms
{
    public static int[]? BipartiteColoring(int[][] graph) { var colors = Enumerable.Repeat(-1, graph.Length).ToArray(); for (var start = 0; start < graph.Length; start++) { if (colors[start] != -1) continue; colors[start] = 0; var queue = new List<int> { start }; for (var h = 0; h < queue.Count; h++) { var v = queue[h]; foreach (var n in graph[v]) { if (colors[n] == -1) { colors[n] = 1 - colors[v]; queue.Add(n); } else if (colors[n] == colors[v]) return null; } } } return colors; }
    public static bool IsBipartite(int[][] graph) => BipartiteColoring(graph) is not null;
}
