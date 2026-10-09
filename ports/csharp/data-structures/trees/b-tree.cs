using System.Collections;
using Algorithms.Shared;
namespace Algorithms.DataStructures.Trees;
public class BTree<T> : IEnumerable<T>
{
    private sealed class Node { internal List<T> Keys = []; internal List<Node> Children = []; internal bool IsLeaf => Children.Count == 0; }
    private Node root = new(); private readonly Comparator<T> compare;
    public int MinDegree { get; } public int Size { get; private set; }
    public BTree(int minDegree = 2, Comparator<T>? compare = null) { if (minDegree < 2) throw new ArgumentOutOfRangeException(nameof(minDegree)); MinDegree = minDegree; this.compare = compare ?? Compare.DefaultCompare; }
    private int LowerIndex(Node n, T value) { var l = 0; var h = n.Keys.Count; while (l < h) { var m = (l + h) >> 1; if (compare(n.Keys[m], value) < 0) l = m + 1; else h = m; } return l; }
    public int Height() { var h = 1; for (var n = root; !n.IsLeaf; n = n.Children[0]) h++; return h; }
    public bool Has(T value) { var n = root; while (true) { var i = LowerIndex(n, value); if (i < n.Keys.Count && compare(n.Keys[i], value) == 0) return true; if (n.IsLeaf) return false; n = n.Children[i]; } }
    public bool Insert(T value) { if (Has(value)) return false; if (root.Keys.Count == 2 * MinDegree - 1) { var r = new Node(); r.Children.Add(root); SplitChild(r, 0); root = r; } InsertNonFull(root, value); Size++; return true; }
    private void SplitChild(Node parent, int index) { var full = parent.Children[index]; var right = new Node { Keys = full.Keys.GetRange(MinDegree, full.Keys.Count - MinDegree) }; full.Keys.RemoveRange(MinDegree, full.Keys.Count - MinDegree); var median = full.Keys[^1]; full.Keys.RemoveAt(full.Keys.Count - 1); if (!full.IsLeaf) { right.Children = full.Children.GetRange(MinDegree, full.Children.Count - MinDegree); full.Children.RemoveRange(MinDegree, full.Children.Count - MinDegree); } parent.Keys.Insert(index, median); parent.Children.Insert(index + 1, right); }
    private void InsertNonFull(Node n, T value) { var i = LowerIndex(n, value); if (n.IsLeaf) { n.Keys.Insert(i, value); return; } if (n.Children[i].Keys.Count == 2 * MinDegree - 1) { SplitChild(n, i); if (compare(value, n.Keys[i]) > 0) i++; } InsertNonFull(n.Children[i], value); }
    public bool Delete(T value) { if (!Has(value)) return false; Remove(root, value); if (root.Keys.Count == 0 && !root.IsLeaf) root = root.Children[0]; Size--; return true; }
    private static T MaxKey(Node n) { while (!n.IsLeaf) n = n.Children[^1]; return n.Keys[^1]; }
    private static T MinKey(Node n) { while (!n.IsLeaf) n = n.Children[0]; return n.Keys[0]; }
    private static void Merge(Node n, int i) { var l = n.Children[i]; var r = n.Children[i + 1]; l.Keys.Add(n.Keys[i]); l.Keys.AddRange(r.Keys); l.Children.AddRange(r.Children); n.Keys.RemoveAt(i); n.Children.RemoveAt(i + 1); }
    private void Remove(Node n, T value)
    {
        var i = LowerIndex(n, value);
        if (i < n.Keys.Count && compare(n.Keys[i], value) == 0)
        {
            if (n.IsLeaf) { n.Keys.RemoveAt(i); return; } var l = n.Children[i]; var r = n.Children[i + 1];
            if (l.Keys.Count >= MinDegree) { var p = MaxKey(l); n.Keys[i] = p; Remove(l, p); }
            else if (r.Keys.Count >= MinDegree) { var s = MinKey(r); n.Keys[i] = s; Remove(r, s); }
            else { Merge(n, i); Remove(l, value); } return;
        }
        if (n.IsLeaf) return; var child = n.Children[i];
        if (child.Keys.Count < MinDegree)
        {
            var left = i > 0 ? n.Children[i - 1] : null; var right = i + 1 < n.Children.Count ? n.Children[i + 1] : null;
            if (left is not null && left.Keys.Count >= MinDegree) { child.Keys.Insert(0, n.Keys[i - 1]); n.Keys[i - 1] = left.Keys[^1]; left.Keys.RemoveAt(left.Keys.Count - 1); if (!left.IsLeaf) { child.Children.Insert(0, left.Children[^1]); left.Children.RemoveAt(left.Children.Count - 1); } }
            else if (right is not null && right.Keys.Count >= MinDegree) { child.Keys.Add(n.Keys[i]); n.Keys[i] = right.Keys[0]; right.Keys.RemoveAt(0); if (!right.IsLeaf) { child.Children.Add(right.Children[0]); right.Children.RemoveAt(0); } }
            else if (right is not null) Merge(n, i);
            else { Merge(n, i - 1); child = n.Children[i - 1]; }
        }
        Remove(child, value);
    }
    private static IEnumerable<T> Walk(Node n) { for (var i = 0; i < n.Keys.Count; i++) { if (!n.IsLeaf) foreach (var v in Walk(n.Children[i])) yield return v; yield return n.Keys[i]; } if (!n.IsLeaf) foreach (var v in Walk(n.Children[n.Keys.Count])) yield return v; }
    public T[] ToArray() => this.ToList().ToArray();
    public IEnumerator<T> GetEnumerator() => Walk(root).GetEnumerator();
    IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();
}
