package bits

func GetBit(v uint32, p uint) uint32    { return v >> (p & 31) & 1 }
func SetBit(v uint32, p uint) uint32    { return v | 1<<(p&31) }
func ClearBit(v uint32, p uint) uint32  { return v &^ (1 << (p & 31)) }
func ToggleBit(v uint32, p uint) uint32 { return v ^ 1<<(p&31) }
func CountSetBits(v uint32) int {
	c := 0
	for v != 0 {
		v &= v - 1
		c++
	}
	return c
}
func IsPowerOfTwo(v int) bool    { return v > 0 && v&(v-1) == 0 }
func LowestSetBit(v int32) int32 { return v & -v }
func SingleNumber(a []int32) int32 {
	var r int32
	for _, v := range a {
		r ^= v
	}
	return r
}
func ReverseBits(v uint32) uint32 {
	var r uint32
	for i := 0; i < 32; i++ {
		r = r<<1 | v&1
		v >>= 1
	}
	return r
}
func GrayCode(n uint) []int {
	r := make([]int, 1<<n)
	for i := range r {
		r[i] = i ^ (i >> 1)
	}
	return r
}
func SubsetsByMask[T any](a []T) [][]T {
	r := make([][]T, 1<<len(a))
	for m := range r {
		r[m] = []T{}
		for i, v := range a {
			if m&(1<<i) != 0 {
				r[m] = append(r[m], v)
			}
		}
	}
	return r
}
func SwapWithoutTemp(a, b int32) (int32, int32) { a ^= b; b ^= a; a ^= b; return a, b }
func HammingDistance(a, b uint32) int           { return CountSetBits(a ^ b) }
