using System.Collections;
using Algorithms.Shared;
namespace Algorithms.DataStructures.Trees;
public class BSTNode<T>(T value) { public T Value { get; set; } = value; public BSTNode<T>? Left { get; set; } public BSTNode<T>? Right { get; set; } }
public class BinarySearchTree<T> : IEnumerable<T>
{
    private BSTNode<T>? root; private readonly Comparator<T> compare;
    public BinarySearchTree(Comparator<T>? compare = null) { this.compare = compare ?? Compare.DefaultCompare; }
    public int Size { get; private set; }
    public BSTNode<T>? RootNode => root;
    public static BinarySearchTree<T> From(IEnumerable<T> values, Comparator<T>? compare = null) { var t = new BinarySearchTree<T>(compare); foreach (var v in values) t.Insert(v); return t; }
    public bool Insert(T value) { if (root is null) { root = new(value); Size++; return true; } var n = root; while (true) { var c = compare(value, n.Value); if (c == 0) return false; if (c < 0) { if (n.Left is null) { n.Left = new(value); break; } n = n.Left; } else { if (n.Right is null) { n.Right = new(value); break; } n = n.Right; } } Size++; return true; }
    public bool Has(T value) { var n = root; while (n is not null) { var c = compare(value, n.Value); if (c == 0) return true; n = c < 0 ? n.Left : n.Right; } return false; }
    public bool Delete(T value) { if (!Has(value)) return false; root = Remove(root, value); Size--; return true; }
    private BSTNode<T>? Remove(BSTNode<T>? n, T value) { if (n is null) return null; var c = compare(value, n.Value); if (c < 0) n.Left = Remove(n.Left, value); else if (c > 0) n.Right = Remove(n.Right, value); else { if (n.Left is null) return n.Right; if (n.Right is null) return n.Left; var s = n.Right; while (s.Left is not null) s = s.Left; n.Value = s.Value; n.Right = Remove(n.Right, s.Value); } return n; }
    public T? Min() { var n = root; while (n?.Left is not null) n = n.Left; return n is null ? default : n.Value; }
    public T? Max() { var n = root; while (n?.Right is not null) n = n.Right; return n is null ? default : n.Value; }
    public T? Floor(T value) { var n = root; T? result = default; while (n is not null) { var c = compare(value, n.Value); if (c == 0) return n.Value; if (c < 0) n = n.Left; else { result = n.Value; n = n.Right; } } return result; }
    public T? Ceil(T value) { var n = root; T? result = default; while (n is not null) { var c = compare(value, n.Value); if (c == 0) return n.Value; if (c > 0) n = n.Right; else { result = n.Value; n = n.Left; } } return result; }
    public int Height() { int Measure(BSTNode<T>? n) => n is null ? 0 : 1 + Math.Max(Measure(n.Left), Measure(n.Right)); return Measure(root); }
    public T[] ToArray() => this.ToList().ToArray();
    public IEnumerator<T> GetEnumerator() { var stack = new Stack<BSTNode<T>>(); var n = root; while (n is not null || stack.Count > 0) { while (n is not null) { stack.Push(n); n = n.Left; } n = stack.Pop(); yield return n.Value; n = n.Right; } }
    IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();
}
