namespace Patterns.Architectural;

public sealed class Event<T>(string name) { public string Name { get; } = name; }
public sealed class TypedEventEmitter
{
    private readonly Dictionary<object, object> listeners = [];
    private HashSet<Action<T>> Set<T>(Event<T> key)
    {
        if (!listeners.TryGetValue(key, out var value)) listeners[key] = value = new HashSet<Action<T>>();
        return (HashSet<Action<T>>)value;
    }
    public Action On<T>(Event<T> key, Action<T> listener) { Set(key).Add(listener); return () => Off(key, listener); }
    public Action Once<T>(Event<T> key, Action<T> listener)
    {
        Action off = () => { };
        off = On(key, payload => { off(); listener(payload); });
        return off;
    }
    public void Off<T>(Event<T> key, Action<T> listener) { if (listeners.TryGetValue(key, out var value)) ((HashSet<Action<T>>)value).Remove(listener); }
    public int Emit<T>(Event<T> key, T payload)
    {
        if (!listeners.TryGetValue(key, out var value)) return 0;
        var set = (HashSet<Action<T>>)value;
        foreach (var listener in set.ToArray()) listener(payload);
        return set.Count;
    }
    public int ListenerCount<T>(Event<T> key) => listeners.TryGetValue(key, out var value) ? ((HashSet<Action<T>>)value).Count : 0;
}
