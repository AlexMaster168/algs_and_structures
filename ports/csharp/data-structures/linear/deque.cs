using System.Collections;
namespace Algorithms.DataStructures.Linear;
public class Deque<T> : IEnumerable<T>
{
    private T[] buffer; private int head; public int Size { get; private set; }
    public Deque(int initialCapacity = 8) { buffer = new T[Math.Max(1, initialCapacity)]; }
    public bool IsEmpty() => Size == 0;
    private void EnsureCapacity() { if (Size < buffer.Length) return; var next = new T[buffer.Length * 2]; for (var i = 0; i < Size; i++) next[i] = buffer[(head + i) % buffer.Length]; buffer = next; head = 0; }
    public Deque<T> PushBack(T value) { EnsureCapacity(); buffer[(head + Size) % buffer.Length] = value; Size++; return this; }
    public Deque<T> PushFront(T value) { EnsureCapacity(); head = (head - 1 + buffer.Length) % buffer.Length; buffer[head] = value; Size++; return this; }
    public T? PopBack() { if (IsEmpty()) return default; var index = (head + Size - 1) % buffer.Length; var v = buffer[index]; buffer[index] = default!; Size--; return v; }
    public T? PopFront() { if (IsEmpty()) return default; var v = buffer[head]; buffer[head] = default!; head = (head + 1) % buffer.Length; Size--; return v; }
    public T? PeekFront() => IsEmpty() ? default : buffer[head];
    public T? PeekBack() => IsEmpty() ? default : buffer[(head + Size - 1) % buffer.Length];
    public T? At(int index) { if (index < 0) index += Size; return index < 0 || index >= Size ? default : buffer[(head + index) % buffer.Length]; }
    public T[] ToArray() => this.ToList().ToArray();
    public IEnumerator<T> GetEnumerator() { for (var i = 0; i < Size; i++) yield return buffer[(head + i) % buffer.Length]; }
    IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();
}
