namespace Algorithms.Sorting;
public static partial class Sort
{
    public static int[] RadixSort(IReadOnlyList<int> input, int radix = 10)
    {
        if (radix < 2) throw new ArgumentOutOfRangeException(nameof(radix));
        long[] NonNegative(long[] a)
        {
            var max = a.Length == 0 ? 0 : a.Max();
            for (long exponent = 1; max / exponent > 0; exponent *= radix)
            {
                var buckets = Enumerable.Range(0, radix).Select(_ => new List<long>()).ToArray();
                foreach (var v in a) buckets[v / exponent % radix].Add(v); a = buckets.SelectMany(b => b).ToArray();
                if (exponent > max / radix) break;
            }
            return a;
        }
        return NonNegative(input.Where(v => v < 0).Select(v => -(long)v).ToArray()).Reverse().Select(v => (int)-v)
            .Concat(NonNegative(input.Where(v => v >= 0).Select(v => (long)v).ToArray()).Select(v => (int)v)).ToArray();
    }
}
