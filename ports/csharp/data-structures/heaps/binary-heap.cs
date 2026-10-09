using System.Collections;
using Algorithms.Shared;
namespace Algorithms.DataStructures.Heaps;
public class BinaryHeap<T> : IEnumerable<T>
{
    private readonly List<T> items; private readonly Comparator<T> compare;
    public BinaryHeap(Comparator<T>? compare = null, IEnumerable<T>? values = null) { this.compare = compare ?? Compare.DefaultCompare; items = values?.ToList() ?? []; for (var i = (Size >> 1) - 1; i >= 0; i--) SiftDown(i); }
    public int Size => items.Count;
    public bool IsEmpty() => Size == 0;
    public T? Peek() => IsEmpty() ? default : items[0];
    public BinaryHeap<T> Push(params T[] values) { foreach (var v in values) { items.Add(v); SiftUp(Size - 1); } return this; }
    public T? Pop() { if (IsEmpty()) return default; var top = items[0]; var last = items[^1]; items.RemoveAt(Size - 1); if (Size > 0) { items[0] = last; SiftDown(0); } return top; }
    public T PushPop(T value) { if (IsEmpty() || compare(value, items[0]) <= 0) return value; var top = items[0]; items[0] = value; SiftDown(0); return top; }
    public T[] ToSortedArray() { var copy = new BinaryHeap<T>(compare, items); var result = new List<T>(); while (!copy.IsEmpty()) result.Add(copy.Pop()!); return result.ToArray(); }
    private void SiftUp(int i) { while (i > 0) { var p = (i - 1) >> 1; if (compare(items[i], items[p]) >= 0) break; (items[i], items[p]) = (items[p], items[i]); i = p; } }
    private void SiftDown(int i) { while (true) { var l = 2 * i + 1; var r = l + 1; var best = i; if (l < Size && compare(items[l], items[best]) < 0) best = l; if (r < Size && compare(items[r], items[best]) < 0) best = r; if (best == i) return; (items[i], items[best]) = (items[best], items[i]); i = best; } }
    public IEnumerator<T> GetEnumerator() => items.GetEnumerator();
    IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();
}
public class MinHeap<T>(IEnumerable<T>? values = null) : BinaryHeap<T>(Compare.DefaultCompare, values);
public class MaxHeap<T>(IEnumerable<T>? values = null) : BinaryHeap<T>((a, b) => Compare.DefaultCompare(b, a), values);
