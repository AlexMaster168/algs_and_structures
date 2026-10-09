namespace Algorithms.Geometry;

public sealed record Point(double X, double Y);
public sealed record ClosestPairResult(Point A, Point B, double Distance);
public static class Geometry
{
    public static double Cross(Point o, Point a, Point b) => (a.X - o.X) * (b.Y - o.Y) - (a.Y - o.Y) * (b.X - o.X);
    public static double Distance(Point a, Point b) => Math.Sqrt((a.X - b.X) * (a.X - b.X) + (a.Y - b.Y) * (a.Y - b.Y));
    public static Point[] ConvexHull(IReadOnlyList<Point> points)
    {
        var sorted = points.OrderBy(p => p.X).ThenBy(p => p.Y).ToArray(); if (sorted.Length < 3) return sorted;
        Point[] Build(IEnumerable<Point> sequence) { var hull = new List<Point>(); foreach (var p in sequence) { while (hull.Count >= 2 && Cross(hull[^2], hull[^1], p) <= 0) hull.RemoveAt(hull.Count - 1); hull.Add(p); } hull.RemoveAt(hull.Count - 1); return hull.ToArray(); }
        return [.. Build(sorted), .. Build(sorted.Reverse())];
    }
    public static double PolygonArea(IReadOnlyList<Point> polygon)
    {
        double area = 0; for (var i = 0; i < polygon.Count; i++) { var a = polygon[i]; var b = polygon[(i + 1) % polygon.Count]; area += a.X * b.Y - b.X * a.Y; } return Math.Abs(area) / 2;
    }
    public static bool PointInPolygon(Point point, IReadOnlyList<Point> polygon)
    {
        var inside = false; for (int i = 0, j = polygon.Count - 1; i < polygon.Count; j = i++) { var a = polygon[i]; var b = polygon[j]; if ((a.Y > point.Y) != (b.Y > point.Y) && point.X < (b.X - a.X) * (point.Y - a.Y) / (b.Y - a.Y) + a.X) inside = !inside; } return inside;
    }
    private static bool OnSegment(Point p, Point q, Point r) => Math.Min(p.X, r.X) <= q.X && q.X <= Math.Max(p.X, r.X) && Math.Min(p.Y, r.Y) <= q.Y && q.Y <= Math.Max(p.Y, r.Y);
    public static bool SegmentsIntersect(Point p1, Point p2, Point q1, Point q2)
    {
        var d1 = Math.Sign(Cross(p1, p2, q1)); var d2 = Math.Sign(Cross(p1, p2, q2)); var d3 = Math.Sign(Cross(q1, q2, p1)); var d4 = Math.Sign(Cross(q1, q2, p2));
        return d1 != d2 && d3 != d4 || d1 == 0 && OnSegment(p1, q1, p2) || d2 == 0 && OnSegment(p1, q2, p2) || d3 == 0 && OnSegment(q1, p1, q2) || d4 == 0 && OnSegment(q1, p2, q2);
    }
    public static ClosestPairResult? ClosestPair(IReadOnlyList<Point> points)
    {
        if (points.Count < 2) return null; var byX = points.OrderBy(p => p.X).ToArray(); var best = new ClosestPairResult(byX[0], byX[1], Distance(byX[0], byX[1]));
        void Update(Point a, Point b) { var distance = Distance(a, b); if (distance < best.Distance) best = new(a, b, distance); }
        Point[] Solve(int left, int right)
        {
            if (right - left <= 3) { for (var i = left; i < right; i++) for (var j = i + 1; j < right; j++) Update(byX[i], byX[j]); return byX[left..right].OrderBy(p => p.Y).ToArray(); }
            var middle = (left + right) / 2; var midX = byX[middle].X; var a = Solve(left, middle); var b = Solve(middle, right); var merged = new List<Point>(); int x = 0, y = 0;
            while (x < a.Length || y < b.Length) { if (y >= b.Length || x < a.Length && a[x].Y <= b[y].Y) merged.Add(a[x++]); else merged.Add(b[y++]); }
            var strip = merged.Where(p => Math.Abs(p.X - midX) < best.Distance).ToArray(); for (var i = 0; i < strip.Length; i++) for (var j = i + 1; j < strip.Length && strip[j].Y - strip[i].Y < best.Distance; j++) Update(strip[i], strip[j]);
            return merged.ToArray();
        }
        Solve(0, points.Count); return best;
    }
}
