namespace Algorithms.Sorting;
public static partial class Sort
{
    public static int[] CountingSort(IReadOnlyList<int> input)
    {
        if (input.Count == 0) return []; var min = input[0]; var max = min;
        foreach (var v in input) { min = Math.Min(min, v); max = Math.Max(max, v); }
        var counts = new int[checked(max - min + 1)]; foreach (var v in input) counts[v - min]++;
        for (var i = 1; i < counts.Length; i++) counts[i] += counts[i - 1];
        var output = new int[input.Count]; for (var i = input.Count - 1; i >= 0; i--) output[--counts[input[i] - min]] = input[i]; return output;
    }
}
