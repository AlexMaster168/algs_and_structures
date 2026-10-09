namespace Patterns.Behavioral;

public sealed record Ticket(string Topic, int Severity);
public abstract class SupportHandler
{
    private SupportHandler? next;
    public SupportHandler SetNext(SupportHandler handler) { next = handler; return handler; }
    public string Handle(Ticket ticket) => CanHandle(ticket) ? Resolve(ticket) : next?.Handle(ticket) ?? $"Unresolved: {ticket.Topic}";
    protected abstract bool CanHandle(Ticket ticket);
    protected abstract string Resolve(Ticket ticket);
}
public sealed class FaqBot : SupportHandler
{
    private static readonly Dictionary<string, string> Answers = new() { ["password"] = "Use the \"Forgot password\" link", ["delivery"] = "Delivery takes 3-5 days" };
    protected override bool CanHandle(Ticket ticket) => ticket.Severity == 1 && Answers.ContainsKey(ticket.Topic);
    protected override string Resolve(Ticket ticket) => "Bot: " + Answers[ticket.Topic];
}
public sealed class SupportAgent : SupportHandler
{
    protected override bool CanHandle(Ticket ticket) => ticket.Severity <= 2;
    protected override string Resolve(Ticket ticket) => "Agent resolved " + ticket.Topic;
}
public sealed class Engineer : SupportHandler
{
    protected override bool CanHandle(Ticket ticket) => true;
    protected override string Resolve(Ticket ticket) => "Engineer fixed " + ticket.Topic;
}
public static class Support
{
    public static SupportHandler CreateSupportChain() { var bot = new FaqBot(); bot.SetNext(new SupportAgent()).SetNext(new Engineer()); return bot; }
}
