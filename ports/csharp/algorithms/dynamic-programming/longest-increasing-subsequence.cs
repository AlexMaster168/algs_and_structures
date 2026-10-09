namespace Algorithms.DynamicProgramming;
public static partial class Dynamic
{
    public static double[] LongestIncreasingSubsequence(IReadOnlyList<double> values) { var tails = new List<int>(); var previous = Enumerable.Repeat(-1, values.Count).ToArray(); for (var i = 0; i < values.Count; i++) { var l = 0; var h = tails.Count; while (l < h) { var m = (l + h) >> 1; if (values[tails[m]] < values[i]) l = m + 1; else h = m; } if (l > 0) previous[i] = tails[l - 1]; if (l == tails.Count) tails.Add(i); else tails[l] = i; } var result = new List<double>(); for (var i = tails.Count == 0 ? -1 : tails[^1]; i != -1; i = previous[i]) result.Add(values[i]); result.Reverse(); return result.ToArray(); }
}
