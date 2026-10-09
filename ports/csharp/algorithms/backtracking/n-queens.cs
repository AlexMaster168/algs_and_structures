namespace Algorithms.Backtracking;
public static partial class Backtracking
{
    public static string[][] NQueens(int n) { var result = new List<string[]>(); var columns = new List<int>(); var used = new HashSet<int>(); var diagonal = new HashSet<int>(); var anti = new HashSet<int>(); void Place(int row) { if (row == n) { result.Add(columns.Select(c => new string('.', c) + 'Q' + new string('.', n - c - 1)).ToArray()); return; } for (var c = 0; c < n; c++) { if (used.Contains(c) || diagonal.Contains(row - c) || anti.Contains(row + c)) continue; columns.Add(c); used.Add(c); diagonal.Add(row - c); anti.Add(row + c); Place(row + 1); columns.RemoveAt(columns.Count - 1); used.Remove(c); diagonal.Remove(row - c); anti.Remove(row + c); } } Place(0); return result.ToArray(); }
    public static long CountNQueens(int n) { var full = (1 << n) - 1; long Count(int columns, int diagonals, int anti) { if (columns == full) return 1; long total = 0; var free = full & ~(columns | diagonals | anti); while (free != 0) { var bit = free & -free; free ^= bit; total += Count(columns | bit, ((diagonals | bit) << 1) & full, (anti | bit) >> 1); } return total; } return Count(0, 0, 0); }
}
