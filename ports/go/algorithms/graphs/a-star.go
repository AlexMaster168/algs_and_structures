package graphs

import (
	"algs/data-structures/heaps"
	"fmt"
	"math"
)

type AStarNeighbor[N any] struct {
	Node N
	Cost float64
}
type AStarOptions[N any] struct {
	Start, Goal N
	Neighbors   func(N) []AStarNeighbor[N]
	Heuristic   func(N) float64
	Key         func(N) string
}
type AStarResult[N any] struct {
	Path []N
	Cost float64
}

func AStar[N any](o AStarOptions[N]) *AStarResult[N] {
	key := o.Key
	if key == nil {
		key = func(n N) string { return fmt.Sprint(n) }
	}
	best := map[string]float64{key(o.Start): 0}
	parent := map[string]N{}
	type entry struct {
		node           N
		cost, estimate float64
	}
	h := heaps.NewBinaryHeap(func(a, b entry) int {
		if a.estimate < b.estimate {
			return -1
		}
		if a.estimate > b.estimate {
			return 1
		}
		return 0
	})
	h.Push(entry{o.Start, 0, o.Heuristic(o.Start)})
	for !h.IsEmpty() {
		e, _ := h.Pop()
		k := key(e.node)
		if e.cost > best[k] {
			continue
		}
		if k == key(o.Goal) {
			p := []N{e.node}
			for {
				n, ok := parent[k]
				if !ok {
					break
				}
				p = append(p, n)
				k = key(n)
			}
			reverse(p)
			return &AStarResult[N]{p, e.cost}
		}
		for _, next := range o.Neighbors(e.node) {
			k := key(next.Node)
			c := e.cost + next.Cost
			old, ok := best[k]
			if !ok || c < old {
				best[k] = c
				parent[k] = e.node
				h.Push(entry{next.Node, c, c + o.Heuristic(next.Node)})
			}
		}
	}
	return nil
}

type Cell = [2]int

func AStarGrid(g []string, s, t Cell, walls ...byte) []Cell {
	wall := byte('#')
	if len(walls) > 0 {
		wall = walls[0]
	}
	r := AStar(AStarOptions[Cell]{Start: s, Goal: t, Key: func(c Cell) string { return fmt.Sprint(c) }, Heuristic: func(c Cell) float64 { return math.Abs(float64(c[0]-t[0])) + math.Abs(float64(c[1]-t[1])) }, Neighbors: func(c Cell) []AStarNeighbor[Cell] {
		r := []AStarNeighbor[Cell]{}
		for _, d := range []Cell{{1, 0}, {-1, 0}, {0, 1}, {0, -1}} {
			p := Cell{c[0] + d[0], c[1] + d[1]}
			if p[0] >= 0 && p[0] < len(g) && p[1] >= 0 && p[1] < len(g[p[0]]) && g[p[0]][p[1]] != wall {
				r = append(r, AStarNeighbor[Cell]{p, 1})
			}
		}
		return r
	}})
	if r == nil {
		return nil
	}
	return r.Path
}
