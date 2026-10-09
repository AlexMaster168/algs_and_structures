package mathalg

import (
	"math"
	"math/big"
)

func FastPower(b float64, e int) float64 {
	if e < 0 {
		return 1 / FastPower(b, -e)
	}
	r := 1.0
	for e > 0 {
		if e&1 != 0 {
			r *= b
		}
		b *= b
		e /= 2
	}
	return r
}
func ModPow(base, exponent, modulus *big.Int) *big.Int {
	if modulus.Sign() <= 0 {
		panic("invalid modulus")
	}
	b := new(big.Int).Mod(base, modulus)
	e := new(big.Int).Set(exponent)
	r := new(big.Int).Mod(big.NewInt(1), modulus)
	for e.Sign() > 0 {
		if e.Bit(0) == 1 {
			r.Mod(r.Mul(r, b), modulus)
		}
		b.Mod(b.Mul(b, b), modulus)
		e.Rsh(e, 1)
	}
	return r
}
func IntegerSqrt(n int) int {
	if n < 0 {
		panic("negative square root")
	}
	if n < 2 {
		return n
	}
	x, y := n, n/2+n%2
	for y < x {
		x = y
		y = (x + n/x) / 2
	}
	return x
}
func NewtonSqrt(n float64, eps ...float64) float64 {
	if n < 0 {
		panic("negative square root")
	}
	if n == 0 {
		return 0
	}
	e := 1e-12
	if len(eps) > 0 {
		e = eps[0]
	}
	x := n
	for math.Abs(x*x-n) > e*n {
		x = (x + n/x) / 2
	}
	return x
}
