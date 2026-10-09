using System.Collections;
namespace Algorithms.DataStructures.Hashing;
public class HashTable<K, V> : IEnumerable<(K Key, V Value)>
{
    private List<(K Key, V Value)>[] buckets; private readonly Func<K, uint> hasher; private readonly double maxLoadFactor;
    public HashTable(Func<K, uint>? hasher = null, int initialCapacity = 16, double maxLoadFactor = .75) { this.hasher = hasher ?? Hash.DefaultHasher; this.maxLoadFactor = maxLoadFactor; buckets = Create(Math.Max(1, initialCapacity)); }
    private static List<(K, V)>[] Create(int size) => Enumerable.Range(0, size).Select(_ => new List<(K, V)>()).ToArray();
    private List<(K Key, V Value)> Bucket(K key) => buckets[hasher(key) % (uint)buckets.Length];
    public int Size { get; private set; } public int Capacity => buckets.Length;
    public HashTable<K, V> Set(K key, V value) { var b = Bucket(key); var i = b.FindIndex(e => EqualityComparer<K>.Default.Equals(e.Key, key)); if (i >= 0) { b[i] = (key, value); return this; } b.Add((key, value)); Size++; if ((double)Size / Capacity > maxLoadFactor) { var entries = this.ToArray(); buckets = Create(Capacity * 2); foreach (var e in entries) Bucket(e.Key).Add(e); } return this; }
    public V? Get(K key) { foreach (var e in Bucket(key)) if (EqualityComparer<K>.Default.Equals(e.Key, key)) return e.Value; return default; }
    public bool Has(K key) => Bucket(key).Any(e => EqualityComparer<K>.Default.Equals(e.Key, key));
    public bool Delete(K key) { var b = Bucket(key); var i = b.FindIndex(e => EqualityComparer<K>.Default.Equals(e.Key, key)); if (i < 0) return false; b.RemoveAt(i); Size--; return true; }
    public void Clear() { buckets = Create(Capacity); Size = 0; }
    public IEnumerable<K> Keys() { foreach (var e in this) yield return e.Key; }
    public IEnumerable<V> Values() { foreach (var e in this) yield return e.Value; }
    public IEnumerator<(K Key, V Value)> GetEnumerator() { foreach (var b in buckets) foreach (var e in b) yield return e; }
    IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();
}
