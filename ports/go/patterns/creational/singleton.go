package creational

import "sync"

type AppConfig struct {
	mu     sync.RWMutex
	values map[string]string
}

var configOnce sync.Once
var configInstance *AppConfig

func GetInstance() *AppConfig {
	configOnce.Do(func() { configInstance = &AppConfig{values: map[string]string{}} })
	return configInstance
}
func (c *AppConfig) Set(key, value string) *AppConfig {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.values[key] = value
	return c
}
func (c *AppConfig) Get(key string, fallback ...string) (string, bool) {
	c.mu.RLock()
	defer c.mu.RUnlock()
	value, ok := c.values[key]
	if !ok && len(fallback) > 0 {
		return fallback[0], true
	}
	return value, ok
}
func LazySingleton[T any](create func() T) func() T {
	var once sync.Once
	var value T
	return func() T { once.Do(func() { value = create() }); return value }
}
