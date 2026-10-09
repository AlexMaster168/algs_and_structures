namespace Patterns.Behavioral;

public interface IChatMediator { void Join(ChatUser user); void Send(ChatUser from, string message, string? to = null); }
public sealed class ChatUser(string name)
{
    private IChatMediator? room;
    public string Name => name;
    public List<string> Inbox { get; } = [];
    public void Attach(IChatMediator value) => room = value;
    public void Say(string message, string? to = null) => (room ?? throw new InvalidOperationException($"{name} is not in a room")).Send(this, message, to);
    public void Receive(string from, string message) => Inbox.Add($"{from}: {message}");
}
public sealed class ChatRoom : IChatMediator
{
    private readonly Dictionary<string, ChatUser> users = [];
    public void Join(ChatUser user) { users[user.Name] = user; user.Attach(this); }
    public void Send(ChatUser from, string message, string? to = null)
    {
        if (to is not null) { if (users.TryGetValue(to, out var user)) user.Receive(from.Name, message); return; }
        foreach (var user in users.Values) if (!ReferenceEquals(user, from)) user.Receive(from.Name, message);
    }
}
