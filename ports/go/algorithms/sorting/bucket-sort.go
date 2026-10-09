package sorting

import "math"

func BucketSort(input []float64, counts ...int) []float64 {
	if len(input) < 2 {
		return append([]float64{}, input...)
	}
	n := max(1, int(math.Round(math.Sqrt(float64(len(input))))))
	if len(counts) > 0 {
		n = counts[0]
	}
	if n < 1 {
		panic("invalid bucket count")
	}
	lo, hi := input[0], input[0]
	for _, v := range input {
		lo = math.Min(lo, v)
		hi = math.Max(hi, v)
	}
	if lo == hi {
		return append([]float64{}, input...)
	}
	b := make([][]float64, n)
	for _, v := range input {
		i := min(n-1, int((v-lo)/((hi-lo)/float64(n))))
		b[i] = append(b[i], v)
	}
	out := []float64{}
	for _, a := range b {
		out = append(out, InsertionSort(a)...)
	}
	return out
}
