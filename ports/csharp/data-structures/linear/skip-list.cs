using System.Collections;
using Algorithms.Shared;
namespace Algorithms.DataStructures.Linear;
public class SkipList<T> : IEnumerable<T>
{
    private sealed class Node(T value, int level) { internal readonly T Value = value; internal readonly Node?[] Next = new Node?[level]; }
    private readonly Node head; private readonly Comparator<T> compare; private readonly int maxLevel; private readonly double probability; private int level = 1;
    public int Size { get; private set; }
    public SkipList(Comparator<T>? compare = null, int maxLevel = 32, double probability = .5) { this.compare = compare ?? Compare.DefaultCompare; this.maxLevel = maxLevel; this.probability = probability; head = new(default!, maxLevel); }
    private Node[] Predecessors(T value) { var update = new Node[maxLevel]; var n = head; for (var i = level - 1; i >= 0; i--) { while (n.Next[i] is { } next && compare(next.Value, value) < 0) n = next; update[i] = n; } return update; }
    public bool Has(T value) { var n = Predecessors(value)[0].Next[0]; return n is not null && compare(n.Value, value) == 0; }
    public bool Insert(T value)
    {
        var update = Predecessors(value); if (update[0].Next[0] is { } c && compare(c.Value, value) == 0) return false;
        var l = 1; while (l < maxLevel && Random.Shared.NextDouble() < probability) l++;
        if (l > level) { for (var i = level; i < l; i++) update[i] = head; level = l; }
        var n = new Node(value, l); for (var i = 0; i < l; i++) { n.Next[i] = update[i].Next[i]; update[i].Next[i] = n; } Size++; return true;
    }
    public bool Delete(T value)
    {
        var update = Predecessors(value); var n = update[0].Next[0]; if (n is null || compare(n.Value, value) != 0) return false;
        for (var i = 0; i < level && update[i].Next[i] == n; i++) update[i].Next[i] = n.Next[i];
        while (level > 1 && head.Next[level - 1] is null) level--; Size--; return true;
    }
    public T[] ToArray() => this.ToList().ToArray();
    public IEnumerator<T> GetEnumerator() { for (var n = head.Next[0]; n is not null; n = n.Next[0]) yield return n.Value; }
    IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();
}
