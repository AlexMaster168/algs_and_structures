package architectural

import "fmt"

type tokenKey struct{ description string }
type Token[T any] struct{ key *tokenKey }

func NewToken[T any](description string) Token[T] { return Token[T]{&tokenKey{description}} }
func (t Token[T]) identity() *tokenKey            { return t.key }

type TokenIdentity interface{ identity() *tokenKey }
type registration struct {
	factory  func(*Container) any
	lifetime string
	instance any
	created  bool
}
type Container struct {
	registrations map[*tokenKey]*registration
	resolving     map[*tokenKey]bool
}

func (c *Container) Register(target TokenIdentity, factory func(*Container) any, lifetimes ...string) *Container {
	lifetime := "singleton"
	if len(lifetimes) > 0 {
		lifetime = lifetimes[0]
	}
	if lifetime != "singleton" && lifetime != "transient" {
		panic("unknown lifetime")
	}
	if c.registrations == nil {
		c.registrations = map[*tokenKey]*registration{}
	}
	c.registrations[target.identity()] = &registration{factory: factory, lifetime: lifetime}
	return c
}
func (c *Container) Value(target TokenIdentity, value any) *Container {
	c.Register(target, func(*Container) any { return value })
	entry := c.registrations[target.identity()]
	entry.instance = value
	entry.created = true
	return c
}
func (c *Container) Resolve(target TokenIdentity) any {
	key := target.identity()
	entry, ok := c.registrations[key]
	if !ok {
		panic(fmt.Sprintf("no provider for %s", key.description))
	}
	if entry.lifetime == "singleton" && entry.created {
		return entry.instance
	}
	if c.resolving == nil {
		c.resolving = map[*tokenKey]bool{}
	}
	if c.resolving[key] {
		panic("circular dependency on " + key.description)
	}
	c.resolving[key] = true
	defer delete(c.resolving, key)
	value := entry.factory(c)
	if entry.lifetime == "singleton" {
		entry.instance = value
		entry.created = true
	}
	return value
}
func Register[T any](container *Container, target Token[T], factory func(*Container) T, lifetimes ...string) *Container {
	return container.Register(target, func(c *Container) any { return factory(c) }, lifetimes...)
}
func Resolve[T any](container *Container, target Token[T]) T {
	value := container.Resolve(target)
	if value == nil {
		var zero T
		return zero
	}
	return value.(T)
}
