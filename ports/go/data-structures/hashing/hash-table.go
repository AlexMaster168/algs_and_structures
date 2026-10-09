package hashing

type HashTable[K comparable, V any] struct {
	buckets [][]Entry[K, V]
	count   int
	hasher  func(K) uint32
	load    float64
}

func NewHashTable[K comparable, V any](h func(K) uint32, capacity int, load float64) *HashTable[K, V] {
	if h == nil {
		h = DefaultHasher[K]
	}
	if load <= 0 {
		panic("invalid load factor")
	}
	return &HashTable[K, V]{buckets: make([][]Entry[K, V], max(1, capacity)), hasher: h, load: load}
}
func (t *HashTable[K, V]) Size() int     { return t.count }
func (t *HashTable[K, V]) Capacity() int { return len(t.buckets) }
func (t *HashTable[K, V]) Set(k K, v V) *HashTable[K, V] {
	i := int(t.hasher(k) % uint32(len(t.buckets)))
	for j := range t.buckets[i] {
		if t.buckets[i][j].Key == k {
			t.buckets[i][j].Value = v
			return t
		}
	}
	t.buckets[i] = append(t.buckets[i], Entry[K, V]{k, v})
	t.count++
	if float64(t.count)/float64(len(t.buckets)) > t.load {
		entries := t.Entries()
		t.buckets = make([][]Entry[K, V], len(t.buckets)*2)
		for _, e := range entries {
			i := int(t.hasher(e.Key) % uint32(len(t.buckets)))
			t.buckets[i] = append(t.buckets[i], e)
		}
	}
	return t
}
func (t *HashTable[K, V]) Get(k K) (v V, ok bool) {
	i := int(t.hasher(k) % uint32(len(t.buckets)))
	for _, e := range t.buckets[i] {
		if e.Key == k {
			return e.Value, true
		}
	}
	return
}
func (t *HashTable[K, V]) Has(k K) bool { _, ok := t.Get(k); return ok }
func (t *HashTable[K, V]) Delete(k K) bool {
	i := int(t.hasher(k) % uint32(len(t.buckets)))
	for j, e := range t.buckets[i] {
		if e.Key == k {
			t.buckets[i] = append(t.buckets[i][:j], t.buckets[i][j+1:]...)
			t.count--
			return true
		}
	}
	return false
}
func (t *HashTable[K, V]) Clear() { t.buckets = make([][]Entry[K, V], len(t.buckets)); t.count = 0 }
func (t *HashTable[K, V]) Entries() []Entry[K, V] {
	r := []Entry[K, V]{}
	for _, b := range t.buckets {
		r = append(r, b...)
	}
	return r
}
func (t *HashTable[K, V]) Keys() []K {
	r := []K{}
	for _, e := range t.Entries() {
		r = append(r, e.Key)
	}
	return r
}
func (t *HashTable[K, V]) Values() []V {
	r := []V{}
	for _, e := range t.Entries() {
		r = append(r, e.Value)
	}
	return r
}
