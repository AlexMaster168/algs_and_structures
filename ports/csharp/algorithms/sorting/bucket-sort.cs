namespace Algorithms.Sorting;
public static partial class Sort
{
    public static double[] BucketSort(IReadOnlyList<double> input, int? bucketCount = null)
    {
        if (input.Count <= 1) return input.ToArray(); var count = bucketCount ?? Math.Max(1, (int)Math.Floor(Math.Sqrt(input.Count) + .5));
        if (count < 1) throw new ArgumentOutOfRangeException(nameof(bucketCount)); var min = input.Min(); var max = input.Max(); if (min == max) return input.ToArray();
        var buckets = Enumerable.Range(0, count).Select(_ => new List<double>()).ToArray(); var range = (max - min) / count;
        foreach (var v in input) buckets[Math.Min(count - 1, (int)Math.Floor((v - min) / range))].Add(v);
        return buckets.SelectMany(b => InsertionSort(b)).ToArray();
    }
}
