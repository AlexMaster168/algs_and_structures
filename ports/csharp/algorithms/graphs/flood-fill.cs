namespace Algorithms.Graphs;
public static partial class GraphAlgorithms
{
    public static double[][] FloodFill(double[][] image, int row, int col, double color) { var result = image.Select(r => r.ToArray()).ToArray(); if (row < 0 || row >= result.Length || col < 0 || col >= result[row].Length) return result; var original = result[row][col]; if (original == color) return result; var stack = new Stack<(int, int)>(); stack.Push((row, col)); while (stack.TryPop(out var cell)) { var (r, c) = cell; if (r < 0 || r >= result.Length || c < 0 || c >= result[r].Length || result[r][c] != original) continue; result[r][c] = color; stack.Push((r + 1, c)); stack.Push((r - 1, c)); stack.Push((r, c + 1)); stack.Push((r, c - 1)); } return result; }
}
