package hashing

import "algs/data-structures/linear"

type LRUCache[K comparable, V any] struct {
	Capacity int
	nodes    map[K]*linear.DoublyLinkedListNode[Entry[K, V]]
	order    linear.DoublyLinkedList[Entry[K, V]]
}

func NewLRUCache[K comparable, V any](n int) *LRUCache[K, V] {
	if n <= 0 {
		panic("invalid capacity")
	}
	return &LRUCache[K, V]{Capacity: n, nodes: map[K]*linear.DoublyLinkedListNode[Entry[K, V]]{}}
}
func (c *LRUCache[K, V]) Size() int    { return len(c.nodes) }
func (c *LRUCache[K, V]) Has(k K) bool { _, ok := c.nodes[k]; return ok }
func (c *LRUCache[K, V]) Get(k K) (v V, ok bool) {
	n := c.nodes[k]
	if n == nil {
		return
	}
	v = n.Value.Value
	c.order.Unlink(n)
	c.nodes[k] = c.order.PushFront(Entry[K, V]{k, v})
	return v, true
}
func (c *LRUCache[K, V]) Set(k K, v V) *LRUCache[K, V] {
	if n := c.nodes[k]; n != nil {
		c.order.Unlink(n)
	}
	c.nodes[k] = c.order.PushFront(Entry[K, V]{k, v})
	if len(c.nodes) > c.Capacity {
		e, _ := c.order.PopBack()
		delete(c.nodes, e.Key)
	}
	return c
}
func (c *LRUCache[K, V]) Delete(k K) bool {
	n := c.nodes[k]
	if n == nil {
		return false
	}
	c.order.Unlink(n)
	delete(c.nodes, k)
	return true
}
func (c *LRUCache[K, V]) Keys() []K {
	r := []K{}
	for _, e := range c.order.ToArray() {
		r = append(r, e.Key)
	}
	return r
}
