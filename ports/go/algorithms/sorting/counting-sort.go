package sorting

func CountingSort(input []int) []int {
	if len(input) == 0 {
		return []int{}
	}
	lo, hi := input[0], input[0]
	for _, v := range input {
		lo = min(lo, v)
		hi = max(hi, v)
	}
	counts := make([]int, hi-lo+1)
	for _, v := range input {
		counts[v-lo]++
	}
	for i := 1; i < len(counts); i++ {
		counts[i] += counts[i-1]
	}
	out := make([]int, len(input))
	for i := len(input) - 1; i >= 0; i-- {
		v := input[i]
		counts[v-lo]--
		out[counts[v-lo]] = v
	}
	return out
}
