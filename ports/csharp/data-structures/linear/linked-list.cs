using System.Collections;
namespace Algorithms.DataStructures.Linear;
public class LinkedListNode<T>(T value) { public T Value { get; set; } = value; public LinkedListNode<T>? Next { get; set; } }
public class LinkedList<T> : IEnumerable<T>
{
    private LinkedListNode<T>? head, tail;
    public int Size { get; private set; }
    public T? First => head is null ? default : head.Value;
    public T? Last => tail is null ? default : tail.Value;
    public static LinkedList<T> From(IEnumerable<T> values) { var list = new LinkedList<T>(); foreach (var v in values) list.Append(v); return list; }
    public LinkedList<T> Append(T value) { var n = new LinkedListNode<T>(value); if (tail is null) head = n; else tail.Next = n; tail = n; Size++; return this; }
    public LinkedList<T> Prepend(T value) { head = new(value) { Next = head }; tail ??= head; Size++; return this; }
    private LinkedListNode<T> NodeAt(int index) { var n = head!; for (var i = 0; i < index; i++) n = n.Next!; return n; }
    public LinkedList<T> InsertAt(int index, T value) { if (index < 0 || index > Size) throw new ArgumentOutOfRangeException(nameof(index)); if (index == 0) return Prepend(value); if (index == Size) return Append(value); var p = NodeAt(index - 1); p.Next = new(value) { Next = p.Next }; Size++; return this; }
    public T? Get(int index) => index < 0 || index >= Size ? default : NodeAt(index).Value;
    public int IndexOf(T value) { var i = 0; foreach (var v in this) { if (EqualityComparer<T>.Default.Equals(v, value)) return i; i++; } return -1; }
    public T? Find(Func<T, bool> predicate) { foreach (var v in this) if (predicate(v)) return v; return default; }
    public T? RemoveAt(int index)
    {
        if (index < 0 || index >= Size) return default; LinkedListNode<T> removed;
        if (index == 0) { removed = head!; head = removed.Next; if (head is null) tail = null; }
        else { var p = NodeAt(index - 1); removed = p.Next!; p.Next = removed.Next; if (removed == tail) tail = p; }
        Size--; return removed.Value;
    }
    public bool Remove(T value) { var index = IndexOf(value); if (index < 0) return false; RemoveAt(index); return true; }
    public LinkedList<T> Reverse() { LinkedListNode<T>? previous = null; var current = head; tail = current; while (current is not null) { var next = current.Next; current.Next = previous; previous = current; current = next; } head = previous; return this; }
    public T[] ToArray() => this.ToList().ToArray();
    public IEnumerator<T> GetEnumerator() { for (var n = head; n is not null; n = n.Next) yield return n.Value; }
    IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();
}
