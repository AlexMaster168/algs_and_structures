namespace Algorithms.Backtracking;
public static partial class Backtracking
{
    public static bool WordSearch(IReadOnlyList<string> grid, string word) { var rows = grid.Count; var cols = rows == 0 ? 0 : grid[0].Length; var visited = new bool[rows, cols]; bool Search(int r, int c, int i) { if (i == word.Length) return true; if (r < 0 || c < 0 || r >= rows || c >= cols || visited[r, c] || grid[r][c] != word[i]) return false; visited[r, c] = true; var found = Search(r + 1, c, i + 1) || Search(r - 1, c, i + 1) || Search(r, c + 1, i + 1) || Search(r, c - 1, i + 1); visited[r, c] = false; return found; } for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++) if (Search(r, c, 0)) return true; return false; }
}
