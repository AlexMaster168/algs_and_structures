package structural

import (
	"errors"
	"sync"
	"time"
)

type WeatherService interface{ Temperature(string) (float64, error) }
type weatherEntry struct {
	value     float64
	expiresAt int64
}
type CachingWeatherProxy struct {
	service WeatherService
	ttlMs   int64
	now     func() int64
	cache   map[string]weatherEntry
	mu      sync.Mutex
}

func NewCachingWeatherProxy(service WeatherService, ttlMs int64, now func() int64) *CachingWeatherProxy {
	if now == nil {
		now = func() int64 { return time.Now().UnixMilli() }
	}
	return &CachingWeatherProxy{service: service, ttlMs: ttlMs, now: now, cache: map[string]weatherEntry{}}
}
func (p *CachingWeatherProxy) Temperature(city string) (float64, error) {
	p.mu.Lock()
	cached, ok := p.cache[city]
	p.mu.Unlock()
	if ok && cached.expiresAt > p.now() {
		return cached.value, nil
	}
	value, error := p.service.Temperature(city)
	if error != nil {
		return 0, error
	}
	p.mu.Lock()
	p.cache[city] = weatherEntry{value, p.now() + p.ttlMs}
	p.mu.Unlock()
	return value, nil
}

type AccessControlProxy struct {
	Service   WeatherService
	IsAllowed func() bool
}

func (p AccessControlProxy) Temperature(city string) (float64, error) {
	if !p.IsAllowed() {
		return 0, errors.New("access denied")
	}
	return p.Service.Temperature(city)
}

type ValidatedObject[K comparable, V any] struct {
	target   map[K]V
	validate func(K, V) bool
}

func CreateValidatedObject[K comparable, V any](target map[K]V, validate func(K, V) bool) *ValidatedObject[K, V] {
	return &ValidatedObject[K, V]{target, validate}
}
func (v *ValidatedObject[K, V]) Get(key K) (V, bool) { value, ok := v.target[key]; return value, ok }
func (v *ValidatedObject[K, V]) Set(key K, value V) error {
	if !v.validate(key, value) {
		return errors.New("invalid value")
	}
	v.target[key] = value
	return nil
}
