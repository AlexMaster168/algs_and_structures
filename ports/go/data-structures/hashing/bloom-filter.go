package hashing

import "math"

type BloomFilter struct {
	BitCount, HashCount int
	bits                []byte
}

func NewBloomFilter(n int, rates ...float64) *BloomFilter {
	p := 0.01
	if len(rates) > 0 {
		p = rates[0]
	}
	if n <= 0 || p <= 0 || p >= 1 {
		panic("invalid bloom options")
	}
	b := max(8, int(math.Ceil(-float64(n)*math.Log(p)/(math.Ln2*math.Ln2))))
	h := max(1, int(math.Round(float64(b)/float64(n)*math.Ln2)))
	return &BloomFilter{b, h, make([]byte, (b+7)/8)}
}
func (b *BloomFilter) positions(s string) []int {
	a, c := uint64(FNV1a(s)), uint64(FNV1a(s, 0x5bd1e995)|1)
	r := make([]int, b.HashCount)
	for i := range r {
		r[i] = int((a + uint64(i)*c) % uint64(b.BitCount))
	}
	return r
}
func (b *BloomFilter) Add(s string) *BloomFilter {
	for _, p := range b.positions(s) {
		b.bits[p>>3] |= 1 << uint(p&7)
	}
	return b
}
func (b *BloomFilter) MightContain(s string) bool {
	for _, p := range b.positions(s) {
		if b.bits[p>>3]&(1<<uint(p&7)) == 0 {
			return false
		}
	}
	return true
}
