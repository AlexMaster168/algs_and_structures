package graphs

type GraphEdge[V comparable] struct {
	From, To V
	Weight   float64
}
type Graph[V comparable] struct {
	Directed bool
	adj      map[V]map[V]float64
	vertices []V
	order    map[V][]V
}

func NewGraph[V comparable](directed ...bool) *Graph[V] {
	d := false
	if len(directed) > 0 {
		d = directed[0]
	}
	return &Graph[V]{Directed: d, adj: map[V]map[V]float64{}, order: map[V][]V{}}
}
func (g *Graph[V]) VertexCount() int { return len(g.adj) }
func (g *Graph[V]) EdgeCount() int   { return len(g.Edges()) }
func (g *Graph[V]) AddVertex(v V) *Graph[V] {
	if _, ok := g.adj[v]; !ok {
		g.adj[v] = map[V]float64{}
		g.vertices = append(g.vertices, v)
	}
	return g
}
func (g *Graph[V]) AddEdge(a, b V, weights ...float64) *Graph[V] {
	w := 1.0
	if len(weights) > 0 {
		w = weights[0]
	}
	g.AddVertex(a).AddVertex(b)
	put := func(a, b V) {
		if _, ok := g.adj[a][b]; !ok {
			g.order[a] = append(g.order[a], b)
		}
		g.adj[a][b] = w
	}
	put(a, b)
	if !g.Directed {
		put(b, a)
	}
	return g
}
func (g *Graph[V]) RemoveEdge(a, b V) bool {
	if !g.HasEdge(a, b) {
		return false
	}
	remove := func(a, b V) {
		delete(g.adj[a], b)
		o := g.order[a]
		for i, v := range o {
			if v == b {
				g.order[a] = append(o[:i], o[i+1:]...)
				break
			}
		}
	}
	remove(a, b)
	if !g.Directed {
		remove(b, a)
	}
	return true
}
func (g *Graph[V]) RemoveVertex(v V) bool {
	if !g.HasVertex(v) {
		return false
	}
	for _, a := range g.vertices {
		g.RemoveEdge(a, v)
	}
	delete(g.adj, v)
	delete(g.order, v)
	for i, a := range g.vertices {
		if a == v {
			g.vertices = append(g.vertices[:i], g.vertices[i+1:]...)
			break
		}
	}
	return true
}
func (g *Graph[V]) HasVertex(v V) bool            { _, ok := g.adj[v]; return ok }
func (g *Graph[V]) HasEdge(a, b V) bool           { _, ok := g.adj[a][b]; return ok }
func (g *Graph[V]) Weight(a, b V) (float64, bool) { v, ok := g.adj[a][b]; return v, ok }
func (g *Graph[V]) Neighbors(v V) []V             { return append([]V{}, g.order[v]...) }
func (g *Graph[V]) Degree(v V) int                { return len(g.adj[v]) }
func (g *Graph[V]) Vertices() []V                 { return append([]V{}, g.vertices...) }
func (g *Graph[V]) Edges() []GraphEdge[V] {
	r := []GraphEdge[V]{}
	seen := map[V]bool{}
	for _, a := range g.vertices {
		for _, b := range g.order[a] {
			if !g.Directed && seen[b] {
				continue
			}
			r = append(r, GraphEdge[V]{a, b, g.adj[a][b]})
		}
		seen[a] = true
	}
	return r
}
func (g *Graph[V]) ToAdjacencyMatrix() ([]V, [][]float64) {
	vs := g.Vertices()
	idx := map[V]int{}
	m := make([][]float64, len(vs))
	for i, v := range vs {
		idx[v] = i
		m[i] = make([]float64, len(vs))
	}
	for _, a := range vs {
		for b, w := range g.adj[a] {
			m[idx[a]][idx[b]] = w
		}
	}
	return vs, m
}
func (g *Graph[V]) ToAdjacencyList() ([]V, [][]int) {
	vs := g.Vertices()
	idx := map[V]int{}
	for i, v := range vs {
		idx[v] = i
	}
	r := make([][]int, len(vs))
	for i, v := range vs {
		r[i] = []int{}
		for _, n := range g.order[v] {
			r[i] = append(r[i], idx[n])
		}
	}
	return vs, r
}
