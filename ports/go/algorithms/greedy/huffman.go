package greedy

import (
	"algs/data-structures/heaps"
	"strings"
)

type huffmanNode struct {
	weight, order int
	symbol        string
	left, right   *huffmanNode
}
type HuffmanEncoded struct {
	Encoded string
	Codes   map[string]string
}

func HuffmanCodes(text string) map[string]string {
	frequencies := map[string]int{}
	symbols := []string{}
	for _, r := range text {
		s := string(r)
		if frequencies[s] == 0 {
			symbols = append(symbols, s)
		}
		frequencies[s]++
	}
	codes := map[string]string{}
	if len(symbols) == 0 {
		return codes
	}
	if len(symbols) == 1 {
		codes[symbols[0]] = "0"
		return codes
	}
	heap := heaps.NewBinaryHeap(func(a, b *huffmanNode) int {
		if a.weight != b.weight {
			return a.weight - b.weight
		}
		return a.order - b.order
	})
	order := 0
	for _, s := range symbols {
		heap.Push(&huffmanNode{weight: frequencies[s], order: order, symbol: s})
		order++
	}
	for heap.Size() > 1 {
		left, _ := heap.Pop()
		right, _ := heap.Pop()
		heap.Push(&huffmanNode{weight: left.weight + right.weight, order: order, left: left, right: right})
		order++
	}
	var assign func(*huffmanNode, string)
	assign = func(node *huffmanNode, code string) {
		if node.left == nil {
			codes[node.symbol] = code
			return
		}
		assign(node.left, code+"0")
		assign(node.right, code+"1")
	}
	root, _ := heap.Pop()
	assign(root, "")
	return codes
}
func HuffmanEncode(text string) HuffmanEncoded {
	codes := HuffmanCodes(text)
	var encoded strings.Builder
	for _, r := range text {
		encoded.WriteString(codes[string(r)])
	}
	return HuffmanEncoded{encoded.String(), codes}
}
func HuffmanDecode(encoded string, codes map[string]string) string {
	reverse := map[string]string{}
	for symbol, code := range codes {
		reverse[code] = symbol
	}
	var result strings.Builder
	buffer := ""
	for _, bit := range encoded {
		buffer += string(bit)
		if symbol, ok := reverse[buffer]; ok {
			result.WriteString(symbol)
			buffer = ""
		}
	}
	return result.String()
}
