using System.Collections;
namespace Algorithms.DataStructures.Linear;
public class DoublyLinkedListNode<T>(T value) { public T Value { get; set; } = value; public DoublyLinkedListNode<T>? Prev { get; set; } public DoublyLinkedListNode<T>? Next { get; set; } }
public class DoublyLinkedList<T> : IEnumerable<T>
{
    private DoublyLinkedListNode<T>? head, tail; public int Size { get; private set; }
    public T? First => head is null ? default : head.Value;
    public T? Last => tail is null ? default : tail.Value;
    public static DoublyLinkedList<T> From(IEnumerable<T> values) { var l = new DoublyLinkedList<T>(); foreach (var v in values) l.PushBack(v); return l; }
    public DoublyLinkedListNode<T> PushBack(T value) { var n = new DoublyLinkedListNode<T>(value) { Prev = tail }; if (tail is null) head = n; else tail.Next = n; tail = n; Size++; return n; }
    public DoublyLinkedListNode<T> PushFront(T value) { var n = new DoublyLinkedListNode<T>(value) { Next = head }; if (head is null) tail = n; else head.Prev = n; head = n; Size++; return n; }
    public T? PopBack() { if (tail is null) return default; var n = tail; Unlink(n); return n.Value; }
    public T? PopFront() { if (head is null) return default; var n = head; Unlink(n); return n.Value; }
    public bool Remove(T value) { for (var n = head; n is not null; n = n.Next) if (EqualityComparer<T>.Default.Equals(n.Value, value)) { Unlink(n); return true; } return false; }
    public void Unlink(DoublyLinkedListNode<T> n) { if (n.Prev is null) head = n.Next; else n.Prev.Next = n.Next; if (n.Next is null) tail = n.Prev; else n.Next.Prev = n.Prev; n.Prev = n.Next = null; Size--; }
    public IEnumerable<T> Reversed() { for (var n = tail; n is not null; n = n.Prev) yield return n.Value; }
    public T[] ToArray() => this.ToList().ToArray();
    public IEnumerator<T> GetEnumerator() { for (var n = head; n is not null; n = n.Next) yield return n.Value; }
    IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();
}
