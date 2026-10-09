namespace Algorithms.DynamicProgramming;
public static partial class Dynamic
{
    public static (double Revenue, int[] Pieces) RodCutting(IReadOnlyList<double> prices, int length) { var revenue = new double[length + 1]; var cut = new int[length + 1]; for (var total = 1; total <= length; total++) for (var piece = 1; piece <= Math.Min(total, prices.Count); piece++) { var c = prices[piece - 1] + revenue[total - piece]; if (c > revenue[total]) { revenue[total] = c; cut[total] = piece; } } var pieces = new List<int>(); for (var rest = length; rest > 0 && cut[rest] > 0; rest -= cut[rest]) pieces.Add(cut[rest]); return (revenue[length], pieces.ToArray()); }
}
