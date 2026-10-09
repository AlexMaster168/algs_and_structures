package mathalg

import "strings"

const digits = "0123456789abcdefghijklmnopqrstuvwxyz"

func ToBase(v, b int) string {
	if b < 2 || b > 36 {
		panic("invalid base")
	}
	if v == 0 {
		return "0"
	}
	negative := v < 0
	if negative {
		v = -v
	}
	r := ""
	for v > 0 {
		r = string(digits[v%b]) + r
		v /= b
	}
	if negative {
		return "-" + r
	}
	return r
}
func FromBase(s string, b int) int {
	negative := strings.HasPrefix(s, "-")
	if negative {
		s = s[1:]
	}
	r := 0
	for _, c := range strings.ToLower(s) {
		d := strings.IndexRune(digits, c)
		if d < 0 || d >= b {
			panic("invalid digit")
		}
		r = r*b + d
	}
	if negative {
		return -r
	}
	return r
}
func ToRoman(v int) string {
	if v < 1 || v > 3999 {
		panic("invalid roman value")
	}
	amounts := []int{1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1}
	symbols := []string{"M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"}
	r := ""
	for i, a := range amounts {
		for v >= a {
			r += symbols[i]
			v -= a
		}
	}
	return r
}
func FromRoman(s string) int {
	m := map[byte]int{'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000}
	r := 0
	for i := range s {
		v := m[s[i]]
		next := 0
		if i+1 < len(s) {
			next = m[s[i+1]]
		}
		if v < next {
			r -= v
		} else {
			r += v
		}
	}
	return r
}
