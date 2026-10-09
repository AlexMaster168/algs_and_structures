namespace Algorithms.DynamicProgramming;
public sealed class Memoized<T, R> where T : notnull
{
    private readonly Func<T, R> function; private readonly Func<T, object> resolveKey;
    public Dictionary<object, R> Cache { get; } = [];
    public Memoized(Func<T, R> function, Func<T, object>? resolveKey = null) { this.function = function; this.resolveKey = resolveKey ?? (value => value); }
    public R Invoke(T args) { var key = resolveKey(args); if (Cache.TryGetValue(key, out var result)) return result; result = function(args); Cache[key] = result; return result; }
}
public static partial class Dynamic
{
    public static Memoized<T, R> Memoize<T, R>(Func<T, R> function, Func<T, object>? resolveKey = null) where T : notnull => new(function, resolveKey);
}
