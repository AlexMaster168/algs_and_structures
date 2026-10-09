namespace Algorithms.DataStructures.Graphs;
public class DisjointSet
{
    private readonly int[] parent, sizes; public int Count { get; private set; }
    public DisjointSet(int size) { parent = Enumerable.Range(0, size).ToArray(); sizes = Enumerable.Repeat(1, size).ToArray(); Count = size; }
    public int Find(int x) { var root = x; while (parent[root] != root) root = parent[root]; while (parent[x] != root) { var next = parent[x]; parent[x] = root; x = next; } return root; }
    public bool Union(int a, int b) { var x = Find(a); var y = Find(b); if (x == y) return false; if (sizes[x] < sizes[y]) (x, y) = (y, x); parent[y] = x; sizes[x] += sizes[y]; Count--; return true; }
    public bool Connected(int a, int b) => Find(a) == Find(b);
    public int SizeOf(int x) => sizes[Find(x)];
}
