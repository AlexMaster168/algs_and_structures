package structures

type DisjointSet struct { parent, sizes []int }

func NewDisjointSet(size int) *DisjointSet {
	if size < 0 { panic("Invalid size") }
	d := &DisjointSet{make([]int, size), make([]int, size)}
	for i := range d.parent { d.parent[i] = i; d.sizes[i] = 1 }
	return d
}

func (d *DisjointSet) Find(value int) int {
	if value < 0 || value >= len(d.parent) { panic("Invalid index") }
	for value != d.parent[value] { d.parent[value] = d.parent[d.parent[value]]; value = d.parent[value] }
	return value
}

func (d *DisjointSet) Union(a, b int) bool {
	a, b = d.Find(a), d.Find(b)
	if a == b { return false }
	if d.sizes[a] < d.sizes[b] { a, b = b, a }
	d.parent[b] = a
	d.sizes[a] += d.sizes[b]
	return true
}
