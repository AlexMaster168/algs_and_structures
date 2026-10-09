package rangequeries

import "math"

type SqrtDecomposition struct {
	values, blockSums []float64
	blockSize         int
}

func NewSqrtDecomposition(a []float64) *SqrtDecomposition {
	n := max(1, int(math.Ceil(math.Sqrt(float64(len(a))))))
	s := &SqrtDecomposition{append([]float64{}, a...), make([]float64, (len(a)+n-1)/n), n}
	for i, v := range a {
		s.blockSums[i/n] += v
	}
	return s
}
func (s *SqrtDecomposition) Update(i int, v float64) {
	s.blockSums[i/s.blockSize] += v - s.values[i]
	s.values[i] = v
}
func (s *SqrtDecomposition) RangeSum(l, r int) float64 {
	sum := 0.0
	i := l
	for i <= r && i%s.blockSize != 0 {
		sum += s.values[i]
		i++
	}
	for i+s.blockSize-1 <= r {
		sum += s.blockSums[i/s.blockSize]
		i += s.blockSize
	}
	for i <= r {
		sum += s.values[i]
		i++
	}
	return sum
}
