namespace Patterns.Creational;

public sealed class ObjectPool<T>(Func<T> create, Action<T>? reset = null, int maxSize = int.MaxValue) where T : class
{
    private readonly System.Collections.Generic.Stack<T> available = new();
    private readonly HashSet<T> inUse = new(ReferenceEqualityComparer.Instance);
    public int AvailableCount => available.Count;
    public int InUseCount => inUse.Count;
    public T Acquire()
    {
        if (available.TryPop(out var item)) { inUse.Add(item); return item; }
        if (inUse.Count >= maxSize) throw new InvalidOperationException("Pool is exhausted");
        item = create();
        if (!inUse.Add(item)) throw new InvalidOperationException("Factory returned an item already in use");
        return item;
    }
    public void Release(T item)
    {
        if (!inUse.Remove(item)) throw new ArgumentException("Item does not belong to this pool");
        reset?.Invoke(item);
        available.Push(item);
    }
    public R Use<R>(Func<T, R> work) { var item = Acquire(); try { return work(item); } finally { Release(item); } }
}
