namespace Algorithms.Greedy;

public static partial class Greedy
{
    public static bool CanReachEnd(IReadOnlyList<int> jumps) { var farthest = 0; for (var i = 0; i < jumps.Count; i++) { if (i > farthest) return false; farthest = Math.Max(farthest, i + jumps[i]); } return true; }
    public static int MinJumps(IReadOnlyList<int> jumps)
    {
        int count = 0, currentEnd = 0, farthest = 0;
        for (var i = 0; i < jumps.Count - 1; i++) { farthest = Math.Max(farthest, i + jumps[i]); if (i == currentEnd) { if (farthest <= i) return -1; count++; currentEnd = farthest; } } return count;
    }
    public static int[] GreedyChange(int amount, IReadOnlyList<int> denominations)
    {
        if (denominations.Any(c => c <= 0)) throw new ArgumentException("Coins must be positive");
        var result = new List<int>(); foreach (var coin in denominations.OrderDescending()) while (amount >= coin) { result.Add(coin); amount -= coin; } return result.ToArray();
    }
}
