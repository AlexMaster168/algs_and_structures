namespace Algorithms.Trees;

public sealed class LowestCommonAncestor
{
    private readonly int[] depth;
    private readonly int[][] up;
    public LowestCommonAncestor(int[][] tree, int root = 0)
    {
        if (tree.Length == 0 || root < 0 || root >= tree.Length) throw new ArgumentOutOfRangeException(nameof(root));
        var levels = Math.Max(1, (int)Math.Ceiling(Math.Log2(tree.Length + 1)));
        depth = Enumerable.Repeat(-1, tree.Length).ToArray(); up = Enumerable.Range(0, levels).Select(_ => Enumerable.Repeat(root, tree.Length).ToArray()).ToArray();
        var queue = new List<int> { root }; depth[root] = 0;
        for (var head = 0; head < queue.Count; head++) foreach (var child in tree[queue[head]])
        {
            if (depth[child] != -1) continue; depth[child] = depth[queue[head]] + 1; up[0][child] = queue[head]; queue.Add(child);
        }
        for (var k = 1; k < levels; k++) for (var v = 0; v < tree.Length; v++) up[k][v] = up[k - 1][up[k - 1][v]];
    }
    public int Ancestor(int vertex, int steps) { for (var k = 0; k < up.Length && steps > 0; k++, steps >>= 1) if ((steps & 1) != 0) vertex = up[k][vertex]; return vertex; }
    public int Lca(int a, int b)
    {
        if (depth[a] < depth[b]) (a, b) = (b, a); a = Ancestor(a, depth[a] - depth[b]); if (a == b) return a;
        for (var k = up.Length - 1; k >= 0; k--) if (up[k][a] != up[k][b]) (a, b) = (up[k][a], up[k][b]);
        return up[0][a];
    }
    public int Distance(int a, int b) => depth[a] + depth[b] - 2 * depth[Lca(a, b)];
}
