package dp

type KnapsackItem struct {
	Weight int
	Value  float64
}
type KnapsackResult struct {
	Value float64
	Items []int
}

func Knapsack01(items []KnapsackItem, capacity int) KnapsackResult {
	t := make([][]float64, len(items)+1)
	for i := range t {
		t[i] = make([]float64, capacity+1)
	}
	for i, v := range items {
		for w := 0; w <= capacity; w++ {
			t[i+1][w] = t[i][w]
			if v.Weight <= w {
				t[i+1][w] = max(t[i+1][w], t[i][w-v.Weight]+v.Value)
			}
		}
	}
	r := KnapsackResult{t[len(items)][capacity], []int{}}
	w := capacity
	for i := len(items); i > 0; i-- {
		if t[i][w] != t[i-1][w] {
			r.Items = append(r.Items, i-1)
			w -= items[i-1].Weight
		}
	}
	for i, j := 0, len(r.Items)-1; i < j; i, j = i+1, j-1 {
		r.Items[i], r.Items[j] = r.Items[j], r.Items[i]
	}
	return r
}
func UnboundedKnapsack(items []KnapsackItem, capacity int) float64 {
	b := make([]float64, capacity+1)
	for w := 1; w <= capacity; w++ {
		for _, v := range items {
			if v.Weight <= w {
				b[w] = max(b[w], b[w-v.Weight]+v.Value)
			}
		}
	}
	return b[capacity]
}
