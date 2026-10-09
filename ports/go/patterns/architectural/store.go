package architectural

import "reflect"

type StoreListener struct{ Call func() }
type StateStore[S, A any] struct {
	state       S
	reducer     func(S, A) S
	dispatching bool
	listeners   []*StoreListener
}

func CreateStore[S, A any](reducer func(S, A) S, initialState S) *StateStore[S, A] {
	return &StateStore[S, A]{state: initialState, reducer: reducer}
}
func (s *StateStore[S, A]) GetState() S { return s.state }
func (s *StateStore[S, A]) Dispatch(action A) A {
	if s.dispatching {
		panic("reducers may not dispatch actions")
	}
	func() {
		s.dispatching = true
		defer func() { s.dispatching = false }()
		s.state = s.reducer(s.state, action)
	}()
	snapshot := append([]*StoreListener{}, s.listeners...)
	for _, listener := range snapshot {
		listener.Call()
	}
	return action
}
func (s *StateStore[S, A]) Subscribe(listener *StoreListener) func() {
	found := false
	for _, item := range s.listeners {
		if item == listener {
			found = true
			break
		}
	}
	if !found {
		s.listeners = append(s.listeners, listener)
	}
	return func() {
		for i, item := range s.listeners {
			if item == listener {
				s.listeners = append(s.listeners[:i], s.listeners[i+1:]...)
				return
			}
		}
	}
}
func CombineReducers[A any](reducers map[string]func(any, A) any) func(map[string]any, A) map[string]any {
	return func(state map[string]any, action A) map[string]any {
		changed := false
		next := map[string]any{}
		for key, reducer := range reducers {
			value := reducer(state[key], action)
			next[key] = value
			changed = changed || !reflect.DeepEqual(value, state[key])
		}
		if changed {
			return next
		}
		return state
	}
}

type CounterAction struct {
	Type   string
	Amount float64
}

func CounterReducer(state float64, action CounterAction) float64 {
	switch action.Type {
	case "increment":
		return state + 1
	case "decrement":
		return state - 1
	case "add":
		return state + action.Amount
	default:
		panic("unknown action")
	}
}
