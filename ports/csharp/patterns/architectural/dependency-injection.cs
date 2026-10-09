namespace Patterns.Architectural;

public sealed class Token<T>(string description) { public string Description { get; } = description; }
public static class DependencyInjection { public static Token<T> Token<T>(string description) => new(description); }
public sealed class Container
{
    private sealed class Registration(Func<Container, object?> factory, string lifetime)
    {
        public readonly Func<Container, object?> Factory = factory;
        public readonly string Lifetime = lifetime;
        public object? Instance;
        public bool HasInstance;
    }
    private readonly Dictionary<object, Registration> registrations = [];
    private readonly HashSet<object> resolving = [];
    public Container Register<T>(Token<T> token, Func<Container, T> factory, string lifetime = "singleton")
    {
        if (lifetime is not ("singleton" or "transient")) throw new ArgumentException("Unknown lifetime");
        registrations[token] = new(c => factory(c), lifetime); return this;
    }
    public Container Value<T>(Token<T> token, T value) { registrations[token] = new(_ => value, "singleton") { Instance = value, HasInstance = true }; return this; }
    public T Resolve<T>(Token<T> token)
    {
        if (!registrations.TryGetValue(token, out var registration)) throw new KeyNotFoundException("No provider for " + token.Description);
        if (registration.Lifetime == "singleton" && registration.HasInstance) return (T)registration.Instance!;
        if (!resolving.Add(token)) throw new InvalidOperationException("Circular dependency on " + token.Description);
        try { var instance = registration.Factory(this); if (registration.Lifetime == "singleton") { registration.Instance = instance; registration.HasInstance = true; } return (T)instance!; }
        finally { resolving.Remove(token); }
    }
}
