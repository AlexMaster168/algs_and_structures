namespace Algorithms.Techniques;

public static partial class Techniques
{
    public static int[]? TwoSumSorted(IReadOnlyList<double> sorted, double target)
    {
        var left = 0; var right = sorted.Count - 1; while (left < right) { var sum = sorted[left] + sorted[right]; if (sum == target) return [left, right]; if (sum < target) left++; else right--; } return null;
    }
    public static int[]? TwoSum(IReadOnlyList<double> values, double target)
    {
        var seen = new Dictionary<double, int>(); for (var i = 0; i < values.Count; i++) { if (seen.TryGetValue(target - values[i], out var j)) return [j, i]; seen[values[i]] = i; } return null;
    }
    public static double[][] ThreeSum(IReadOnlyList<double> values, double target = 0)
    {
        var sorted = values.Order().ToArray(); var result = new List<double[]>();
        for (var i = 0; i < sorted.Length - 2; i++)
        {
            if (i > 0 && sorted[i] == sorted[i - 1]) continue;
            var left = i + 1; var right = sorted.Length - 1;
            while (left < right) { var sum = sorted[i] + sorted[left] + sorted[right]; if (sum < target) left++; else if (sum > target) right--; else { result.Add([sorted[i], sorted[left], sorted[right]]); while (left < right && sorted[left] == sorted[left + 1]) left++; while (left < right && sorted[right] == sorted[right - 1]) right--; left++; right--; } }
        }
        return result.ToArray();
    }
    public static double ContainerWithMostWater(IReadOnlyList<double> heights)
    {
        double best = 0; for (int left = 0, right = heights.Count - 1; left < right;) { best = Math.Max(best, Math.Min(heights[left], heights[right]) * (right - left)); if (heights[left] < heights[right]) left++; else right--; } return best;
    }
    public static int RemoveDuplicatesSorted(List<double> sorted)
    {
        var write = 0; for (var read = 0; read < sorted.Count; read++) if (read == 0 || sorted[read] != sorted[write - 1]) sorted[write++] = sorted[read]; sorted.RemoveRange(write, sorted.Count - write); return write;
    }
    public static double[] DutchNationalFlag(double[] values, double pivot)
    {
        int low = 0, mid = 0, high = values.Length - 1;
        while (mid <= high) { if (values[mid] < pivot) { (values[low], values[mid]) = (values[mid], values[low]); low++; mid++; } else if (values[mid] > pivot) { (values[mid], values[high]) = (values[high], values[mid]); high--; } else mid++; } return values;
    }
    public static bool HasCycleFloyd<T>(T start, Func<T, T?> next) where T : class
    {
        T? slow = start, fast = start; while (fast is not null) { fast = next(fast); if (fast is null) return false; fast = next(fast); slow = next(slow!); if (fast is not null && ReferenceEquals(fast, slow)) return true; } return false;
    }
}
