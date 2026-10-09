using Algorithms.DataStructures.Linear;
namespace Algorithms.DataStructures.Hashing;
public class LRUCache<K, V> where K : notnull
{
    private readonly Dictionary<K, DoublyLinkedListNode<(K Key, V Value)>> nodes = []; private readonly DoublyLinkedList<(K Key, V Value)> order = new();
    public int Capacity { get; } public int Size => nodes.Count;
    public LRUCache(int capacity) { if (capacity <= 0) throw new ArgumentOutOfRangeException(nameof(capacity)); Capacity = capacity; }
    private void Touch(K key, V value, DoublyLinkedListNode<(K Key, V Value)>? n) { if (n is not null) order.Unlink(n); nodes[key] = order.PushFront((key, value)); }
    public V? Get(K key) { if (!nodes.TryGetValue(key, out var n)) return default; Touch(key, n.Value.Value, n); return n.Value.Value; }
    public bool Has(K key) => nodes.ContainsKey(key);
    public LRUCache<K, V> Set(K key, V value) { nodes.TryGetValue(key, out var n); Touch(key, value, n); if (Size > Capacity) nodes.Remove(order.PopBack().Key); return this; }
    public bool Delete(K key) { if (!nodes.Remove(key, out var n)) return false; order.Unlink(n); return true; }
    public K[] Keys() => order.Select(e => e.Key).ToArray();
}
