namespace Algorithms.DynamicProgramming;
public static partial class Dynamic
{
    public static (double Sum, int Start, int End) MaxSubarray(IReadOnlyList<double> values) { if (values.Count == 0) throw new ArgumentException("Array must not be empty"); var best = (Sum: values[0], Start: 0, End: 0); var sum = values[0]; var start = 0; for (var i = 1; i < values.Count; i++) { if (sum < 0) { sum = values[i]; start = i; } else sum += values[i]; if (sum > best.Sum) best = (sum, start, i); } return best; }
}
