package dp

import "math/big"

func FibonacciRecursive(n int) int {
	if n < 2 {
		return n
	}
	return FibonacciRecursive(n-1) + FibonacciRecursive(n-2)
}
func FibonacciMemo(n int) int {
	cache := map[int]int{}
	var f func(int) int
	f = func(n int) int {
		if n < 2 {
			return n
		}
		if v, ok := cache[n]; ok {
			return v
		}
		v := f(n-1) + f(n-2)
		cache[n] = v
		return v
	}
	return f(n)
}
func Fibonacci(n int) *big.Int {
	a, b := big.NewInt(0), big.NewInt(1)
	if n == 0 {
		return a
	}
	for i := 1; i < n; i++ {
		a, b = b, new(big.Int).Add(a, b)
	}
	return b
}
func FibonacciFast(n int) *big.Int {
	var pair func(int) (*big.Int, *big.Int)
	pair = func(k int) (*big.Int, *big.Int) {
		if k == 0 {
			return big.NewInt(0), big.NewInt(1)
		}
		a, b := pair(k / 2)
		c := new(big.Int).Mul(a, new(big.Int).Sub(new(big.Int).Lsh(new(big.Int).Set(b), 1), a))
		d := new(big.Int).Add(new(big.Int).Mul(a, a), new(big.Int).Mul(b, b))
		if k&1 != 0 {
			return d, new(big.Int).Add(c, d)
		}
		return c, d
	}
	a, _ := pair(n)
	return a
}
