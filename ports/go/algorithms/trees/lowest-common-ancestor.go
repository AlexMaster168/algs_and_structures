package trees

import "math/bits"

type LowestCommonAncestor struct {
	depth []int
	up    [][]int
}

func NewLowestCommonAncestor(tree [][]int, roots ...int) *LowestCommonAncestor {
	root := 0
	if len(roots) > 0 {
		root = roots[0]
	}
	if len(tree) == 0 || root < 0 || root >= len(tree) {
		panic("invalid root")
	}
	levels := max(1, bits.Len(uint(len(tree))))
	result := &LowestCommonAncestor{depth: make([]int, len(tree)), up: make([][]int, levels)}
	for i := range result.depth {
		result.depth[i] = -1
	}
	for k := range result.up {
		result.up[k] = make([]int, len(tree))
		for v := range tree {
			result.up[k][v] = root
		}
	}
	queue := []int{root}
	result.depth[root] = 0
	for head := 0; head < len(queue); head++ {
		v := queue[head]
		for _, child := range tree[v] {
			if result.depth[child] != -1 {
				continue
			}
			result.depth[child] = result.depth[v] + 1
			result.up[0][child] = v
			queue = append(queue, child)
		}
	}
	for k := 1; k < levels; k++ {
		for v := range tree {
			result.up[k][v] = result.up[k-1][result.up[k-1][v]]
		}
	}
	return result
}
func (l *LowestCommonAncestor) Ancestor(vertex, steps int) int {
	for k := 0; k < len(l.up) && steps > 0; k, steps = k+1, steps>>1 {
		if steps&1 != 0 {
			vertex = l.up[k][vertex]
		}
	}
	return vertex
}
func (l *LowestCommonAncestor) LCA(a, b int) int {
	if l.depth[a] < l.depth[b] {
		a, b = b, a
	}
	a = l.Ancestor(a, l.depth[a]-l.depth[b])
	if a == b {
		return a
	}
	for k := len(l.up) - 1; k >= 0; k-- {
		if l.up[k][a] != l.up[k][b] {
			a, b = l.up[k][a], l.up[k][b]
		}
	}
	return l.up[0][a]
}
func (l *LowestCommonAncestor) Distance(a, b int) int {
	return l.depth[a] + l.depth[b] - 2*l.depth[l.LCA(a, b)]
}
