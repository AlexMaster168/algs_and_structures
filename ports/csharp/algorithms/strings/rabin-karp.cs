namespace Algorithms.Strings;
public static partial class Strings
{
    public static int[] RabinKarp(string text, string pattern) { var m = pattern.Length; if (m == 0 || m > text.Length) return []; const long mod = 1000000007; long power = 1, ph = 0, wh = 0; for (var i = 1; i < m; i++) power = power * 256 % mod; for (var i = 0; i < m; i++) { ph = (ph * 256 + pattern[i]) % mod; wh = (wh * 256 + text[i]) % mod; } var matches = new List<int>(); for (var start = 0; ; start++) { if (wh == ph && text.AsSpan(start, m).SequenceEqual(pattern.AsSpan())) matches.Add(start); if (start + m >= text.Length) break; wh = (wh - text[start] * power % mod + mod) % mod; wh = (wh * 256 + text[start + m]) % mod; } return matches.ToArray(); }
}
