using System.Collections;
using Algorithms.Shared;
namespace Algorithms.DataStructures.Trees;
public class RedBlackTree<T> : IEnumerable<T>
{
    private sealed class Node { internal T Value; internal bool Red; internal Node Left, Right, Parent; internal Node(T value, bool red, Node? nil = null) { Value = value; Red = red; Left = Right = Parent = nil ?? this; } }
    private readonly Node nil = new(default!, false); private Node root; private readonly Comparator<T> compare;
    public int Size { get; private set; }
    public RedBlackTree(Comparator<T>? compare = null) { root = nil; this.compare = compare ?? Compare.DefaultCompare; }
    private Node Search(T value) { var n = root; while (n != nil) { var c = compare(value, n.Value); if (c == 0) return n; n = c < 0 ? n.Left : n.Right; } return nil; }
    public bool Has(T value) => Search(value) != nil;
    public bool Insert(T value)
    {
        var parent = nil; var current = root; while (current != nil) { parent = current; var c = compare(value, current.Value); if (c == 0) return false; current = c < 0 ? current.Left : current.Right; }
        var n = new Node(value, true, nil) { Parent = parent }; if (parent == nil) root = n; else if (compare(value, parent.Value) < 0) parent.Left = n; else parent.Right = n;
        FixInsert(n); Size++; return true;
    }
    private Node Minimum(Node n) { while (n.Left != nil) n = n.Left; return n; }
    private void Transplant(Node target, Node replacement) { if (target.Parent == nil) root = replacement; else if (target == target.Parent.Left) target.Parent.Left = replacement; else target.Parent.Right = replacement; replacement.Parent = target.Parent; }
    public bool Delete(T value)
    {
        var target = Search(value); if (target == nil) return false; var removed = target; var wasRed = removed.Red; Node replacement;
        if (target.Left == nil) { replacement = target.Right; Transplant(target, target.Right); }
        else if (target.Right == nil) { replacement = target.Left; Transplant(target, target.Left); }
        else { removed = Minimum(target.Right); wasRed = removed.Red; replacement = removed.Right; if (removed.Parent == target) replacement.Parent = removed; else { Transplant(removed, removed.Right); removed.Right = target.Right; removed.Right.Parent = removed; } Transplant(target, removed); removed.Left = target.Left; removed.Left.Parent = removed; removed.Red = target.Red; }
        if (!wasRed) FixDelete(replacement); Size--; return true;
    }
    private void RotateLeft(Node n) { var p = n.Right; n.Right = p.Left; if (p.Left != nil) p.Left.Parent = n; p.Parent = n.Parent; if (n.Parent == nil) root = p; else if (n == n.Parent.Left) n.Parent.Left = p; else n.Parent.Right = p; p.Left = n; n.Parent = p; }
    private void RotateRight(Node n) { var p = n.Left; n.Left = p.Right; if (p.Right != nil) p.Right.Parent = n; p.Parent = n.Parent; if (n.Parent == nil) root = p; else if (n == n.Parent.Right) n.Parent.Right = p; else n.Parent.Left = p; p.Right = n; n.Parent = p; }
    private void FixInsert(Node n)
    {
        while (n.Parent.Red)
        {
            var parent = n.Parent; var grand = parent.Parent;
            if (parent == grand.Left) { var uncle = grand.Right; if (uncle.Red) { parent.Red = uncle.Red = false; grand.Red = true; n = grand; continue; } if (n == parent.Right) { n = parent; RotateLeft(n); } n.Parent.Red = false; grand.Red = true; RotateRight(grand); }
            else { var uncle = grand.Left; if (uncle.Red) { parent.Red = uncle.Red = false; grand.Red = true; n = grand; continue; } if (n == parent.Left) { n = parent; RotateRight(n); } n.Parent.Red = false; grand.Red = true; RotateLeft(grand); }
        }
        root.Red = false;
    }
    private void FixDelete(Node n)
    {
        while (n != root && !n.Red)
        {
            if (n == n.Parent.Left)
            {
                var s = n.Parent.Right;
                if (s.Red) { s.Red = false; n.Parent.Red = true; RotateLeft(n.Parent); s = n.Parent.Right; }
                if (!s.Left.Red && !s.Right.Red) { s.Red = true; n = n.Parent; }
                else { if (!s.Right.Red) { s.Left.Red = false; s.Red = true; RotateRight(s); s = n.Parent.Right; } s.Red = n.Parent.Red; n.Parent.Red = false; s.Right.Red = false; RotateLeft(n.Parent); n = root; }
            }
            else
            {
                var s = n.Parent.Left;
                if (s.Red) { s.Red = false; n.Parent.Red = true; RotateRight(n.Parent); s = n.Parent.Left; }
                if (!s.Left.Red && !s.Right.Red) { s.Red = true; n = n.Parent; }
                else { if (!s.Left.Red) { s.Right.Red = false; s.Red = true; RotateLeft(s); s = n.Parent.Left; } s.Red = n.Parent.Red; n.Parent.Red = false; s.Left.Red = false; RotateRight(n.Parent); n = root; }
            }
        }
        n.Red = false;
    }
    public int Height() { int Measure(Node n) => n == nil ? 0 : 1 + Math.Max(Measure(n.Left), Measure(n.Right)); return Measure(root); }
    public bool IsValid() { if (root.Red) return false; int BlackHeight(Node n) { if (n == nil) return 1; if (n.Red && (n.Left.Red || n.Right.Red)) return -1; var l = BlackHeight(n.Left); var r = BlackHeight(n.Right); return l < 0 || r < 0 || l != r ? -1 : l + (n.Red ? 0 : 1); } return BlackHeight(root) >= 0; }
    public T[] ToArray() => this.ToList().ToArray();
    public IEnumerator<T> GetEnumerator() { var stack = new Stack<Node>(); var n = root; while (n != nil || stack.Count > 0) { while (n != nil) { stack.Push(n); n = n.Left; } n = stack.Pop(); yield return n.Value; n = n.Right; } }
    IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();
}
