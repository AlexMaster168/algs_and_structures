using System.Collections;
namespace Algorithms.DataStructures.Linear;
public class CircularBuffer<T> : IEnumerable<T>
{
    private readonly T[] buffer; private int start; public int Capacity { get; } public int Size { get; private set; }
    public CircularBuffer(int capacity) { if (capacity <= 0) throw new ArgumentOutOfRangeException(nameof(capacity)); Capacity = capacity; buffer = new T[capacity]; }
    public bool IsFull() => Size == Capacity;
    public bool IsEmpty() => Size == 0;
    public T? Push(T value) { if (IsFull()) { var old = buffer[start]; buffer[start] = value; start = (start + 1) % Capacity; return old; } buffer[(start + Size) % Capacity] = value; Size++; return default; }
    public T? Shift() { if (IsEmpty()) return default; var v = buffer[start]; buffer[start] = default!; start = (start + 1) % Capacity; Size--; return v; }
    public T[] ToArray() => this.ToList().ToArray();
    public IEnumerator<T> GetEnumerator() { for (var i = 0; i < Size; i++) yield return buffer[(start + i) % Capacity]; }
    IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();
}
