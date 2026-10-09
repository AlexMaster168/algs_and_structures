namespace Algorithms.DynamicProgramming;
public static partial class Dynamic
{
    public static string[]? WordBreak(string text, IEnumerable<string> dictionary) { var words = dictionary.ToHashSet(); var max = words.Count == 0 ? 0 : words.Max(w => w.Length); var previous = new int[text.Length + 1]; var reachable = new bool[text.Length + 1]; reachable[0] = true; for (var end = 1; end <= text.Length; end++) for (var start = Math.Max(0, end - max); start < end; start++) if (reachable[start] && words.Contains(text[start..end])) { reachable[end] = true; previous[end] = start; break; } if (!reachable[text.Length]) return null; var parts = new List<string>(); for (var end = text.Length; end > 0; end = previous[end]) parts.Add(text[previous[end]..end]); parts.Reverse(); return parts.ToArray(); }
}
