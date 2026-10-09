namespace Algorithms.DynamicProgramming;
public static partial class Dynamic
{
    public static int[]? SubsetSum(IReadOnlyList<int> values, int target) { var reached = Enumerable.Repeat(-1, target + 1).ToArray(); var reachable = new bool[target + 1]; reachable[0] = true; for (var i = 0; i < values.Count; i++) for (var sum = target; sum >= values[i]; sum--) if (!reachable[sum] && reachable[sum - values[i]]) { reachable[sum] = true; reached[sum] = i; } if (!reachable[target]) return null; var chosen = new List<int>(); for (var sum = target; sum > 0; sum -= values[reached[sum]]) chosen.Add(values[reached[sum]]); chosen.Reverse(); return chosen.ToArray(); }
    public static bool CanPartition(IReadOnlyList<int> values) { var total = values.Sum(); return total % 2 == 0 && SubsetSum(values, total / 2) is not null; }
}
