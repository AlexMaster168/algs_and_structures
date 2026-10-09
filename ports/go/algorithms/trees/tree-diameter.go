package trees

import "algs/algorithms/graphs"

type TreeDiameterResult struct {
	Length int
	Path   []int
}

func TreeDiameter(tree [][]int) TreeDiameterResult {
	if len(tree) == 0 {
		return TreeDiameterResult{0, []int{}}
	}
	farthest := func(distance []int) int {
		best := 0
		for v, d := range distance {
			if d > distance[best] {
				best = v
			}
		}
		return best
	}
	first := farthest(graphs.BFS(tree, 0).Distance)
	result := graphs.BFS(tree, first)
	second := farthest(result.Distance)
	return TreeDiameterResult{result.Distance[second], graphs.ReconstructPath(result.Parent, second)}
}
