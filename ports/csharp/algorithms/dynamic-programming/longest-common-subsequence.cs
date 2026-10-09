namespace Algorithms.DynamicProgramming;
public static partial class Dynamic
{
    public static string LongestCommonSubsequence(string a, string b)
    {
        var table = new int[a.Length + 1, b.Length + 1]; for (var i = 1; i <= a.Length; i++) for (var j = 1; j <= b.Length; j++) table[i, j] = a[i - 1] == b[j - 1] ? table[i - 1, j - 1] + 1 : Math.Max(table[i - 1, j], table[i, j - 1]);
        var result = new List<char>(); var x = a.Length; var y = b.Length; while (x > 0 && y > 0) { if (a[x - 1] == b[y - 1]) { result.Add(a[--x]); y--; } else if (table[x - 1, y] >= table[x, y - 1]) x--; else y--; } result.Reverse(); return new(result.ToArray());
    }
    public static string LongestCommonSubstring(string a, string b) { var previous = new int[b.Length + 1]; var best = 0; var end = 0; for (var i = 1; i <= a.Length; i++) { var current = new int[b.Length + 1]; for (var j = 1; j <= b.Length; j++) if (a[i - 1] == b[j - 1]) { current[j] = previous[j - 1] + 1; if (current[j] > best) { best = current[j]; end = i; } } previous = current; } return a.Substring(end - best, best); }
}
