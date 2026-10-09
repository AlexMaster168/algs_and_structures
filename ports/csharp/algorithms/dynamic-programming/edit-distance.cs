namespace Algorithms.DynamicProgramming;
public static partial class Dynamic
{
    public static int EditDistance(string source, string target) { var previous = Enumerable.Range(0, target.Length + 1).ToArray(); for (var i = 1; i <= source.Length; i++) { var current = new int[target.Length + 1]; current[0] = i; for (var j = 1; j <= target.Length; j++) current[j] = Math.Min(Math.Min(previous[j] + 1, current[j - 1] + 1), previous[j - 1] + (source[i - 1] == target[j - 1] ? 0 : 1)); previous = current; } return previous[target.Length]; }
}
