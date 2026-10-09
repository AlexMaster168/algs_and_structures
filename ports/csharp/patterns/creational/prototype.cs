namespace Patterns.Creational;

public interface IPrototype<T> { T Clone(); }
public abstract class Shape(double x, double y, string color, IEnumerable<string>? tags = null) : IPrototype<Shape>
{
    public double X { get; set; } = x;
    public double Y { get; set; } = y;
    public string Color { get; set; } = color;
    public List<string> Tags { get; } = tags?.ToList() ?? [];
    public abstract Shape Clone();
    public abstract double Area();
}
public sealed class Circle(double x, double y, string color, double radius, IEnumerable<string>? tags = null) : Shape(x, y, color, tags)
{
    public double Radius { get; set; } = radius;
    public override Circle Clone() => new(X, Y, Color, Radius, Tags);
    public override double Area() => Math.PI * Radius * Radius;
}
public sealed class Rectangle(double x, double y, string color, double width, double height, IEnumerable<string>? tags = null) : Shape(x, y, color, tags)
{
    public double Width { get; set; } = width;
    public double Height { get; set; } = height;
    public override Rectangle Clone() => new(X, Y, Color, Width, Height, Tags);
    public override double Area() => Width * Height;
}
public sealed class PrototypeRegistry<T> where T : IPrototype<T>
{
    private readonly Dictionary<string, T> prototypes = [];
    public PrototypeRegistry<T> Register(string key, T prototype) { prototypes[key] = prototype; return this; }
    public T Create(string key) => prototypes.TryGetValue(key, out var value) ? value.Clone() : throw new KeyNotFoundException($"Unknown prototype {key}");
}
