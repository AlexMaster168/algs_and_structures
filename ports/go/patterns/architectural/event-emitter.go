package architectural

type Listener[T any] struct{ Call func(T) }
type TypedEventEmitter[T any] struct{ listeners map[string][]*Listener[T] }

func (e *TypedEventEmitter[T]) On(event string, listener *Listener[T]) func() {
	if e.listeners == nil {
		e.listeners = map[string][]*Listener[T]{}
	}
	found := false
	for _, item := range e.listeners[event] {
		if item == listener {
			found = true
			break
		}
	}
	if !found {
		e.listeners[event] = append(e.listeners[event], listener)
	}
	return func() { e.Off(event, listener) }
}
func (e *TypedEventEmitter[T]) Once(event string, listener *Listener[T]) func() {
	var off func()
	wrapper := &Listener[T]{Call: func(value T) { off(); listener.Call(value) }}
	off = e.On(event, wrapper)
	return off
}
func (e *TypedEventEmitter[T]) Off(event string, listener *Listener[T]) {
	for i, item := range e.listeners[event] {
		if item == listener {
			e.listeners[event] = append(e.listeners[event][:i], e.listeners[event][i+1:]...)
			return
		}
	}
}
func (e *TypedEventEmitter[T]) Emit(event string, payload T) int {
	snapshot := append([]*Listener[T]{}, e.listeners[event]...)
	for _, listener := range snapshot {
		listener.Call(payload)
	}
	return e.ListenerCount(event)
}
func (e *TypedEventEmitter[T]) ListenerCount(event string) int { return len(e.listeners[event]) }
