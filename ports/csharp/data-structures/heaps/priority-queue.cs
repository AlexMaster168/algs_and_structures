namespace Algorithms.DataStructures.Heaps;
public class PriorityQueue<T>
{
    private sealed record Entry(T Value, double Priority, long Order);
    private readonly BinaryHeap<Entry> heap = new((a, b) => a.Priority == b.Priority ? a.Order.CompareTo(b.Order) : a.Priority.CompareTo(b.Priority)); private long counter;
    public int Size => heap.Size;
    public bool IsEmpty() => heap.IsEmpty();
    public PriorityQueue<T> Enqueue(T value, double priority) { heap.Push(new Entry(value, priority, counter++)); return this; }
    public T? Dequeue() { var e = heap.Pop(); return e is null ? default : e.Value; }
    public T? Peek() { var e = heap.Peek(); return e is null ? default : e.Value; }
    public double? PeekPriority() => heap.Peek()?.Priority;
}
