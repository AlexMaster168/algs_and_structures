package graphs

type AdjacencyList = [][]int
type WeightedEdge struct {
	To     int
	Weight float64
}
type WeightedAdjacencyList = [][]WeightedEdge
type Edge struct {
	From, To int
	Weight   float64
}

func ReconstructPath(parent []int, target int) []int {
	p := []int{}
	for v := target; v != -1; v = parent[v] {
		p = append(p, v)
	}
	reverse(p)
	return p
}
func reverse[T any](a []T) {
	for i, j := 0, len(a)-1; i < j; i, j = i+1, j-1 {
		a[i], a[j] = a[j], a[i]
	}
}
func ToUndirected(n int, edges [][2]int) [][]int {
	g := make([][]int, n)
	for i := range g {
		g[i] = []int{}
	}
	for _, e := range edges {
		g[e[0]] = append(g[e[0]], e[1])
		g[e[1]] = append(g[e[1]], e[0])
	}
	return g
}
func ToWeightedUndirected(n int, edges []Edge) [][]WeightedEdge {
	g := make([][]WeightedEdge, n)
	for i := range g {
		g[i] = []WeightedEdge{}
	}
	for _, e := range edges {
		g[e.From] = append(g[e.From], WeightedEdge{e.To, e.Weight})
		g[e.To] = append(g[e.To], WeightedEdge{e.From, e.Weight})
	}
	return g
}
func filled(n, v int) []int {
	a := make([]int, n)
	for i := range a {
		a[i] = v
	}
	return a
}
