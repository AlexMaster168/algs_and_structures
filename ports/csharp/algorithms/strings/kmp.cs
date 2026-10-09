namespace Algorithms.Strings;
public static partial class Strings
{
    public static int[] PrefixFunction(string pattern) { var pi = new int[pattern.Length]; for (var i = 1; i < pattern.Length; i++) { var k = pi[i - 1]; while (k > 0 && pattern[i] != pattern[k]) k = pi[k - 1]; if (pattern[i] == pattern[k]) k++; pi[i] = k; } return pi; }
    public static int[] KmpSearch(string text, string pattern) { if (pattern.Length == 0) return []; var pi = PrefixFunction(pattern); var matches = new List<int>(); var k = 0; for (var i = 0; i < text.Length; i++) { while (k > 0 && text[i] != pattern[k]) k = pi[k - 1]; if (text[i] == pattern[k]) k++; if (k == pattern.Length) { matches.Add(i - k + 1); k = pi[k - 1]; } } return matches.ToArray(); }
}
