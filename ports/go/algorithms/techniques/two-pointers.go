package techniques

import "algs/algorithms/sorting"

func TwoSumSorted(a []float64, t float64) ([2]int, bool) {
	l, r := 0, len(a)-1
	for l < r {
		s := a[l] + a[r]
		if s == t {
			return [2]int{l, r}, true
		}
		if s < t {
			l++
		} else {
			r--
		}
	}
	return [2]int{}, false
}
func TwoSum(a []float64, t float64) ([2]int, bool) {
	s := map[float64]int{}
	for i, v := range a {
		if j, ok := s[t-v]; ok {
			return [2]int{j, i}, true
		}
		s[v] = i
	}
	return [2]int{}, false
}
func ThreeSum(a []float64, targets ...float64) [][3]float64 {
	t := 0.0
	if len(targets) > 0 {
		t = targets[0]
	}
	a = sorting.QuickSort(a)
	out := [][3]float64{}
	for i := 0; i < len(a)-2; i++ {
		if i > 0 && a[i] == a[i-1] {
			continue
		}
		l, r := i+1, len(a)-1
		for l < r {
			s := a[i] + a[l] + a[r]
			if s < t {
				l++
			} else if s > t {
				r--
			} else {
				out = append(out, [3]float64{a[i], a[l], a[r]})
				for l < r && a[l] == a[l+1] {
					l++
				}
				for l < r && a[r] == a[r-1] {
					r--
				}
				l++
				r--
			}
		}
	}
	return out
}
func ContainerWithMostWater(a []float64) float64 {
	b := 0.0
	for l, r := 0, len(a)-1; l < r; {
		b = max(b, min(a[l], a[r])*float64(r-l))
		if a[l] < a[r] {
			l++
		} else {
			r--
		}
	}
	return b
}
func RemoveDuplicatesSorted(a *[]float64) int {
	w := 0
	for i, v := range *a {
		if i == 0 || v != (*a)[w-1] {
			(*a)[w] = v
			w++
		}
	}
	*a = (*a)[:w]
	return w
}
func DutchNationalFlag(a []float64, p float64) []float64 {
	l, m, h := 0, 0, len(a)-1
	for m <= h {
		if a[m] < p {
			a[l], a[m] = a[m], a[l]
			l++
			m++
		} else if a[m] > p {
			a[m], a[h] = a[h], a[m]
			h--
		} else {
			m++
		}
	}
	return a
}
func HasCycleFloyd[T comparable](start T, next func(T) (T, bool)) bool {
	s, f := start, start
	for {
		n, ok := next(f)
		if !ok {
			return false
		}
		f, ok = next(n)
		if !ok {
			return false
		}
		s, ok = next(s)
		if !ok {
			return false
		}
		if f == s {
			return true
		}
	}
}
