package mathalg

func GCD(a, b int) int {
	if a < 0 {
		a = -a
	}
	if b < 0 {
		b = -b
	}
	for b != 0 {
		a, b = b, a%b
	}
	return a
}
func LCM(a, b int) int {
	if a == 0 || b == 0 {
		return 0
	}
	r := a / GCD(a, b) * b
	if r < 0 {
		r = -r
	}
	return r
}

type ExtendedGCDResult struct{ GCD, X, Y int }

func ExtendedGCD(a, b int) ExtendedGCDResult {
	if b == 0 {
		return ExtendedGCDResult{a, 1, 0}
	}
	r := ExtendedGCD(b, a%b)
	q := a / b
	if a%b != 0 && (a < 0) != (b < 0) {
		q--
	}
	return ExtendedGCDResult{r.GCD, r.Y, r.X - q*r.Y}
}
func ModInverse(a, m int) (int, bool) {
	r := ExtendedGCD((a%m+m)%m, m)
	return (r.X%m + m) % m, r.GCD == 1
}
