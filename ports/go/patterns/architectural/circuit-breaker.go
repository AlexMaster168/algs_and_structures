package architectural

import (
	"errors"
	"math"
	"sync"
	"time"
)

type CircuitOpenError struct{}

func (CircuitOpenError) Error() string { return "circuit is open" }

type CircuitBreaker[A, R any] struct {
	action           func(A) (R, error)
	failureThreshold int
	resetTimeoutMs   int64
	now              func() int64
	failures         int
	openedAt         int64
	current          string
	mu               sync.Mutex
}

func NewCircuitBreaker[A, R any](action func(A) (R, error), failureThreshold int, resetTimeoutMs int64, now func() int64) *CircuitBreaker[A, R] {
	if failureThreshold < 1 {
		panic("failure threshold must be positive")
	}
	if now == nil {
		now = func() int64 { return time.Now().UnixMilli() }
	}
	return &CircuitBreaker[A, R]{action: action, failureThreshold: failureThreshold, resetTimeoutMs: resetTimeoutMs, now: now, current: "closed"}
}
func (b *CircuitBreaker[A, R]) state() string {
	if b.current == "open" && b.now()-b.openedAt >= b.resetTimeoutMs {
		b.current = "half-open"
	}
	return b.current
}
func (b *CircuitBreaker[A, R]) State() string { b.mu.Lock(); defer b.mu.Unlock(); return b.state() }
func (b *CircuitBreaker[A, R]) Call(argument A) (R, error) {
	b.mu.Lock()
	if b.state() == "open" {
		b.mu.Unlock()
		var zero R
		return zero, CircuitOpenError{}
	}
	b.mu.Unlock()
	value, error := b.action(argument)
	b.mu.Lock()
	defer b.mu.Unlock()
	if error == nil {
		b.failures = 0
		b.current = "closed"
		return value, nil
	}
	b.failures++
	if b.current == "half-open" || b.failures >= b.failureThreshold {
		b.current = "open"
		b.openedAt = b.now()
	}
	return value, error
}

type RetryOptions struct {
	Attempts int
	Delay    time.Duration
	Factor   float64
}

func Retry[R any](action func() (R, error), options ...RetryOptions) (R, error) {
	configuration := RetryOptions{Attempts: 3, Factor: 2}
	if len(options) > 0 {
		configuration = options[0]
	}
	if configuration.Attempts < 1 {
		var zero R
		return zero, errors.New("attempts must be positive")
	}
	var value R
	var error error
	for attempt := 0; attempt < configuration.Attempts; attempt++ {
		value, error = action()
		if error == nil {
			return value, nil
		}
		if attempt+1 < configuration.Attempts && configuration.Delay > 0 {
			time.Sleep(time.Duration(float64(configuration.Delay) * math.Pow(configuration.Factor, float64(attempt))))
		}
	}
	return value, error
}
