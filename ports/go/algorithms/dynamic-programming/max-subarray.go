package dp

type SubarrayResult struct {
	Sum        float64
	Start, End int
}

func MaxSubarray(a []float64) SubarrayResult {
	if len(a) == 0 {
		panic("empty array")
	}
	b := SubarrayResult{a[0], 0, 0}
	s, start := a[0], 0
	for i := 1; i < len(a); i++ {
		if s < 0 {
			s = a[i]
			start = i
		} else {
			s += a[i]
		}
		if s > b.Sum {
			b = SubarrayResult{s, start, i}
		}
	}
	return b
}
