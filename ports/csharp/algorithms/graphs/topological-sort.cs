namespace Algorithms.Graphs;
public static partial class GraphAlgorithms
{
    public static int[]? TopologicalSortKahn(int[][] graph) { var degree = new int[graph.Length]; foreach (var neighbors in graph) foreach (var n in neighbors) degree[n]++; var queue = Enumerable.Range(0, graph.Length).Where(v => degree[v] == 0).ToList(); var order = new List<int>(); for (var h = 0; h < queue.Count; h++) { var v = queue[h]; order.Add(v); foreach (var n in graph[v]) if (--degree[n] == 0) queue.Add(n); } return order.Count == graph.Length ? order.ToArray() : null; }
    public static int[]? TopologicalSortDfs(int[][] graph) { var state = new int[graph.Length]; var order = new List<int>(); bool Visit(int v) { state[v] = 1; foreach (var n in graph[v]) { if (state[n] == 1) return false; if (state[n] == 0 && !Visit(n)) return false; } state[v] = 2; order.Add(v); return true; } for (var v = 0; v < graph.Length; v++) if (state[v] == 0 && !Visit(v)) return null; order.Reverse(); return order.ToArray(); }
}
