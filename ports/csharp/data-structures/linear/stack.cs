using System.Collections;
namespace Algorithms.DataStructures.Linear;
public class Stack<T> : IEnumerable<T>
{
    private readonly List<T> items = [];
    public int Size => items.Count;
    public bool IsEmpty() => Size == 0;
    public Stack<T> Push(T value) { items.Add(value); return this; }
    public T? Pop() { if (IsEmpty()) return default; var v = items[^1]; items.RemoveAt(Size - 1); return v; }
    public T? Peek() => IsEmpty() ? default : items[^1];
    public T[] ToArray() => this.ToList().ToArray();
    public IEnumerator<T> GetEnumerator() { for (var i = Size - 1; i >= 0; i--) yield return items[i]; }
    IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();
}
