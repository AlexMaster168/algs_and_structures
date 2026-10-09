namespace Algorithms.Graphs;
public record FloydWarshallResult(double[][] Distance, int[][] Next, bool HasNegativeCycle);
public static partial class GraphAlgorithms
{
    public static FloydWarshallResult FloydWarshall(double[][] weights) { var n = weights.Length; var distance = weights.Select(r => r.ToArray()).ToArray(); var next = weights.Select((r, i) => r.Select((w, j) => i == j || !double.IsPositiveInfinity(w) ? j : -1).ToArray()).ToArray(); for (var i = 0; i < n; i++) if (distance[i][i] > 0) distance[i][i] = 0; for (var k = 0; k < n; k++) for (var i = 0; i < n; i++) { if (double.IsPositiveInfinity(distance[i][k])) continue; for (var j = 0; j < n; j++) { var c = distance[i][k] + distance[k][j]; if (c < distance[i][j]) { distance[i][j] = c; next[i][j] = next[i][k]; } } } return new(distance, next, distance.Where((r, i) => r[i] < 0).Any()); }
    public static int[]? FloydWarshallPath(int[][] next, int from, int to) { if (next[from][to] == -1) return null; var path = new List<int> { from }; while (from != to) { from = next[from][to]; path.Add(from); if (path.Count > next.Length + 1) throw new InvalidOperationException("Path contains a negative cycle"); } return path.ToArray(); }
}
