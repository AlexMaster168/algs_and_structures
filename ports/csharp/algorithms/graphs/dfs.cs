namespace Algorithms.Graphs;
public static partial class GraphAlgorithms
{
    public static int[] Dfs(int[][] graph, int start) { var visited = new bool[graph.Length]; var order = new List<int>(); var stack = new Stack<int>(); stack.Push(start); while (stack.TryPop(out var v)) { if (visited[v]) continue; visited[v] = true; order.Add(v); for (var i = graph[v].Length - 1; i >= 0; i--) if (!visited[graph[v][i]]) stack.Push(graph[v][i]); } return order.ToArray(); }
    public static int[] DfsRecursive(int[][] graph, int start) { var visited = new bool[graph.Length]; var order = new List<int>(); void Visit(int v) { visited[v] = true; order.Add(v); foreach (var n in graph[v]) if (!visited[n]) Visit(n); } Visit(start); return order.ToArray(); }
    public static bool HasPath(int[][] graph, int from, int to) => Dfs(graph, from).Contains(to);
}
