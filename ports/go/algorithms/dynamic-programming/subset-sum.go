package dp

func SubsetSum(a []int, target int) ([]int, bool) {
	by := make([]int, target+1)
	r := make([]bool, target+1)
	r[0] = true
	for i, v := range a {
		for s := target; s >= v; s-- {
			if !r[s] && r[s-v] {
				r[s] = true
				by[s] = i
			}
		}
	}
	if !r[target] {
		return nil, false
	}
	out := []int{}
	for s := target; s > 0; {
		v := a[by[s]]
		out = append(out, v)
		s -= v
	}
	for i, j := 0, len(out)-1; i < j; i, j = i+1, j-1 {
		out[i], out[j] = out[j], out[i]
	}
	return out, true
}
func CanPartition(a []int) bool {
	t := 0
	for _, v := range a {
		t += v
	}
	if t%2 != 0 {
		return false
	}
	_, ok := SubsetSum(a, t/2)
	return ok
}
