namespace Algorithms.Trees;

public sealed class TreeNode<T>(T value, TreeNode<T>? left = null, TreeNode<T>? right = null)
{
    public T Value { get; set; } = value;
    public TreeNode<T>? Left { get; set; } = left;
    public TreeNode<T>? Right { get; set; } = right;
}
public static class BinaryTree
{
    public static TreeNode<T> TreeNode<T>(T value, TreeNode<T>? left = null, TreeNode<T>? right = null) => new(value, left, right);
    public static TreeNode<T>? FromLevelOrder<T>(IReadOnlyList<T?> values) where T : struct
    {
        if (values.Count == 0 || values[0] is null) return null;
        var root = new TreeNode<T>(values[0]!.Value); var queue = new List<TreeNode<T>> { root }; var index = 1;
        for (var head = 0; head < queue.Count && index < values.Count; head++)
        {
            var node = queue[head];
            if (values[index++] is T left) { node.Left = new(left); queue.Add(node.Left); }
            if (index < values.Count && values[index++] is T right) { node.Right = new(right); queue.Add(node.Right); }
        }
        return root;
    }
    public static T[] PreOrder<T>(TreeNode<T>? root)
    {
        var result = new List<T>(); var stack = new System.Collections.Generic.Stack<TreeNode<T>>(); if (root is not null) stack.Push(root);
        while (stack.TryPop(out var node)) { result.Add(node.Value); if (node.Right is not null) stack.Push(node.Right); if (node.Left is not null) stack.Push(node.Left); }
        return result.ToArray();
    }
    public static T[] InOrder<T>(TreeNode<T>? root)
    {
        var result = new List<T>(); var stack = new System.Collections.Generic.Stack<TreeNode<T>>(); var current = root;
        while (current is not null || stack.Count > 0) { while (current is not null) { stack.Push(current); current = current.Left; } current = stack.Pop(); result.Add(current.Value); current = current.Right; }
        return result.ToArray();
    }
    public static T[] PostOrder<T>(TreeNode<T>? root)
    {
        var result = new List<T>(); var stack = new System.Collections.Generic.Stack<TreeNode<T>>(); if (root is not null) stack.Push(root);
        while (stack.TryPop(out var node)) { result.Add(node.Value); if (node.Left is not null) stack.Push(node.Left); if (node.Right is not null) stack.Push(node.Right); }
        result.Reverse(); return result.ToArray();
    }
    public static T[][] LevelOrder<T>(TreeNode<T>? root)
    {
        var result = new List<T[]>(); var level = root is null ? new List<TreeNode<T>>() : [root];
        while (level.Count > 0) { result.Add(level.Select(n => n.Value).ToArray()); level = level.SelectMany(n => new[] { n.Left, n.Right }).OfType<TreeNode<T>>().ToList(); }
        return result.ToArray();
    }
    public static int MaxDepth<T>(TreeNode<T>? root) => root is null ? 0 : 1 + Math.Max(MaxDepth(root.Left), MaxDepth(root.Right));
    public static double? MaxValue(TreeNode<double>? root) => root is null ? null : PreOrder(root).Max();
    public static bool IsValidBst(TreeNode<double>? root, double low = double.NegativeInfinity, double high = double.PositiveInfinity) => root is null || root.Value > low && root.Value < high && IsValidBst(root.Left, low, root.Value) && IsValidBst(root.Right, root.Value, high);
    public static TreeNode<T>? InvertTree<T>(TreeNode<T>? root) { if (root is not null) (root.Left, root.Right) = (InvertTree(root.Right), InvertTree(root.Left)); return root; }
    public static TreeNode<double>? LowestCommonAncestorBst(TreeNode<double>? root, double a, double b)
    {
        while (root is not null) { if (a < root.Value && b < root.Value) root = root.Left; else if (a > root.Value && b > root.Value) root = root.Right; else return root; } return null;
    }
}
