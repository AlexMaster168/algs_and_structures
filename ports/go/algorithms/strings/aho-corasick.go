package strings

import "algs/shared"

type ahoNode struct {
	next   map[uint16]int
	fail   int
	output []int
}
type AhoCorasick struct {
	nodes    []ahoNode
	patterns []string
	lengths  []int
}
type Match struct {
	Pattern string `json:"pattern"`
	Index   int    `json:"index"`
}

func NewAhoCorasick(patterns []string) *AhoCorasick {
	a := &AhoCorasick{nodes: []ahoNode{{next: map[uint16]int{}}}, patterns: append([]string{}, patterns...), lengths: make([]int, len(patterns))}
	for i, p := range patterns {
		u := shared.Units(p)
		a.lengths[i] = len(u)
		if len(u) == 0 {
			continue
		}
		s := 0
		for _, c := range u {
			n, ok := a.nodes[s].next[c]
			if !ok {
				n = len(a.nodes)
				a.nodes = append(a.nodes, ahoNode{next: map[uint16]int{}})
				a.nodes[s].next[c] = n
			}
			s = n
		}
		a.nodes[s].output = append(a.nodes[s].output, i)
	}
	q := []int{}
	for _, v := range a.nodes[0].next {
		q = append(q, v)
	}
	for h := 0; h < len(q); h++ {
		s := q[h]
		for c, n := range a.nodes[s].next {
			f := a.transition(a.nodes[s].fail, c)
			a.nodes[n].fail = f
			a.nodes[n].output = append(a.nodes[n].output, a.nodes[f].output...)
			q = append(q, n)
		}
	}
	return a
}
func (a *AhoCorasick) transition(s int, c uint16) int {
	for {
		if n, ok := a.nodes[s].next[c]; ok {
			return n
		}
		if s == 0 {
			return 0
		}
		s = a.nodes[s].fail
	}
}
func (a *AhoCorasick) Search(text string) []Match {
	r := []Match{}
	s := 0
	for i, c := range shared.Units(text) {
		s = a.transition(s, c)
		for _, p := range a.nodes[s].output {
			r = append(r, Match{a.patterns[p], i - a.lengths[p] + 1})
		}
	}
	return r
}
