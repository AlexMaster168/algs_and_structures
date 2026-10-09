using System.Collections;
namespace Patterns.Behavioral;

public interface IClassicIterator<T> { bool HasNext(); T Next(); }
public sealed class NumberRange : IEnumerable<double>
{
    private readonly double start, end, step;
    public NumberRange(double start, double end, double step = 1) { if (step == 0) throw new ArgumentOutOfRangeException(nameof(step)); this.start = start; this.end = end; this.step = step; }
    private sealed class RangeIterator(double current, double end, double step) : IClassicIterator<double>
    {
        public bool HasNext() => step > 0 ? current < end : current > end;
        public double Next() { var value = current; current += step; return value; }
    }
    public IClassicIterator<double> CreateIterator() => new RangeIterator(start, end, step);
    public IEnumerator<double> GetEnumerator() { var iterator = CreateIterator(); while (iterator.HasNext()) yield return iterator.Next(); }
    IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();
}
public sealed record TreeItem<T>(T Value, IReadOnlyList<TreeItem<T>>? Children = null);
public static class Iterator
{
    public static IEnumerable<T> DepthFirst<T>(IReadOnlyList<TreeItem<T>> roots)
    {
        foreach (var root in roots) { yield return root.Value; foreach (var value in DepthFirst(root.Children ?? [])) yield return value; }
    }
    public static IEnumerable<T> BreadthFirst<T>(IReadOnlyList<TreeItem<T>> roots)
    {
        var queue = roots.ToList();
        for (var head = 0; head < queue.Count; head++) { var item = queue[head]; yield return item.Value; if (item.Children is not null) queue.AddRange(item.Children); }
    }
    public static IEnumerable<T> Take<T>(IEnumerable<T> source, int count)
    {
        if (count <= 0) yield break;
        foreach (var item in source) { yield return item; if (--count == 0) yield break; }
    }
}
