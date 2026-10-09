using System.Collections;
namespace Algorithms.DataStructures.Hashing;
public class OpenAddressingHashMap<K, V> : IEnumerable<(K Key, V Value)>
{
    private sealed class Slot(K key, V value) { internal K Key = key; internal V Value = value; }
    private Slot?[] slots; private byte[] states; private int tombstones; private readonly Func<K, uint> hasher;
    public OpenAddressingHashMap(Func<K, uint>? hasher = null, int initialCapacity = 16) { this.hasher = hasher ?? Hash.DefaultHasher; slots = new Slot?[Math.Max(2, initialCapacity)]; states = new byte[slots.Length]; }
    public int Size { get; private set; }
    private int IndexFor(K key) => (int)(hasher(key) % (uint)slots.Length);
    private int Find(K key) { var i = IndexFor(key); for (var probes = 0; probes < slots.Length; probes++) { if (states[i] == 0) return -1; if (states[i] == 1 && EqualityComparer<K>.Default.Equals(slots[i]!.Key, key)) return i; i = (i + 1) % slots.Length; } return -1; }
    public OpenAddressingHashMap<K, V> Set(K key, V value)
    {
        if ((Size + tombstones + 1) * 2 > slots.Length) { var entries = this.ToArray(); slots = new Slot?[slots.Length * 2]; states = new byte[slots.Length]; Size = tombstones = 0; foreach (var e in entries) Set(e.Key, e.Value); }
        var i = IndexFor(key); var deleted = -1; while (states[i] != 0) { if (states[i] == 2) { if (deleted < 0) deleted = i; } else if (EqualityComparer<K>.Default.Equals(slots[i]!.Key, key)) { slots[i]!.Value = value; return this; } i = (i + 1) % slots.Length; }
        if (deleted >= 0) { i = deleted; tombstones--; } slots[i] = new(key, value); states[i] = 1; Size++; return this;
    }
    public V? Get(K key) { var i = Find(key); return i < 0 ? default : slots[i]!.Value; }
    public bool Has(K key) => Find(key) >= 0;
    public bool Delete(K key) { var i = Find(key); if (i < 0) return false; states[i] = 2; slots[i] = null; Size--; tombstones++; return true; }
    public IEnumerator<(K Key, V Value)> GetEnumerator() { for (var i = 0; i < slots.Length; i++) if (states[i] == 1) yield return (slots[i]!.Key, slots[i]!.Value); }
    IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();
}
