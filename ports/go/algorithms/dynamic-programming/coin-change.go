package dp

type CoinResult struct {
	Count int
	Coins []int
}

func MinCoins(coins []int, amount int) *CoinResult {
	best, last := make([]int, amount+1), make([]int, amount+1)
	for i := 1; i <= amount; i++ {
		best[i] = amount + 1
		last[i] = -1
		for _, c := range coins {
			if c <= 0 {
				panic("invalid coin")
			}
			if c <= i && best[i-c]+1 < best[i] {
				best[i] = best[i-c] + 1
				last[i] = c
			}
		}
	}
	if best[amount] > amount {
		return nil
	}
	r := &CoinResult{Count: best[amount], Coins: []int{}}
	for s := amount; s > 0; s -= last[s] {
		r.Coins = append(r.Coins, last[s])
	}
	return r
}
func CoinChangeWays(coins []int, amount int) int {
	w := make([]int, amount+1)
	w[0] = 1
	for _, c := range coins {
		if c <= 0 {
			panic("invalid coin")
		}
		for s := c; s <= amount; s++ {
			w[s] += w[s-c]
		}
	}
	return w[amount]
}
