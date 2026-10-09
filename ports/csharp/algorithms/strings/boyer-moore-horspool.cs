namespace Algorithms.Strings;
public static partial class Strings
{
    public static int[] BoyerMooreHorspool(string text, string pattern) { var m = pattern.Length; if (m == 0 || m > text.Length) return []; var shift = new Dictionary<char, int>(); for (var i = 0; i < m - 1; i++) shift[pattern[i]] = m - 1 - i; var matches = new List<int>(); var p = 0; while (p <= text.Length - m) { var j = m - 1; while (j >= 0 && text[p + j] == pattern[j]) j--; if (j < 0) matches.Add(p); p += shift.GetValueOrDefault(text[p + m - 1], m); } return matches.ToArray(); }
}
