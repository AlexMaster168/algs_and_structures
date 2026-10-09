package mathalg

import "math/big"

func SieveOfEratosthenes(n int) []int {
	r := []int{}
	if n < 2 {
		return r
	}
	c := make([]bool, n+1)
	for i := 2; i <= n; i++ {
		if c[i] {
			continue
		}
		r = append(r, i)
		for j := i * i; j <= n; j += i {
			c[j] = true
		}
	}
	return r
}

type SieveResult struct{ Primes, SmallestFactor []int }

func LinearSieve(n int) SieveResult {
	s := make([]int, n+1)
	p := []int{}
	for i := 2; i <= n; i++ {
		if s[i] == 0 {
			s[i] = i
			p = append(p, i)
		}
		for _, v := range p {
			if v > s[i] || i*v > n {
				break
			}
			s[i*v] = v
		}
	}
	return SieveResult{p, s}
}
func IsPrime(n int) bool {
	if n < 2 {
		return false
	}
	if n < 4 {
		return true
	}
	if n%2 == 0 || n%3 == 0 {
		return false
	}
	for i := 5; i <= n/i; i += 6 {
		if n%i == 0 || n%(i+2) == 0 {
			return false
		}
	}
	return true
}
func MillerRabin(n *big.Int) bool {
	if n.Cmp(big.NewInt(2)) < 0 {
		return false
	}
	ps := []int64{2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37}
	for _, p := range ps {
		b := big.NewInt(p)
		if n.Cmp(b) == 0 {
			return true
		}
		if new(big.Int).Mod(n, b).Sign() == 0 {
			return false
		}
	}
	nm := new(big.Int).Sub(n, big.NewInt(1))
	d := new(big.Int).Set(nm)
	r := 0
	for d.Bit(0) == 0 {
		d.Rsh(d, 1)
		r++
	}
	for _, a := range ps {
		x := ModPow(big.NewInt(a), d, n)
		if x.Cmp(big.NewInt(1)) == 0 || x.Cmp(nm) == 0 {
			continue
		}
		pass := false
		for i := 1; i < r; i++ {
			x.Mod(x.Mul(x, x), n)
			if x.Cmp(nm) == 0 {
				pass = true
				break
			}
		}
		if !pass {
			return false
		}
	}
	return true
}
func PrimeFactors(n int) map[int]int {
	r := map[int]int{}
	for p := 2; p <= n/p; p++ {
		for n%p == 0 {
			r[p]++
			n /= p
		}
	}
	if n > 1 {
		r[n]++
	}
	return r
}
func Divisors(n int) []int {
	l, h := []int{}, []int{}
	for i := 1; i <= n/i; i++ {
		if n%i != 0 {
			continue
		}
		l = append(l, i)
		if i != n/i {
			h = append(h, n/i)
		}
	}
	for i := len(h) - 1; i >= 0; i-- {
		l = append(l, h[i])
	}
	return l
}
func EulerPhi(n int) int {
	r := n
	for p := range PrimeFactors(n) {
		r -= r / p
	}
	return r
}
