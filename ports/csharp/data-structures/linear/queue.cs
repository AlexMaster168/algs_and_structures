using System.Collections;
namespace Algorithms.DataStructures.Linear;
public class Queue<T> : IEnumerable<T>
{
    private List<T> items = []; private int head;
    public int Size => items.Count - head;
    public bool IsEmpty() => Size == 0;
    public Queue<T> Enqueue(T value) { items.Add(value); return this; }
    public T? Dequeue() { if (IsEmpty()) return default; var v = items[head++]; if (head * 2 >= items.Count) { items = items.GetRange(head, Size); head = 0; } return v; }
    public T? Peek() => IsEmpty() ? default : items[head];
    public T[] ToArray() => this.ToList().ToArray();
    public IEnumerator<T> GetEnumerator() { for (var i = head; i < items.Count; i++) yield return items[i]; }
    IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();
}
