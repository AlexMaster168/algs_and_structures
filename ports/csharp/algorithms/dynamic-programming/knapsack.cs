namespace Algorithms.DynamicProgramming;
public record KnapsackItem(int Weight, double Value);
public static partial class Dynamic
{
    public static (double Value, int[] Items) Knapsack01(IReadOnlyList<KnapsackItem> items, int capacity)
    {
        var table = new double[items.Count + 1, capacity + 1]; for (var i = 1; i <= items.Count; i++) for (var w = 0; w <= capacity; w++) { table[i, w] = table[i - 1, w]; var item = items[i - 1]; if (item.Weight <= w) table[i, w] = Math.Max(table[i, w], table[i - 1, w - item.Weight] + item.Value); }
        var chosen = new List<int>(); var rest = capacity; for (var i = items.Count; i > 0; i--) if (table[i, rest] != table[i - 1, rest]) { chosen.Add(i - 1); rest -= items[i - 1].Weight; } chosen.Reverse(); return (table[items.Count, capacity], chosen.ToArray());
    }
    public static double UnboundedKnapsack(IReadOnlyList<KnapsackItem> items, int capacity) { var best = new double[capacity + 1]; for (var w = 1; w <= capacity; w++) foreach (var item in items) if (item.Weight <= w) best[w] = Math.Max(best[w], best[w - item.Weight] + item.Value); return best[capacity]; }
}
