package greedy

import (
	"algs/algorithms/dynamic-programming"
	"sort"
)

func FractionalKnapsack(items []dp.KnapsackItem, capacity float64) float64 {
	sorted := append([]dp.KnapsackItem{}, items...)
	for _, item := range sorted {
		if item.Weight <= 0 {
			panic("weights must be positive")
		}
	}
	sort.SliceStable(sorted, func(i, j int) bool {
		return sorted[i].Value/float64(sorted[i].Weight) > sorted[j].Value/float64(sorted[j].Weight)
	})
	value := 0.0
	for _, item := range sorted {
		if capacity <= 0 {
			break
		}
		taken := min(float64(item.Weight), capacity)
		value += item.Value / float64(item.Weight) * taken
		capacity -= taken
	}
	return value
}
