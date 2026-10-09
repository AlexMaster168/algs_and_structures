namespace Algorithms.DataStructures.Graphs;
public record GraphEdge<V>(V From, V To, double Weight);
public class Graph<V> where V : notnull
{
    private readonly Dictionary<V, Dictionary<V, double>> adjacency = []; public bool Directed { get; }
    public Graph(bool directed = false) { Directed = directed; }
    public int VertexCount => adjacency.Count; public int EdgeCount => Edges().Length;
    public Graph<V> AddVertex(V vertex) { adjacency.TryAdd(vertex, []); return this; }
    public Graph<V> AddEdge(V from, V to, double weight = 1) { AddVertex(from).AddVertex(to); adjacency[from][to] = weight; if (!Directed) adjacency[to][from] = weight; return this; }
    public bool RemoveEdge(V from, V to) { var removed = adjacency.TryGetValue(from, out var n) && n.Remove(to); if (removed && !Directed) adjacency[to].Remove(from); return removed; }
    public bool RemoveVertex(V vertex) { if (!adjacency.Remove(vertex)) return false; foreach (var n in adjacency.Values) n.Remove(vertex); return true; }
    public bool HasVertex(V vertex) => adjacency.ContainsKey(vertex);
    public bool HasEdge(V from, V to) => adjacency.TryGetValue(from, out var n) && n.ContainsKey(to);
    public double? Weight(V from, V to) => adjacency.TryGetValue(from, out var n) && n.TryGetValue(to, out var w) ? w : null;
    public V[] Neighbors(V vertex) => adjacency.TryGetValue(vertex, out var n) ? n.Keys.ToArray() : [];
    public int Degree(V vertex) => adjacency.TryGetValue(vertex, out var n) ? n.Count : 0;
    public V[] Vertices() => adjacency.Keys.ToArray();
    public GraphEdge<V>[] Edges() { var result = new List<GraphEdge<V>>(); var seen = new HashSet<V>(); foreach (var (from, n) in adjacency) { foreach (var (to, w) in n) if (Directed || !seen.Contains(to)) result.Add(new(from, to, w)); seen.Add(from); } return result.ToArray(); }
    public (V[] Vertices, double[][] Matrix) ToAdjacencyMatrix() { var v = Vertices(); var index = v.Select((x, i) => (x, i)).ToDictionary(p => p.x, p => p.i); var matrix = v.Select(_ => new double[v.Length]).ToArray(); foreach (var (from, n) in adjacency) foreach (var (to, w) in n) matrix[index[from]][index[to]] = w; return (v, matrix); }
    public (V[] Vertices, int[][] List) ToAdjacencyList() { var v = Vertices(); var index = v.Select((x, i) => (x, i)).ToDictionary(p => p.x, p => p.i); return (v, v.Select(x => Neighbors(x).Select(y => index[y]).ToArray()).ToArray()); }
}
