using System.Text.Json;
namespace Patterns.Behavioral;

public interface IShapeVisitor<R> { R VisitCircle(CircleShape circle); R VisitRectangle(RectangleShape rectangle); R VisitTriangle(TriangleShape triangle); }
public interface IVisitableShape { R Accept<R>(IShapeVisitor<R> visitor); }
public sealed record CircleShape(double Radius) : IVisitableShape { public R Accept<R>(IShapeVisitor<R> visitor) => visitor.VisitCircle(this); }
public sealed record RectangleShape(double Width, double Height) : IVisitableShape { public R Accept<R>(IShapeVisitor<R> visitor) => visitor.VisitRectangle(this); }
public sealed record TriangleShape(double A, double B, double C) : IVisitableShape { public R Accept<R>(IShapeVisitor<R> visitor) => visitor.VisitTriangle(this); }
public sealed class AreaVisitor : IShapeVisitor<double>
{
    public double VisitCircle(CircleShape circle) => Math.PI * circle.Radius * circle.Radius;
    public double VisitRectangle(RectangleShape rectangle) => rectangle.Width * rectangle.Height;
    public double VisitTriangle(TriangleShape triangle) { var s = (triangle.A + triangle.B + triangle.C) / 2; return Math.Sqrt(s * (s - triangle.A) * (s - triangle.B) * (s - triangle.C)); }
}
public sealed class PerimeterVisitor : IShapeVisitor<double>
{
    public double VisitCircle(CircleShape circle) => 2 * Math.PI * circle.Radius;
    public double VisitRectangle(RectangleShape rectangle) => 2 * (rectangle.Width + rectangle.Height);
    public double VisitTriangle(TriangleShape triangle) => triangle.A + triangle.B + triangle.C;
}
public sealed class JsonExportVisitor : IShapeVisitor<string>
{
    public string VisitCircle(CircleShape circle) => JsonSerializer.Serialize(new { type = "circle", radius = circle.Radius });
    public string VisitRectangle(RectangleShape rectangle) => JsonSerializer.Serialize(new { type = "rectangle", width = rectangle.Width, height = rectangle.Height });
    public string VisitTriangle(TriangleShape triangle) => JsonSerializer.Serialize(new { type = "triangle", sides = new[] { triangle.A, triangle.B, triangle.C } });
}
