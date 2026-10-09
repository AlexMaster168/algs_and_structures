namespace Patterns.Structural;

public sealed record TreeType(string Name, string Color, string Texture)
{
    public string Draw(double x, double y) => $"{Name}({Color}) at {x},{y}";
}
public sealed class TreeTypeFactory
{
    private readonly Dictionary<(string, string, string), TreeType> types = [];
    public int Count => types.Count;
    public TreeType Get(string name, string color, string texture)
    {
        var key = (name, color, texture);
        if (!types.TryGetValue(key, out var type)) types[key] = type = new(name, color, texture);
        return type;
    }
}
public sealed class Forest(TreeTypeFactory? factory = null)
{
    private readonly TreeTypeFactory factory = factory ?? new();
    private readonly List<(double X, double Y, TreeType Type)> trees = [];
    public int TreeCount => trees.Count;
    public int TypeCount => factory.Count;
    public Forest Plant(double x, double y, string name, string color, string texture) { trees.Add((x, y, factory.Get(name, color, texture))); return this; }
    public string[] Draw() => trees.Select(t => t.Type.Draw(t.X, t.Y)).ToArray();
}
