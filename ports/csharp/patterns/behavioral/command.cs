namespace Patterns.Behavioral;

public sealed class TextDocument { public string Content { get; set; } = ""; }
public interface ICommand { void Execute(); void Undo(); }
public sealed class InsertCommand(TextDocument document, int position, string text) : ICommand
{
    public void Execute() => document.Content = document.Content.Insert(position, text);
    public void Undo() => document.Content = document.Content.Remove(position, text.Length);
}
public sealed class DeleteCommand(TextDocument document, int position, int length) : ICommand
{
    private string removed = "";
    public void Execute() { removed = document.Content.Substring(position, Math.Min(length, document.Content.Length - position)); document.Content = document.Content.Remove(position, removed.Length); }
    public void Undo() => document.Content = document.Content.Insert(position, removed);
}
public sealed class MacroCommand(IReadOnlyList<ICommand> commands) : ICommand
{
    public void Execute() { foreach (var command in commands) command.Execute(); }
    public void Undo() { for (var i = commands.Count - 1; i >= 0; i--) commands[i].Undo(); }
}
public sealed class CommandHistory
{
    private readonly System.Collections.Generic.Stack<ICommand> done = new(), undone = new();
    public void Run(ICommand command) { command.Execute(); done.Push(command); undone.Clear(); }
    public bool Undo() { if (!done.TryPop(out var command)) return false; command.Undo(); undone.Push(command); return true; }
    public bool Redo() { if (!undone.TryPop(out var command)) return false; command.Execute(); done.Push(command); return true; }
}
