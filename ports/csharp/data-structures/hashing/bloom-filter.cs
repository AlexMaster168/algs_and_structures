namespace Algorithms.DataStructures.Hashing;
public class BloomFilter
{
    private readonly byte[] bits; public int BitCount { get; } public int HashCount { get; }
    public BloomFilter(int expectedItems, double falsePositiveRate = .01) { BitCount = Math.Max(8, (int)Math.Ceiling(-expectedItems * Math.Log(falsePositiveRate) / Math.Pow(Math.Log(2), 2))); HashCount = Math.Max(1, (int)Math.Floor((double)BitCount / expectedItems * Math.Log(2) + .5)); bits = new byte[(BitCount + 7) / 8]; }
    private IEnumerable<int> Positions(string item) { var h1 = Hash.Fnv1a(item); var h2 = Hash.Fnv1a(item, 0x5bd1e995) | 1u; for (var i = 0; i < HashCount; i++) yield return (int)((h1 + (ulong)i * h2) % (ulong)BitCount); }
    public BloomFilter Add(string item) { foreach (var p in Positions(item)) bits[p >> 3] |= (byte)(1 << (p & 7)); return this; }
    public bool MightContain(string item) { foreach (var p in Positions(item)) if ((bits[p >> 3] & (1 << (p & 7))) == 0) return false; return true; }
}
