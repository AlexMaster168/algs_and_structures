namespace Algorithms.Techniques;

public sealed class PrefixSums
{
    private readonly double[] prefix;
    public PrefixSums(IReadOnlyList<double> values) { prefix = new double[values.Count + 1]; for (var i = 0; i < values.Count; i++) prefix[i + 1] = prefix[i] + values[i]; }
    public double Sum(int left, int right) => prefix[right + 1] - prefix[left];
}
public sealed class PrefixSums2D
{
    private readonly double[][] prefix;
    public PrefixSums2D(double[][] matrix)
    {
        var columns = matrix.Length == 0 ? 0 : matrix[0].Length; prefix = Enumerable.Range(0, matrix.Length + 1).Select(_ => new double[columns + 1]).ToArray();
        for (var r = 0; r < matrix.Length; r++) for (var c = 0; c < columns; c++) prefix[r + 1][c + 1] = matrix[r][c] + prefix[r][c + 1] + prefix[r + 1][c] - prefix[r][c];
    }
    public double Sum(int top, int left, int bottom, int right) => prefix[bottom + 1][right + 1] - prefix[top][right + 1] - prefix[bottom + 1][left] + prefix[top][left];
}
public static partial class Techniques
{
    public static int SubarraySumEquals(IReadOnlyList<double> values, double target)
    {
        var seen = new Dictionary<double, int> { [0] = 1 }; double sum = 0; var count = 0;
        foreach (var value in values) { sum += value; count += seen.GetValueOrDefault(sum - target); seen[sum] = seen.GetValueOrDefault(sum) + 1; } return count;
    }
    public static double[] DifferenceArrayApply(int length, IReadOnlyList<(int Left, int Right, double Delta)> updates)
    {
        var diff = new double[length + 1]; foreach (var (left, right, delta) in updates) { diff[left] += delta; diff[right + 1] -= delta; }
        var result = new double[length]; double running = 0; for (var i = 0; i < length; i++) result[i] = running += diff[i]; return result;
    }
    public static double? MajorityElement(IReadOnlyList<double> values)
    {
        double candidate = 0; var count = 0; foreach (var value in values) { if (count == 0) candidate = value; count += value == candidate ? 1 : -1; }
        return values.Count(v => v == candidate) > values.Count / 2 ? candidate : null;
    }
}
