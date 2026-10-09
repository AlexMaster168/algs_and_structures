namespace Patterns.Creational;

public sealed class AppConfig
{
    private static readonly Lazy<AppConfig> Instance = new(() => new());
    private readonly Dictionary<string, string> values = [];
    private AppConfig() { }
    public static AppConfig GetInstance() => Instance.Value;
    public AppConfig Set(string key, string value) { values[key] = value; return this; }
    public string? Get(string key, string? fallback = null) => values.TryGetValue(key, out var value) ? value : fallback;
}

public static class Singleton
{
    public static Func<T> LazySingleton<T>(Func<T> create)
    {
        var instance = new Lazy<T>(create);
        return () => instance.Value;
    }
}
