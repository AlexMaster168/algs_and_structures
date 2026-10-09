using Algorithms.Graphs;
namespace Algorithms.Trees;

public sealed record TreeDiameterResult(int Length, int[] Path);
public static class TreeAlgorithms
{
    public static TreeDiameterResult TreeDiameter(int[][] tree)
    {
        if (tree.Length == 0) return new(0, []);
        int Farthest(int[] distances) => Array.IndexOf(distances, distances.Max());
        var first = Farthest(GraphAlgorithms.Bfs(tree, 0).Distance); var result = GraphAlgorithms.Bfs(tree, first); var second = Farthest(result.Distance);
        return new(result.Distance[second], GraphAlgorithms.ReconstructPath(result.Parent, second));
    }
}
