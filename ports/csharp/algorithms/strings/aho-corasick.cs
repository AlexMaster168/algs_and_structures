namespace Algorithms.Strings;
public sealed class AhoCorasick
{
    private sealed class Node { internal readonly Dictionary<char, int> Next = []; internal int Fail; internal readonly List<int> Output = []; }
    private readonly List<Node> nodes = [new()]; private readonly string[] patterns;
    public AhoCorasick(IReadOnlyList<string> patterns) { this.patterns = patterns.ToArray(); for (var i = 0; i < patterns.Count; i++) Add(patterns[i], i); Build(); }
    private void Add(string pattern, int index) { if (pattern.Length == 0) return; var state = 0; foreach (var c in pattern) { if (!nodes[state].Next.TryGetValue(c, out var next)) { next = nodes.Count; nodes.Add(new()); nodes[state].Next[c] = next; } state = next; } nodes[state].Output.Add(index); }
    private int Transition(int state, char c) { while (true) { if (nodes[state].Next.TryGetValue(c, out var next)) return next; if (state == 0) return 0; state = nodes[state].Fail; } }
    private void Build() { var queue = nodes[0].Next.Values.ToList(); for (var h = 0; h < queue.Count; h++) { var state = queue[h]; foreach (var (c, child) in nodes[state].Next) { var fail = Transition(nodes[state].Fail, c); nodes[child].Fail = fail; nodes[child].Output.AddRange(nodes[fail].Output); queue.Add(child); } } }
    public (string Pattern, int Index)[] Search(string text) { var matches = new List<(string, int)>(); var state = 0; for (var i = 0; i < text.Length; i++) { state = Transition(state, text[i]); foreach (var p in nodes[state].Output) matches.Add((patterns[p], i - patterns[p].Length + 1)); } return matches.ToArray(); }
}
