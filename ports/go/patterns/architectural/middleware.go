package architectural

import "errors"

type Middleware[C any] func(C, func() error) error

func Compose[C any](middlewares []Middleware[C]) func(C) error {
	return func(context C) error {
		lastIndex := -1
		var dispatch func(int) error
		dispatch = func(index int) error {
			if index <= lastIndex {
				return errors.New("next() called multiple times")
			}
			lastIndex = index
			if index < len(middlewares) {
				return middlewares[index](context, func() error { return dispatch(index + 1) })
			}
			return nil
		}
		return dispatch(0)
	}
}

type Pipeline[C any] struct{ middlewares []Middleware[C] }

func (p *Pipeline[C]) Use(middleware Middleware[C]) *Pipeline[C] {
	p.middlewares = append(p.middlewares, middleware)
	return p
}
func (p *Pipeline[C]) Run(context C) error { return Compose(p.middlewares)(context) }
