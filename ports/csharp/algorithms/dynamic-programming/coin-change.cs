namespace Algorithms.DynamicProgramming;
public static partial class Dynamic
{
    public static (int Count, int[] Coins)? MinCoins(IReadOnlyList<int> coins, int amount)
    {
        var best = Enumerable.Repeat(int.MaxValue / 2, amount + 1).ToArray(); var last = new int[amount + 1]; best[0] = 0;
        for (var sum = 1; sum <= amount; sum++) foreach (var coin in coins) if (coin <= sum && best[sum - coin] + 1 < best[sum]) { best[sum] = best[sum - coin] + 1; last[sum] = coin; }
        if (best[amount] == int.MaxValue / 2) return null; var used = new List<int>(); for (var sum = amount; sum > 0; sum -= last[sum]) used.Add(last[sum]); return (best[amount], used.ToArray());
    }
    public static double CoinChangeWays(IReadOnlyList<int> coins, int amount) { var ways = new double[amount + 1]; ways[0] = 1; foreach (var coin in coins) for (var sum = coin; sum <= amount; sum++) ways[sum] += ways[sum - coin]; return ways[amount]; }
}
