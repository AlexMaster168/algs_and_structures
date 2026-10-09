package hashing

type slot[K comparable, V any] struct {
	key   K
	value V
	state uint8
}
type OpenAddressingHashMap[K comparable, V any] struct {
	slots             []slot[K, V]
	count, tombstones int
	hasher            func(K) uint32
}

func NewOpenAddressingHashMap[K comparable, V any](h func(K) uint32, n int) *OpenAddressingHashMap[K, V] {
	if h == nil {
		h = DefaultHasher[K]
	}
	return &OpenAddressingHashMap[K, V]{slots: make([]slot[K, V], max(2, n)), hasher: h}
}
func (m *OpenAddressingHashMap[K, V]) Size() int { return m.count }
func (m *OpenAddressingHashMap[K, V]) find(k K) int {
	i := int(m.hasher(k) % uint32(len(m.slots)))
	for p := 0; p < len(m.slots); p++ {
		s := m.slots[i]
		if s.state == 0 {
			return -1
		}
		if s.state == 1 && s.key == k {
			return i
		}
		i = (i + 1) % len(m.slots)
	}
	return -1
}
func (m *OpenAddressingHashMap[K, V]) Set(k K, v V) *OpenAddressingHashMap[K, V] {
	if (m.count+m.tombstones+1)*2 > len(m.slots) {
		es := m.Entries()
		m.slots = make([]slot[K, V], len(m.slots)*2)
		m.count, m.tombstones = 0, 0
		for _, e := range es {
			m.Set(e.Key, e.Value)
		}
	}
	i, d := int(m.hasher(k)%uint32(len(m.slots))), -1
	for m.slots[i].state != 0 {
		s := &m.slots[i]
		if s.state == 2 {
			if d < 0 {
				d = i
			}
		} else if s.key == k {
			s.value = v
			return m
		}
		i = (i + 1) % len(m.slots)
	}
	if d >= 0 {
		i = d
		m.tombstones--
	}
	m.slots[i] = slot[K, V]{k, v, 1}
	m.count++
	return m
}
func (m *OpenAddressingHashMap[K, V]) Get(k K) (v V, ok bool) {
	i := m.find(k)
	if i < 0 {
		return
	}
	return m.slots[i].value, true
}
func (m *OpenAddressingHashMap[K, V]) Has(k K) bool { return m.find(k) >= 0 }
func (m *OpenAddressingHashMap[K, V]) Delete(k K) bool {
	i := m.find(k)
	if i < 0 {
		return false
	}
	m.slots[i] = slot[K, V]{state: 2}
	m.count--
	m.tombstones++
	return true
}
func (m *OpenAddressingHashMap[K, V]) Entries() []Entry[K, V] {
	r := []Entry[K, V]{}
	for _, s := range m.slots {
		if s.state == 1 {
			r = append(r, Entry[K, V]{s.key, s.value})
		}
	}
	return r
}
