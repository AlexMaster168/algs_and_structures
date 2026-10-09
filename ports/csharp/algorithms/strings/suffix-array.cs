using Algorithms.Sorting;
namespace Algorithms.Strings;
public static partial class Strings
{
    public static int[] SuffixArray(string s) { var n = s.Length; var rank = s.Select(c => (int)c).ToArray(); var suffixes = Enumerable.Range(0, n).ToArray(); for (var k = 1; ; k *= 2) { (int, int) Key(int i) => (rank[i], i + k < n ? rank[i + k] : -1); suffixes = Sort.MergeSort(suffixes, (a, b) => Key(a).CompareTo(Key(b))); var next = new int[n]; for (var i = 1; i < n; i++) next[suffixes[i]] = next[suffixes[i - 1]] + (Key(suffixes[i - 1]) != Key(suffixes[i]) ? 1 : 0); rank = next; if (n == 0 || rank[suffixes[^1]] == n - 1) break; } return suffixes; }
    public static int[] LcpArray(string s, IReadOnlyList<int> suffixes) { var n = s.Length; var rank = new int[n]; for (var i = 0; i < n; i++) rank[suffixes[i]] = i; var lcp = new int[Math.Max(0, n - 1)]; var h = 0; for (var i = 0; i < n; i++) { if (rank[i] == 0) { h = 0; continue; } var j = suffixes[rank[i] - 1]; while (i + h < n && j + h < n && s[i + h] == s[j + h]) h++; lcp[rank[i] - 1] = h; if (h > 0) h--; } return lcp; }
    public static double CountDistinctSubstrings(string s) => (double)s.Length * (s.Length + 1) / 2 - LcpArray(s, SuffixArray(s)).Sum();
}
