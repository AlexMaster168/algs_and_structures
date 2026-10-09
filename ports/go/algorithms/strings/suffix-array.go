package strings

import (
	"algs/algorithms/sorting"
	"algs/shared"
)

func SuffixArray(s string) []int {
	a := shared.Units(s)
	n := len(a)
	rank, sa := make([]int, n), make([]int, n)
	for i, c := range a {
		rank[i] = int(c)
		sa[i] = i
	}
	for k := 1; ; k *= 2 {
		key := func(i int) (int, int) {
			b := -1
			if i+k < n {
				b = rank[i+k]
			}
			return rank[i], b
		}
		sa = sorting.MergeSort(sa, func(i, j int) int {
			x, y := key(i)
			u, v := key(j)
			if x != u {
				return x - u
			}
			return y - v
		})
		next := make([]int, n)
		for i := 1; i < n; i++ {
			x, y := key(sa[i-1])
			u, v := key(sa[i])
			next[sa[i]] = next[sa[i-1]]
			if x != u || y != v {
				next[sa[i]]++
			}
		}
		rank = next
		if n == 0 || rank[sa[n-1]] == n-1 {
			break
		}
	}
	return sa
}
func LCPArray(s string, sa []int) []int {
	a := shared.Units(s)
	n := len(a)
	rank := make([]int, n)
	for i, v := range sa {
		rank[v] = i
	}
	r := make([]int, max(0, n-1))
	h := 0
	for i := 0; i < n; i++ {
		if rank[i] == 0 {
			h = 0
			continue
		}
		j := sa[rank[i]-1]
		for i+h < n && j+h < n && a[i+h] == a[j+h] {
			h++
		}
		r[rank[i]-1] = h
		if h > 0 {
			h--
		}
	}
	return r
}
func CountDistinctSubstrings(s string) int {
	n := len(shared.Units(s))
	r := n * (n + 1) / 2
	for _, v := range LCPArray(s, SuffixArray(s)) {
		r -= v
	}
	return r
}
