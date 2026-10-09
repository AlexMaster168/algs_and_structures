namespace Patterns.Structural;

public interface IFileSystemNode { string Name { get; } double Size(); string[] Render(string indent = ""); }
public sealed class FileEntry(string name, double bytes) : IFileSystemNode
{
    public string Name => name;
    public double Size() => bytes;
    public string[] Render(string indent = "") => [$"{indent}{name} ({bytes})"];
}
public sealed class Directory(string name) : IFileSystemNode
{
    private readonly List<IFileSystemNode> children = [];
    public string Name => name;
    public Directory Add(params IFileSystemNode[] nodes) { children.AddRange(nodes); return this; }
    public bool Remove(string value) { var index = children.FindIndex(c => c.Name == value); if (index < 0) return false; children.RemoveAt(index); return true; }
    public double Size() => children.Sum(c => c.Size());
    public string[] Render(string indent = "") => [$"{indent}{name}/ ({Size()})", .. children.SelectMany(c => c.Render(indent + "  "))];
}
