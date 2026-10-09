package behavioral

type Observer[T any] struct{ Notify func(T) }
type Subject[T any] struct{ observers []*Observer[T] }

func (s *Subject[T]) ObserverCount() int { return len(s.observers) }
func (s *Subject[T]) Subscribe(observer *Observer[T]) func() {
	found := false
	for _, item := range s.observers {
		if item == observer {
			found = true
			break
		}
	}
	if !found {
		s.observers = append(s.observers, observer)
	}
	return func() {
		for i, item := range s.observers {
			if item == observer {
				s.observers = append(s.observers[:i], s.observers[i+1:]...)
				return
			}
		}
	}
}
func (s *Subject[T]) Notify(value T) {
	snapshot := append([]*Observer[T]{}, s.observers...)
	for _, observer := range snapshot {
		observer.Notify(value)
	}
}

type PriceChange struct {
	Symbol        string
	Price, Change float64
}
type StockTicker struct {
	Changes Subject[PriceChange]
	prices  map[string]float64
}

func (t *StockTicker) Update(symbol string, price float64) {
	if t.prices == nil {
		t.prices = map[string]float64{}
	}
	previous, ok := t.prices[symbol]
	if !ok {
		previous = price
	}
	t.prices[symbol] = price
	t.Changes.Notify(PriceChange{symbol, price, price - previous})
}

type BehaviorSubject[T any] struct {
	Subject[T]
	current T
}

func NewBehaviorSubject[T any](current T) *BehaviorSubject[T] {
	return &BehaviorSubject[T]{current: current}
}
func (s *BehaviorSubject[T]) Value() T { return s.current }
func (s *BehaviorSubject[T]) Subscribe(observer *Observer[T]) func() {
	observer.Notify(s.current)
	return s.Subject.Subscribe(observer)
}
func (s *BehaviorSubject[T]) Notify(value T) { s.current = value; s.Subject.Notify(value) }
