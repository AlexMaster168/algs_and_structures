using Algorithms.Sorting;
namespace Algorithms.DataStructures.Trees;
public class Trie
{
    private sealed class Node { internal readonly Dictionary<char, Node> Children = []; internal bool IsWord; internal int PassCount; }
    private readonly Node root = new(); public int Size { get; private set; }
    public static Trie From(IEnumerable<string> words) { var t = new Trie(); foreach (var w in words) t.Insert(w); return t; }
    private Node? Walk(string prefix) { var n = root; foreach (var c in prefix) { if (!n.Children.TryGetValue(c, out var next)) return null; n = next; } return n; }
    public bool Has(string word) => Walk(word)?.IsWord ?? false;
    public bool StartsWith(string prefix) => Walk(prefix) is not null;
    public int CountWithPrefix(string prefix) => Walk(prefix)?.PassCount ?? 0;
    public bool Insert(string word) { if (Has(word)) return false; var n = root; n.PassCount++; foreach (var c in word) { if (!n.Children.TryGetValue(c, out var next)) n.Children[c] = next = new(); next.PassCount++; n = next; } n.IsWord = true; Size++; return true; }
    public string[] WordsWithPrefix(string prefix) { var n = Walk(prefix); if (n is null) return []; var words = new List<string>(); void Collect(Node current, string path) { if (current.IsWord) words.Add(path); foreach (var c in Sort.MergeSort(current.Children.Keys.ToArray())) Collect(current.Children[c], path + c); } Collect(n, prefix); return words.ToArray(); }
    public bool Delete(string word) { if (!Has(word)) return false; var n = root; n.PassCount--; foreach (var c in word) { var next = n.Children[c]; if (--next.PassCount == 0) { n.Children.Remove(c); Size--; return true; } n = next; } n.IsWord = false; Size--; return true; }
}
