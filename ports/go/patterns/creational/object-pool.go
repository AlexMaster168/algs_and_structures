package creational

type ObjectPool[T comparable] struct {
	available []T
	inUse     map[T]bool
	create    func() T
	reset     func(T)
	maxSize   int
}

func NewObjectPool[T comparable](create func() T, reset func(T), maxSize int) *ObjectPool[T] {
	if maxSize < 0 {
		panic("negative pool size")
	}
	return &ObjectPool[T]{inUse: map[T]bool{}, create: create, reset: reset, maxSize: maxSize}
}
func (p *ObjectPool[T]) AvailableCount() int { return len(p.available) }
func (p *ObjectPool[T]) InUseCount() int     { return len(p.inUse) }
func (p *ObjectPool[T]) Acquire() T {
	var item T
	if len(p.available) > 0 {
		item = p.available[len(p.available)-1]
		p.available = p.available[:len(p.available)-1]
	} else {
		if len(p.inUse) >= p.maxSize {
			panic("pool is exhausted")
		}
		item = p.create()
	}
	if p.inUse[item] {
		panic("factory returned an item already in use")
	}
	p.inUse[item] = true
	return item
}
func (p *ObjectPool[T]) Release(item T) {
	if !p.inUse[item] {
		panic("item does not belong to this pool")
	}
	delete(p.inUse, item)
	if p.reset != nil {
		p.reset(item)
	}
	p.available = append(p.available, item)
}
func UsePool[T comparable, R any](pool *ObjectPool[T], work func(T) R) R {
	item := pool.Acquire()
	defer pool.Release(item)
	return work(item)
}
