namespace Algorithms.Techniques;

public static partial class Techniques
{
    public static double MaxSumWindow(IReadOnlyList<double> values, int size)
    {
        if (size <= 0 || size > values.Count) throw new ArgumentOutOfRangeException(nameof(size));
        var sum = values.Take(size).Sum(); var best = sum;
        for (var i = size; i < values.Count; i++) { sum += values[i] - values[i - size]; best = Math.Max(best, sum); } return best;
    }
    public static double[] SlidingWindowMaximum(IReadOnlyList<double> values, int size)
    {
        if (size <= 0) throw new ArgumentOutOfRangeException(nameof(size));
        var deque = new LinkedList<int>(); var result = new List<double>();
        for (var i = 0; i < values.Count; i++) { while (deque.First is not null && deque.First.Value <= i - size) deque.RemoveFirst(); while (deque.Last is not null && values[deque.Last.Value] <= values[i]) deque.RemoveLast(); deque.AddLast(i); if (i >= size - 1) result.Add(values[deque.First!.Value]); } return result.ToArray();
    }
    public static string LongestUniqueSubstring(string value)
    {
        var seen = new Dictionary<char, int>(); int start = 0, bestStart = 0, bestLength = 0;
        for (var end = 0; end < value.Length; end++) { if (seen.TryGetValue(value[end], out var previous) && previous >= start) start = previous + 1; seen[value[end]] = end; if (end - start + 1 > bestLength) { bestStart = start; bestLength = end - start + 1; } } return value.Substring(bestStart, bestLength);
    }
    public static string MinWindowSubstring(string value, string required)
    {
        if (required.Length == 0) return "";
        var need = new Dictionary<char, int>(); foreach (var c in required) need[c] = need.GetValueOrDefault(c) + 1;
        int missing = required.Length, left = 0, bestStart = 0, bestLength = int.MaxValue;
        for (var right = 0; right < value.Length; right++)
        {
            var c = value[right]; if (need.GetValueOrDefault(c) > 0) missing--; need[c] = need.GetValueOrDefault(c) - 1;
            while (missing == 0) { if (right - left + 1 < bestLength) { bestStart = left; bestLength = right - left + 1; } c = value[left++]; if (++need[c] > 0) missing++; }
        }
        return bestLength == int.MaxValue ? "" : value.Substring(bestStart, bestLength);
    }
}
