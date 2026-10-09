namespace Algorithms.Graphs;
public record BfsResult(int[] Order, int[] Distance, int[] Parent);
public static partial class GraphAlgorithms
{
    public static BfsResult Bfs(int[][] graph, int start) { var distance = Enumerable.Repeat(-1, graph.Length).ToArray(); var parent = Enumerable.Repeat(-1, graph.Length).ToArray(); var order = new List<int>(); var queue = new DataStructures.Linear.Queue<int>().Enqueue(start); distance[start] = 0; while (!queue.IsEmpty()) { var v = queue.Dequeue(); order.Add(v); foreach (var n in graph[v]) { if (distance[n] != -1) continue; distance[n] = distance[v] + 1; parent[n] = v; queue.Enqueue(n); } } return new(order.ToArray(), distance, parent); }
    public static int[]? ShortestPathUnweighted(int[][] graph, int start, int target) { var result = Bfs(graph, start); return result.Distance[target] == -1 ? null : ReconstructPath(result.Parent, target); }
    public static int GridShortestPath(IReadOnlyList<string> grid, (int Row, int Col) start, (int Row, int Col) target, char wall = '#') { var rows = grid.Count; var cols = rows == 0 ? 0 : grid[0].Length; var distance = Enumerable.Range(0, rows).Select(_ => Enumerable.Repeat(-1, cols).ToArray()).ToArray(); var queue = new DataStructures.Linear.Queue<(int, int)>().Enqueue(start); distance[start.Row][start.Col] = 0; while (!queue.IsEmpty()) { var (row, col) = queue.Dequeue(); if ((row, col) == target) return distance[row][col]; foreach (var (dr, dc) in Directions) { var r = row + dr; var c = col + dc; if (r < 0 || c < 0 || r >= rows || c >= cols || grid[r][c] == wall || distance[r][c] != -1) continue; distance[r][c] = distance[row][col] + 1; queue.Enqueue((r, c)); } } return -1; }
    private static readonly (int, int)[] Directions = [(1, 0), (-1, 0), (0, 1), (0, -1)];
}
