package greedy

import "sort"

func CanReachEnd(jumps []int) bool {
	farthest := 0
	for i, jump := range jumps {
		if i > farthest {
			return false
		}
		farthest = max(farthest, i+jump)
	}
	return true
}
func MinJumps(jumps []int) int {
	count, currentEnd, farthest := 0, 0, 0
	for i := 0; i < len(jumps)-1; i++ {
		farthest = max(farthest, i+jumps[i])
		if i == currentEnd {
			if farthest <= i {
				return -1
			}
			count++
			currentEnd = farthest
		}
	}
	return count
}
func GreedyChange(amount int, denominations []int) []int {
	coins := append([]int{}, denominations...)
	sort.Sort(sort.Reverse(sort.IntSlice(coins)))
	result := []int{}
	for _, coin := range coins {
		if coin <= 0 {
			panic("coins must be positive")
		}
		for amount >= coin {
			result = append(result, coin)
			amount -= coin
		}
	}
	return result
}
