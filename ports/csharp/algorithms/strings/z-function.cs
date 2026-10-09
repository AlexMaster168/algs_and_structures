namespace Algorithms.Strings;
public static partial class Strings
{
    public static int[] ZFunction(string s) { var z = new int[s.Length]; if (s.Length > 0) z[0] = s.Length; int left = 0, right = 0; for (var i = 1; i < s.Length; i++) { if (i < right) z[i] = Math.Min(right - i, z[i - left]); while (i + z[i] < s.Length && s[z[i]] == s[i + z[i]]) z[i]++; if (i + z[i] > right) { left = i; right = i + z[i]; } } return z; }
    public static int[] ZSearch(string text, string pattern) { if (pattern.Length == 0) return []; var z = ZFunction(pattern + '\0' + text); var result = new List<int>(); for (var i = pattern.Length + 1; i < z.Length; i++) if (z[i] >= pattern.Length) result.Add(i - pattern.Length - 1); return result.ToArray(); }
}
