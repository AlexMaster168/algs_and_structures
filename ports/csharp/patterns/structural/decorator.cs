using System.Text.Json;
namespace Patterns.Structural;

public interface INotifier { string[] Send(string message); }
public sealed class EmailNotifier(string email) : INotifier { public string[] Send(string message) => [$"email to {email}: {message}"]; }
public abstract class NotifierDecorator(INotifier wrapped) : INotifier { public virtual string[] Send(string message) => wrapped.Send(message); }
public sealed class SmsNotifier(INotifier wrapped, string phone) : NotifierDecorator(wrapped)
{
    public override string[] Send(string message) => [.. base.Send(message), $"sms to {phone}: {message}"];
}
public sealed class SlackNotifier(INotifier wrapped, string channel) : NotifierDecorator(wrapped)
{
    public override string[] Send(string message) => [.. base.Send(message), $"slack #{channel}: {message}"];
}
public static class Decorator
{
    public static Func<A, R> WithLogging<A, R>(Func<A, R> action, Action<string> log, string? name = null) => argument =>
    {
        var label = name ?? action.Method.Name;
        log($"{label}({JsonSerializer.Serialize(argument)})");
        var result = action(argument);
        log($"{label} -> {JsonSerializer.Serialize(result)}");
        return result;
    };
}
