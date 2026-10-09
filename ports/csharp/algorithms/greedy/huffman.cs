using System.Text;
using Algorithms.DataStructures.Heaps;
namespace Algorithms.Greedy;

public sealed record HuffmanEncoded(string Encoded, Dictionary<string, string> Codes);
public static partial class Greedy
{
    private sealed record HuffmanNode(int Weight, int Order, string? Symbol = null, HuffmanNode? Left = null, HuffmanNode? Right = null);
    public static Dictionary<string, string> HuffmanCodes(string text)
    {
        var frequencies = new Dictionary<string, int>(); foreach (var rune in text.EnumerateRunes()) { var symbol = rune.ToString(); frequencies[symbol] = frequencies.GetValueOrDefault(symbol) + 1; }
        var codes = new Dictionary<string, string>(); if (frequencies.Count == 0) return codes; if (frequencies.Count == 1) { codes[frequencies.Keys.First()] = "0"; return codes; }
        var heap = new BinaryHeap<HuffmanNode>((a, b) => a.Weight == b.Weight ? a.Order.CompareTo(b.Order) : a.Weight.CompareTo(b.Weight)); var order = 0;
        foreach (var (symbol, weight) in frequencies) heap.Push(new HuffmanNode(weight, order++, symbol));
        while (heap.Size > 1) { var left = heap.Pop()!; var right = heap.Pop()!; heap.Push(new HuffmanNode(left.Weight + right.Weight, order++, Left: left, Right: right)); }
        void Assign(HuffmanNode node, string code) { if (node.Symbol is not null) { codes[node.Symbol] = code; return; } Assign(node.Left!, code + "0"); Assign(node.Right!, code + "1"); }
        Assign(heap.Pop()!, ""); return codes;
    }
    public static HuffmanEncoded HuffmanEncode(string text) { var codes = HuffmanCodes(text); return new(string.Concat(text.EnumerateRunes().Select(r => codes[r.ToString()])), codes); }
    public static string HuffmanDecode(string encoded, IReadOnlyDictionary<string, string> codes)
    {
        var reverse = codes.ToDictionary(p => p.Value, p => p.Key); var result = new StringBuilder(); var buffer = "";
        foreach (var bit in encoded) { buffer += bit; if (reverse.TryGetValue(buffer, out var symbol)) { result.Append(symbol); buffer = ""; } } return result.ToString();
    }
}
