namespace Algorithms.DynamicProgramming;
public static partial class Dynamic
{
    public static (double Cost, string Order) MatrixChainOrder(IReadOnlyList<double> dimensions) { var n = dimensions.Count - 1; if (n < 1) return (0, ""); var cost = new double[n, n]; var split = new int[n, n]; for (var length = 2; length <= n; length++) for (var i = 0; i + length - 1 < n; i++) { var j = i + length - 1; cost[i, j] = double.PositiveInfinity; for (var k = i; k < j; k++) { var c = cost[i, k] + cost[k + 1, j] + dimensions[i] * dimensions[k + 1] * dimensions[j + 1]; if (c < cost[i, j]) { cost[i, j] = c; split[i, j] = k; } } } string Render(int i, int j) => i == j ? $"A{i + 1}" : $"({Render(i, split[i, j])}{Render(split[i, j] + 1, j)})"; return (cost[0, n - 1], Render(0, n - 1)); }
}
