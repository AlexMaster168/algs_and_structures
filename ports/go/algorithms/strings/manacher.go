package strings

import "algs/shared"

func LongestPalindromicSubstring(s string) string {
	a := shared.Units(s)
	if len(a) < 2 {
		return s
	}
	t := []int{-2, -1}
	for _, c := range a {
		t = append(t, int(c), -1)
	}
	t = append(t, -3)
	radius := make([]int, len(t))
	center, right, best := 0, 0, 0
	for i := 1; i < len(t)-1; i++ {
		if i < right {
			radius[i] = min(right-i, radius[2*center-i])
		}
		for t[i+radius[i]+1] == t[i-radius[i]-1] {
			radius[i]++
		}
		if i+radius[i] > right {
			center, right = i, i+radius[i]
		}
		if radius[i] > radius[best] {
			best = i
		}
	}
	start := (best - radius[best]) / 2
	return shared.Text(a[start : start+radius[best]])
}
