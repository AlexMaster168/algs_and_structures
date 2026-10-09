namespace Patterns.Structural;

public interface IWeatherService { Task<double> Temperature(string city); }
public sealed class CachingWeatherProxy(IWeatherService service, double ttlMs = 60000, Func<double>? now = null) : IWeatherService
{
    private readonly Func<double> now = now ?? (() => DateTimeOffset.UtcNow.ToUnixTimeMilliseconds());
    private readonly Dictionary<string, (double Value, double ExpiresAt)> cache = [];
    public async Task<double> Temperature(string city)
    {
        if (cache.TryGetValue(city, out var entry) && entry.ExpiresAt > now()) return entry.Value;
        var value = await service.Temperature(city);
        cache[city] = (value, now() + ttlMs);
        return value;
    }
}
public sealed class AccessControlProxy(IWeatherService service, Func<bool> isAllowed) : IWeatherService
{
    public Task<double> Temperature(string city) => isAllowed() ? service.Temperature(city) : Task.FromException<double>(new UnauthorizedAccessException("Access denied"));
}
public sealed class ValidatedObject<T>(IDictionary<string, T> target, Func<string, T, bool> validate)
{
    public T this[string key]
    {
        get => target[key];
        set { if (!validate(key, value)) throw new ArgumentException($"Invalid value for {key}"); target[key] = value; }
    }
}
public static class Proxy
{
    public static ValidatedObject<T> CreateValidatedObject<T>(IDictionary<string, T> target, Func<string, T, bool> validate) => new(target, validate);
}
