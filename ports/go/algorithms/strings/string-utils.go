package strings

import (
	"algs/algorithms/sorting"
	"strconv"
	"strings"
	"unicode"
)

func IsBalanced(s string) bool {
	q := []rune{}
	pairs := map[rune]rune{')': '(', ']': '[', '}': '{'}
	for _, c := range s {
		if c == '(' || c == '[' || c == '{' {
			q = append(q, c)
		} else if p, ok := pairs[c]; ok {
			if len(q) == 0 || q[len(q)-1] != p {
				return false
			}
			q = q[:len(q)-1]
		}
	}
	return len(q) == 0
}
func IsPalindrome(s string) bool {
	a := []rune{}
	for _, c := range strings.ToLower(s) {
		if unicode.IsLetter(c) || unicode.IsNumber(c) {
			a = append(a, c)
		}
	}
	for i, j := 0, len(a)-1; i < j; i, j = i+1, j-1 {
		if a[i] != a[j] {
			return false
		}
	}
	return true
}
func IsAnagram(a, b string) bool {
	c := map[rune]int{}
	for _, r := range a {
		c[r]++
	}
	for _, r := range b {
		c[r]--
		if c[r] < 0 {
			return false
		}
	}
	for _, n := range c {
		if n != 0 {
			return false
		}
	}
	return true
}
func GroupAnagrams(words []string) [][]string {
	r := [][]string{}
	idx := map[string]int{}
	for _, w := range words {
		k := string(sorting.QuickSort([]rune(w)))
		i, ok := idx[k]
		if !ok {
			i = len(r)
			idx[k] = i
			r = append(r, []string{})
		}
		r[i] = append(r[i], w)
	}
	return r
}
func RunLengthEncode(s string) string {
	a := []rune(s)
	var b strings.Builder
	for i := 0; i < len(a); {
		j := i + 1
		for j < len(a) && a[j] == a[i] {
			j++
		}
		b.WriteString(strconv.Itoa(j - i))
		b.WriteRune(a[i])
		i = j
	}
	return b.String()
}
func RunLengthDecode(s string) string {
	a := []rune(s)
	var b strings.Builder
	for i := 0; i < len(a); {
		start := i
		for i < len(a) && a[i] >= '0' && a[i] <= '9' {
			i++
		}
		if start == i || i == len(a) {
			b.WriteString(string(a[start:]))
			break
		}
		n, e := strconv.Atoi(string(a[start:i]))
		if e != nil {
			panic(e)
		}
		b.WriteString(strings.Repeat(string(a[i]), n))
		i++
	}
	return b.String()
}
func ReverseWords(s string) string {
	a := strings.Fields(s)
	for i, j := 0, len(a)-1; i < j; i, j = i+1, j-1 {
		a[i], a[j] = a[j], a[i]
	}
	return strings.Join(a, " ")
}
