using System.Collections;
using Algorithms.Shared;
namespace Algorithms.DataStructures.Trees;
public class AVLTree<T> : IEnumerable<T>
{
    private sealed class Node(T value) { internal T Value = value; internal Node? Left, Right; internal int Height = 1; }
    private Node? root; private readonly Comparator<T> compare;
    public AVLTree(Comparator<T>? compare = null) { this.compare = compare ?? Compare.DefaultCompare; }
    public int Size { get; private set; }
    private static int H(Node? n) => n?.Height ?? 0;
    private static int Balance(Node n) => H(n.Left) - H(n.Right);
    private static void Refresh(Node n) => n.Height = 1 + Math.Max(H(n.Left), H(n.Right));
    private static Node RotateRight(Node n) { var p = n.Left!; n.Left = p.Right; p.Right = n; Refresh(n); Refresh(p); return p; }
    private static Node RotateLeft(Node n) { var p = n.Right!; n.Right = p.Left; p.Left = n; Refresh(n); Refresh(p); return p; }
    private static Node Rebalance(Node n) { Refresh(n); var b = Balance(n); if (b > 1) { if (Balance(n.Left!) < 0) n.Left = RotateLeft(n.Left!); return RotateRight(n); } if (b < -1) { if (Balance(n.Right!) > 0) n.Right = RotateRight(n.Right!); return RotateLeft(n); } return n; }
    public int Height() => H(root);
    public bool Has(T value) { var n = root; while (n is not null) { var c = compare(value, n.Value); if (c == 0) return true; n = c < 0 ? n.Left : n.Right; } return false; }
    public bool Insert(T value) { if (Has(value)) return false; root = InsertInto(root, value); Size++; return true; }
    private Node InsertInto(Node? n, T value) { if (n is null) return new(value); if (compare(value, n.Value) < 0) n.Left = InsertInto(n.Left, value); else n.Right = InsertInto(n.Right, value); return Rebalance(n); }
    public bool Delete(T value) { if (!Has(value)) return false; root = Remove(root, value); Size--; return true; }
    private Node? Remove(Node? n, T value) { if (n is null) return null; var c = compare(value, n.Value); if (c < 0) n.Left = Remove(n.Left, value); else if (c > 0) n.Right = Remove(n.Right, value); else { if (n.Left is null || n.Right is null) return n.Left ?? n.Right; var s = n.Right; while (s.Left is not null) s = s.Left; n.Value = s.Value; n.Right = Remove(n.Right, s.Value); } return Rebalance(n); }
    public bool IsBalanced() { bool Check(Node? n) => n is null || Math.Abs(Balance(n)) <= 1 && Check(n.Left) && Check(n.Right); return Check(root); }
    public T[] ToArray() => this.ToList().ToArray();
    public IEnumerator<T> GetEnumerator() { var stack = new Stack<Node>(); var n = root; while (n is not null || stack.Count > 0) { while (n is not null) { stack.Push(n); n = n.Left; } n = stack.Pop(); yield return n.Value; n = n.Right; } }
    IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();
}
