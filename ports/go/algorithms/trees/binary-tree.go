package trees

import "math"

type TreeNode[T any] struct {
	Value       T
	Left, Right *TreeNode[T]
}

func NewTreeNode[T any](value T, children ...*TreeNode[T]) *TreeNode[T] {
	node := &TreeNode[T]{Value: value}
	if len(children) > 0 {
		node.Left = children[0]
	}
	if len(children) > 1 {
		node.Right = children[1]
	}
	return node
}
func FromLevelOrder[T any](values []*T) *TreeNode[T] {
	if len(values) == 0 || values[0] == nil {
		return nil
	}
	root := NewTreeNode(*values[0])
	queue := []*TreeNode[T]{root}
	index := 1
	for head := 0; head < len(queue) && index < len(values); head++ {
		node := queue[head]
		if values[index] != nil {
			node.Left = NewTreeNode(*values[index])
			queue = append(queue, node.Left)
		}
		index++
		if index < len(values) {
			if values[index] != nil {
				node.Right = NewTreeNode(*values[index])
				queue = append(queue, node.Right)
			}
			index++
		}
	}
	return root
}
func PreOrder[T any](root *TreeNode[T]) []T {
	result := []T{}
	stack := []*TreeNode[T]{}
	if root != nil {
		stack = append(stack, root)
	}
	for len(stack) > 0 {
		node := stack[len(stack)-1]
		stack = stack[:len(stack)-1]
		result = append(result, node.Value)
		if node.Right != nil {
			stack = append(stack, node.Right)
		}
		if node.Left != nil {
			stack = append(stack, node.Left)
		}
	}
	return result
}
func InOrder[T any](root *TreeNode[T]) []T {
	result := []T{}
	stack := []*TreeNode[T]{}
	node := root
	for node != nil || len(stack) > 0 {
		for node != nil {
			stack = append(stack, node)
			node = node.Left
		}
		node = stack[len(stack)-1]
		stack = stack[:len(stack)-1]
		result = append(result, node.Value)
		node = node.Right
	}
	return result
}
func PostOrder[T any](root *TreeNode[T]) []T {
	result := []T{}
	var walk func(*TreeNode[T])
	walk = func(node *TreeNode[T]) {
		if node == nil {
			return
		}
		walk(node.Left)
		walk(node.Right)
		result = append(result, node.Value)
	}
	walk(root)
	return result
}
func LevelOrder[T any](root *TreeNode[T]) [][]T {
	result := [][]T{}
	level := []*TreeNode[T]{}
	if root != nil {
		level = append(level, root)
	}
	for len(level) > 0 {
		row := []T{}
		next := []*TreeNode[T]{}
		for _, node := range level {
			row = append(row, node.Value)
			if node.Left != nil {
				next = append(next, node.Left)
			}
			if node.Right != nil {
				next = append(next, node.Right)
			}
		}
		result = append(result, row)
		level = next
	}
	return result
}
func MaxDepth[T any](root *TreeNode[T]) int {
	if root == nil {
		return 0
	}
	return 1 + max(MaxDepth(root.Left), MaxDepth(root.Right))
}
func MaxValue(root *TreeNode[float64]) *float64 {
	if root == nil {
		return nil
	}
	best := root.Value
	for _, value := range PreOrder(root) {
		best = max(best, value)
	}
	return &best
}
func IsValidBst(root *TreeNode[float64], bounds ...float64) bool {
	low, high := math.Inf(-1), math.Inf(1)
	if len(bounds) > 0 {
		low = bounds[0]
	}
	if len(bounds) > 1 {
		high = bounds[1]
	}
	return root == nil || root.Value > low && root.Value < high && IsValidBst(root.Left, low, root.Value) && IsValidBst(root.Right, root.Value, high)
}
func InvertTree[T any](root *TreeNode[T]) *TreeNode[T] {
	if root != nil {
		root.Left, root.Right = InvertTree(root.Right), InvertTree(root.Left)
	}
	return root
}
func LowestCommonAncestorBst(root *TreeNode[float64], a, b float64) *TreeNode[float64] {
	for root != nil {
		if a < root.Value && b < root.Value {
			root = root.Left
		} else if a > root.Value && b > root.Value {
			root = root.Right
		} else {
			return root
		}
	}
	return nil
}
