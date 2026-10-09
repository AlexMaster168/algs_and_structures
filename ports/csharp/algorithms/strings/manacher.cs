namespace Algorithms.Strings;
public static partial class Strings
{
    public static string LongestPalindromicSubstring(string s)
    {
        if (s.Length < 2) return s; var t = new int[2 * s.Length + 3]; t[0] = -2; t[^1] = -3; for (var i = 1; i < t.Length - 1; i++) t[i] = (i & 1) == 1 ? -1 : s[(i - 2) / 2];
        var radius = new int[t.Length]; int center = 0, right = 0; for (var i = 1; i < t.Length - 1; i++) { if (i < right) radius[i] = Math.Min(right - i, radius[2 * center - i]); while (t[i + radius[i] + 1] == t[i - radius[i] - 1]) radius[i]++; if (i + radius[i] > right) { center = i; right = i + radius[i]; } }
        var best = 0; for (var i = 1; i < t.Length - 1; i++) if (radius[i] > radius[best]) best = i; return s.Substring((best - radius[best]) >> 1, radius[best]);
    }
}
