using Algorithms.Sorting;
namespace Algorithms.Graphs;
public static partial class GraphAlgorithms
{
    public static int[][] ConnectedComponents(int[][] graph) { var visited = new bool[graph.Length]; var result = new List<int[]>(); for (var start = 0; start < graph.Length; start++) { if (visited[start]) continue; var component = new List<int>(); var stack = new Stack<int>(); stack.Push(start); visited[start] = true; while (stack.TryPop(out var v)) { component.Add(v); foreach (var n in graph[v]) { if (visited[n]) continue; visited[n] = true; stack.Push(n); } } result.Add(Sort.MergeSort(component)); } return result.ToArray(); }
}
