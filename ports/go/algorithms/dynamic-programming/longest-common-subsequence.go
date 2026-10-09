package dp

import "algs/shared"

func LongestCommonSubsequence(x, y string) string {
	a, b := shared.Units(x), shared.Units(y)
	t := make([][]int, len(a)+1)
	for i := range t {
		t[i] = make([]int, len(b)+1)
	}
	for i, c := range a {
		for j, d := range b {
			if c == d {
				t[i+1][j+1] = t[i][j] + 1
			} else {
				t[i+1][j+1] = max(t[i][j+1], t[i+1][j])
			}
		}
	}
	r := []uint16{}
	for i, j := len(a), len(b); i > 0 && j > 0; {
		if a[i-1] == b[j-1] {
			r = append(r, a[i-1])
			i--
			j--
		} else if t[i-1][j] >= t[i][j-1] {
			i--
		} else {
			j--
		}
	}
	for i, j := 0, len(r)-1; i < j; i, j = i+1, j-1 {
		r[i], r[j] = r[j], r[i]
	}
	return shared.Text(r)
}
func LongestCommonSubstring(x, y string) string {
	a, b := shared.Units(x), shared.Units(y)
	p := make([]int, len(b)+1)
	best, end := 0, 0
	for i, c := range a {
		r := make([]int, len(b)+1)
		for j, d := range b {
			if c == d {
				r[j+1] = p[j] + 1
				if r[j+1] > best {
					best, end = r[j+1], i+1
				}
			}
		}
		p = r
	}
	return shared.Text(a[end-best : end])
}
