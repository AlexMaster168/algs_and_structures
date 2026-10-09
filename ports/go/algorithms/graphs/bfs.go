package graphs

type BfsResult struct{ Order, Distance, Parent []int }

func BFS(g AdjacencyList, start int) BfsResult {
	d, p := filled(len(g), -1), filled(len(g), -1)
	q := []int{start}
	d[start] = 0
	for h := 0; h < len(q); h++ {
		v := q[h]
		for _, w := range g[v] {
			if d[w] != -1 {
				continue
			}
			d[w] = d[v] + 1
			p[w] = v
			q = append(q, w)
		}
	}
	return BfsResult{q, d, p}
}
func ShortestPathUnweighted(g AdjacencyList, s, t int) []int {
	r := BFS(g, s)
	if r.Distance[t] < 0 {
		return nil
	}
	return ReconstructPath(r.Parent, t)
}
func GridShortestPath(g []string, s, t [2]int, walls ...byte) int {
	wall := byte('#')
	if len(walls) > 0 {
		wall = walls[0]
	}
	d := make([][]int, len(g))
	for i := range g {
		d[i] = filled(len(g[i]), -1)
	}
	q := [][2]int{s}
	d[s[0]][s[1]] = 0
	for h := 0; h < len(q); h++ {
		v := q[h]
		if v == t {
			return d[v[0]][v[1]]
		}
		for _, dir := range [][2]int{{1, 0}, {-1, 0}, {0, 1}, {0, -1}} {
			r, c := v[0]+dir[0], v[1]+dir[1]
			if r < 0 || r >= len(g) || c < 0 || c >= len(g[r]) || g[r][c] == wall || d[r][c] != -1 {
				continue
			}
			d[r][c] = d[v[0]][v[1]] + 1
			q = append(q, [2]int{r, c})
		}
	}
	return -1
}
