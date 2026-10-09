package mathalg

import "math/big"

func Factorial(n int) *big.Int {
	if n < 0 {
		panic("negative factorial")
	}
	r := big.NewInt(1)
	for i := 2; i <= n; i++ {
		r.Mul(r, big.NewInt(int64(i)))
	}
	return r
}
func Binomial(n, k int) *big.Int {
	if k < 0 || k > n {
		return big.NewInt(0)
	}
	k = min(k, n-k)
	r := big.NewInt(1)
	for i := 1; i <= k; i++ {
		r.Mul(r, big.NewInt(int64(n-k+i)))
		r.Quo(r, big.NewInt(int64(i)))
	}
	return r
}
func PascalTriangle(rows int) [][]int {
	r := [][]int{}
	for i := 0; i < rows; i++ {
		a := make([]int, i+1)
		a[0], a[i] = 1, 1
		for j := 1; j < i; j++ {
			a[j] = r[i-1][j-1] + r[i-1][j]
		}
		r = append(r, a)
	}
	return r
}
func Catalan(n int) *big.Int { return new(big.Int).Quo(Binomial(2*n, n), big.NewInt(int64(n+1))) }
func NextPermutation(a []int) bool {
	i := len(a) - 2
	for i >= 0 && a[i] >= a[i+1] {
		i--
	}
	if i < 0 {
		for l, r := 0, len(a)-1; l < r; l, r = l+1, r-1 {
			a[l], a[r] = a[r], a[l]
		}
		return false
	}
	j := len(a) - 1
	for a[j] <= a[i] {
		j--
	}
	a[i], a[j] = a[j], a[i]
	for l, r := i+1, len(a)-1; l < r; l, r = l+1, r-1 {
		a[l], a[r] = a[r], a[l]
	}
	return true
}
