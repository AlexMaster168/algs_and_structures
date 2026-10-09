using Algorithms.DynamicProgramming;
namespace Algorithms.Greedy;

public static partial class Greedy
{
    public static double FractionalKnapsack(IReadOnlyList<KnapsackItem> items, double capacity)
    {
        double value = 0, remaining = capacity;
        foreach (var item in items.OrderByDescending(i => i.Value / i.Weight))
        {
            if (item.Weight <= 0) throw new ArgumentException("Weights must be positive");
            if (remaining <= 0) break; var taken = Math.Min(item.Weight, remaining); value += item.Value / item.Weight * taken; remaining -= taken;
        }
        return value;
    }
}
