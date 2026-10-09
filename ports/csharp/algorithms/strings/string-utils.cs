using System.Text.RegularExpressions;
using Algorithms.Sorting;
namespace Algorithms.Strings;
public static partial class Strings
{
    public static bool IsBalanced(string input) { var stack = new Stack<char>(); foreach (var c in input) { if (c is '(' or '[' or '{') stack.Push(c); else if (c is ')' or ']' or '}') { var expected = c == ')' ? '(' : c == ']' ? '[' : '{'; if (!stack.TryPop(out var v) || v != expected) return false; } } return stack.Count == 0; }
    public static bool IsPalindrome(string input) { var s = Regex.Replace(input.ToLowerInvariant(), @"[^\p{L}\p{N}]", ""); for (int i = 0, j = s.Length - 1; i < j; i++, j--) if (s[i] != s[j]) return false; return true; }
    public static bool IsAnagram(string a, string b) { if (a.Length != b.Length) return false; var counts = new Dictionary<char, int>(); foreach (var c in a) counts[c] = counts.GetValueOrDefault(c) + 1; foreach (var c in b) { if (counts.GetValueOrDefault(c) == 0) return false; counts[c]--; } return true; }
    public static string[][] GroupAnagrams(IReadOnlyList<string> words) { var groups = new Dictionary<string, List<string>>(); foreach (var w in words) { var key = new string(Sort.MergeSort(w.ToCharArray())); if (!groups.TryGetValue(key, out var g)) groups[key] = g = []; g.Add(w); } return groups.Values.Select(g => g.ToArray()).ToArray(); }
    public static string RunLengthEncode(string input) => Regex.Replace(input, @"(.)\1*", m => m.Length + m.Groups[1].Value, RegexOptions.Singleline);
    public static string RunLengthDecode(string input) => Regex.Replace(input, @"(\d+)(.)", m => string.Concat(Enumerable.Repeat(m.Groups[2].Value, int.Parse(m.Groups[1].Value))), RegexOptions.Singleline);
    public static string ReverseWords(string input) => string.Join(" ", Regex.Split(input.Trim(), @"\s+").Reverse());
}
