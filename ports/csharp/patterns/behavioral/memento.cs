namespace Patterns.Behavioral;

public sealed record EditorSnapshot(string Content, int Cursor);
public sealed class Editor
{
    private string content = "";
    private int cursor;
    public string Text => content;
    public int CursorPosition => cursor;
    public void Type(string value) { content = content.Insert(cursor, value); cursor += value.Length; }
    public void MoveCursor(int position) => cursor = Math.Clamp(position, 0, content.Length);
    public EditorSnapshot Save() => new(content, cursor);
    public void Restore(EditorSnapshot snapshot) { content = snapshot.Content; cursor = snapshot.Cursor; }
}
public sealed class EditorHistory(Editor editor)
{
    private readonly System.Collections.Generic.Stack<EditorSnapshot> snapshots = new();
    public void Backup() => snapshots.Push(editor.Save());
    public bool Undo() { if (!snapshots.TryPop(out var snapshot)) return false; editor.Restore(snapshot); return true; }
}
