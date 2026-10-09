namespace Algorithms.DynamicProgramming;
public static partial class Dynamic
{
    public static double UniquePaths(int rows, int cols, bool[][]? blocked = null) { var ways = new double[cols]; if (cols == 0) return 0; ways[0] = 1; for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++) { if (blocked is not null && r < blocked.Length && c < blocked[r].Length && blocked[r][c]) ways[c] = 0; else if (c > 0) ways[c] += ways[c - 1]; } return ways[^1]; }
    public static double MinPathSum(double[][] grid) { var cols = grid.Length == 0 ? 0 : grid[0].Length; if (cols == 0) return double.NaN; var best = Enumerable.Repeat(double.PositiveInfinity, cols).ToArray(); best[0] = 0; foreach (var row in grid) for (var c = 0; c < cols; c++) best[c] = row[c] + Math.Min(best[c], c > 0 ? best[c - 1] : double.PositiveInfinity); return best[^1]; }
}
