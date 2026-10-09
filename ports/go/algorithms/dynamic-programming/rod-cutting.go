package dp

type RodResult struct {
	Revenue float64
	Pieces  []int
}

func RodCutting(prices []float64, length int) RodResult {
	r, c := make([]float64, length+1), make([]int, length+1)
	for t := 1; t <= length; t++ {
		for p := 1; p <= min(t, len(prices)); p++ {
			v := prices[p-1] + r[t-p]
			if v > r[t] {
				r[t] = v
				c[t] = p
			}
		}
	}
	out := RodResult{r[length], []int{}}
	for s := length; s > 0 && c[s] > 0; s -= c[s] {
		out.Pieces = append(out.Pieces, c[s])
	}
	return out
}
