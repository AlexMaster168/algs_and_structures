namespace Patterns.Architectural;

public sealed class CircuitOpenError() : InvalidOperationException("Circuit is open");
public sealed class CircuitBreaker<A, R>(Func<A, Task<R>> action, int failureThreshold = 3, double resetTimeoutMs = 10000, Func<double>? now = null)
{
    private readonly Func<double> now = now ?? (() => DateTimeOffset.UtcNow.ToUnixTimeMilliseconds());
    private int failures;
    private double openedAt;
    private string current = "closed";
    public string State { get { if (current == "open" && now() - openedAt >= resetTimeoutMs) current = "half-open"; return current; } }
    public async Task<R> Call(A arguments)
    {
        if (State == "open") throw new CircuitOpenError();
        try { var result = await action(arguments); failures = 0; current = "closed"; return result; }
        catch { if (++failures >= failureThreshold || current == "half-open") { current = "open"; openedAt = now(); } throw; }
    }
}
public static class Circuit
{
    public static async Task<R> Retry<R>(Func<Task<R>> action, int attempts = 3, double delayMs = 0, double factor = 2)
    {
        if (attempts < 1) throw new ArgumentOutOfRangeException(nameof(attempts));
        for (var attempt = 0; ; attempt++)
        {
            try { return await action(); }
            catch when (attempt < attempts - 1) { if (delayMs > 0) await Task.Delay(TimeSpan.FromMilliseconds(delayMs * Math.Pow(factor, attempt))); }
        }
    }
}
