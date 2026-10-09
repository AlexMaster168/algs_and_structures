package graphs

type DisjointSet struct {
	parent, sizes []int
	sets          int
}

func NewDisjointSet(n int) *DisjointSet {
	p, s := make([]int, n), make([]int, n)
	for i := range p {
		p[i] = i
		s[i] = 1
	}
	return &DisjointSet{p, s, n}
}
func (d *DisjointSet) Count() int { return d.sets }
func (d *DisjointSet) Find(x int) int {
	r := x
	for d.parent[r] != r {
		r = d.parent[r]
	}
	for d.parent[x] != r {
		n := d.parent[x]
		d.parent[x] = r
		x = n
	}
	return r
}
func (d *DisjointSet) Union(a, b int) bool {
	a, b = d.Find(a), d.Find(b)
	if a == b {
		return false
	}
	if d.sizes[a] < d.sizes[b] {
		a, b = b, a
	}
	d.parent[b] = a
	d.sizes[a] += d.sizes[b]
	d.sets--
	return true
}
func (d *DisjointSet) Connected(a, b int) bool { return d.Find(a) == d.Find(b) }
func (d *DisjointSet) SizeOf(x int) int        { return d.sizes[d.Find(x)] }
