package dp

func WordBreak(s string, dict []string) ([]string, bool) {
	words := map[string]bool{}
	m := 0
	for _, w := range dict {
		words[w] = true
		m = max(m, len(w))
	}
	p := make([]int, len(s)+1)
	r := make([]bool, len(s)+1)
	r[0] = true
	for e := 1; e <= len(s); e++ {
		for b := max(0, e-m); b < e; b++ {
			if r[b] && words[s[b:e]] {
				r[e] = true
				p[e] = b
				break
			}
		}
	}
	if !r[len(s)] {
		return nil, false
	}
	out := []string{}
	for e := len(s); e > 0; e = p[e] {
		out = append(out, s[p[e]:e])
	}
	for i, j := 0, len(out)-1; i < j; i, j = i+1, j-1 {
		out[i], out[j] = out[j], out[i]
	}
	return out, true
}
