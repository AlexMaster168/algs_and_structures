using Algorithms.Sorting;
namespace Algorithms.Graphs;
public record CutStructure((int A, int B)[] Bridges, int[] ArticulationPoints);
public static partial class GraphAlgorithms
{
    public static CutStructure FindBridgesAndArticulationPoints(int[][] graph) { var entry = Enumerable.Repeat(-1, graph.Length).ToArray(); var low = new int[graph.Length]; var articulation = new bool[graph.Length]; var bridges = new List<(int, int)>(); var timer = 0; void Visit(int v, int p) { entry[v] = low[v] = timer++; var children = 0; var skipped = false; foreach (var n in graph[v]) { if (n == p && !skipped) { skipped = true; continue; } if (entry[n] != -1) { low[v] = Math.Min(low[v], entry[n]); continue; } Visit(n, v); children++; low[v] = Math.Min(low[v], low[n]); if (low[n] > entry[v]) bridges.Add((Math.Min(v, n), Math.Max(v, n))); if (p != -1 && low[n] >= entry[v]) articulation[v] = true; } if (p == -1 && children > 1) articulation[v] = true; } for (var v = 0; v < graph.Length; v++) if (entry[v] == -1) Visit(v, -1); return new(Sort.MergeSort(bridges), Enumerable.Range(0, graph.Length).Where(v => articulation[v]).ToArray()); }
}
