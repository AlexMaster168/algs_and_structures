using Algorithms.DataStructures.Heaps;
namespace Algorithms.Graphs;
public record AStarOptions<N>(N Start, N Goal, Func<N, IEnumerable<(N Node, double Cost)>> Neighbors, Func<N, double> Heuristic, Func<N, object>? Key = null);
public static partial class GraphAlgorithms
{
    public static (N[] Path, double Cost)? AStar<N>(AStarOptions<N> options)
    {
        var key = options.Key ?? (n => n?.ToString() ?? "null"); var goalKey = key(options.Goal); var best = new Dictionary<object, double> { [key(options.Start)] = 0 }; var cameFrom = new Dictionary<object, N>(); var open = new BinaryHeap<(N Node, double Cost, double Estimate)>((a, b) => a.Estimate.CompareTo(b.Estimate)); open.Push((options.Start, 0, options.Heuristic(options.Start)));
        while (!open.IsEmpty()) { var (node, cost, _) = open.Pop(); var nodeKey = key(node); if (cost > best[nodeKey]) continue; if (Equals(nodeKey, goalKey)) { var path = new List<N> { node }; while (cameFrom.TryGetValue(nodeKey, out var current)) { path.Add(current); nodeKey = key(current); } path.Reverse(); return (path.ToArray(), cost); } foreach (var next in options.Neighbors(node)) { var nextKey = key(next.Node); var nextCost = cost + next.Cost; if (nextCost < best.GetValueOrDefault(nextKey, double.PositiveInfinity)) { best[nextKey] = nextCost; cameFrom[nextKey] = node; open.Push((next.Node, nextCost, nextCost + options.Heuristic(next.Node))); } } } return null;
    }
    public static (int Row, int Col)[]? AStarGrid(IReadOnlyList<string> grid, (int Row, int Col) start, (int Row, int Col) goal, char wall = '#') { IEnumerable<((int Row, int Col) Node, double Cost)> Neighbors((int Row, int Col) node) { foreach (var (dr, dc) in Directions) { var r = node.Row + dr; var c = node.Col + dc; if (r >= 0 && r < grid.Count && c >= 0 && c < grid[r].Length && grid[r][c] != wall) yield return ((r, c), 1); } } return AStar(new AStarOptions<(int Row, int Col)>(start, goal, Neighbors, n => Math.Abs(n.Row - goal.Row) + Math.Abs(n.Col - goal.Col), n => n))?.Path; }
}
