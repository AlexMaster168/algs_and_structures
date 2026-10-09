package sorting

func RadixSort(input []int, bases ...int) []int {
	base := 10
	if len(bases) > 0 {
		base = bases[0]
	}
	if base < 2 {
		panic("invalid base")
	}
	neg, pos := []int{}, []int{}
	for _, v := range input {
		if v < 0 {
			neg = append(neg, -v)
		} else {
			pos = append(pos, v)
		}
	}
	part := func(a []int) []int {
		m := 0
		for _, v := range a {
			m = max(m, v)
		}
		for e := 1; m/e > 0; {
			b := make([][]int, base)
			for _, v := range a {
				d := v / e % base
				b[d] = append(b[d], v)
			}
			a = []int{}
			for _, s := range b {
				a = append(a, s...)
			}
			if e > m/base {
				break
			}
			e *= base
		}
		return a
	}
	neg = part(neg)
	out := make([]int, 0, len(input))
	for i := len(neg) - 1; i >= 0; i-- {
		out = append(out, -neg[i])
	}
	return append(out, part(pos)...)
}
