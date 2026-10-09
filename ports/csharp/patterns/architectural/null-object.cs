namespace Patterns.Architectural;

public interface ILogger { void Info(string message); void Error(string message); }
public sealed class MemoryLogger : ILogger
{
    public List<string> Lines { get; } = [];
    public void Info(string message) => Lines.Add("INFO " + message);
    public void Error(string message) => Lines.Add("ERROR " + message);
}
public sealed class NullLogger : ILogger { public void Info(string message) { } public void Error(string message) { } }
public sealed class PaymentService(ILogger? logger = null)
{
    private readonly ILogger logger = logger ?? new NullLogger();
    public bool Charge(double amount) { if (amount <= 0) { logger.Error($"invalid amount {amount}"); return false; } logger.Info($"charged {amount}"); return true; }
}
