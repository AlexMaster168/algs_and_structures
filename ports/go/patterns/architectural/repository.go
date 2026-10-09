package architectural

import "encoding/json"

type Entity interface{ GetID() string }
type Repository[T Entity] interface {
	FindByID(string) (T, bool)
	FindAll(...Specification[T]) []T
	Save(T)
	Delete(string) bool
}
type InMemoryRepository[T Entity] struct {
	items map[string]T
	order []string
	clone func(T) T
}

func NewInMemoryRepository[T Entity](clones ...func(T) T) *InMemoryRepository[T] {
	clone := func(item T) T {
		data, error := json.Marshal(item)
		if error != nil {
			panic(error)
		}
		var value T
		if error = json.Unmarshal(data, &value); error != nil {
			panic(error)
		}
		return value
	}
	if len(clones) > 0 && clones[0] != nil {
		clone = clones[0]
	}
	return &InMemoryRepository[T]{items: map[string]T{}, clone: clone}
}
func (r *InMemoryRepository[T]) FindByID(id string) (T, bool) {
	item, ok := r.items[id]
	if !ok {
		var zero T
		return zero, false
	}
	return r.clone(item), true
}
func (r *InMemoryRepository[T]) FindAll(specifications ...Specification[T]) []T {
	result := []T{}
	for _, id := range r.order {
		item := r.items[id]
		if len(specifications) == 0 || specifications[0] == nil || specifications[0].IsSatisfiedBy(item) {
			result = append(result, r.clone(item))
		}
	}
	return result
}
func (r *InMemoryRepository[T]) Save(entity T) {
	id := entity.GetID()
	if _, ok := r.items[id]; !ok {
		r.order = append(r.order, id)
	}
	r.items[id] = r.clone(entity)
}
func (r *InMemoryRepository[T]) Delete(id string) bool {
	if _, ok := r.items[id]; !ok {
		return false
	}
	delete(r.items, id)
	for i, key := range r.order {
		if key == id {
			r.order = append(r.order[:i], r.order[i+1:]...)
			break
		}
	}
	return true
}
