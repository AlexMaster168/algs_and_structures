package randomized

import "math/rand/v2"

func randomFunction(functions []func() float64) func() float64 {
	if len(functions) > 0 && functions[0] != nil {
		return functions[0]
	}
	return rand.Float64
}
func FisherYatesShuffle[T any](input []T, functions ...func() float64) []T {
	random := randomFunction(functions)
	a := append([]T{}, input...)
	for i := len(a) - 1; i > 0; i-- {
		j := int(random() * float64(i+1))
		a[i], a[j] = a[j], a[i]
	}
	return a
}
func ReservoirSample[T any](stream []T, size int, functions ...func() float64) []T {
	if size < 0 {
		panic("negative sample size")
	}
	random := randomFunction(functions)
	sample := []T{}
	for i, item := range stream {
		if len(sample) < size {
			sample = append(sample, item)
		} else {
			j := int(random() * float64(i+1))
			if j < size {
				sample[j] = item
			}
		}
	}
	return sample
}
func Mulberry32(seed uint32) func() float64 {
	state := seed
	return func() float64 {
		state += 0x6d2b79f5
		t := state
		t = (t ^ (t >> 15)) * (t | 1)
		t ^= t + (t^(t>>7))*(t|61)
		return float64(t^(t>>14)) / 4294967296
	}
}
func MonteCarloPi(samples int, functions ...func() float64) float64 {
	if samples <= 0 {
		panic("sample count must be positive")
	}
	random := randomFunction(functions)
	inside := 0
	for i := 0; i < samples; i++ {
		x, y := random(), random()
		if x*x+y*y <= 1 {
			inside++
		}
	}
	return 4 * float64(inside) / float64(samples)
}
