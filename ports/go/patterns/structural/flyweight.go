package structural

import "fmt"

type TreeType struct{ Name, Color, Texture string }

func (t *TreeType) Draw(x, y float64) string {
	return fmt.Sprintf("%s(%s) at %g,%g", t.Name, t.Color, x, y)
}

type TreeTypeFactory struct{ types map[[3]string]*TreeType }

func (f *TreeTypeFactory) Count() int { return len(f.types) }
func (f *TreeTypeFactory) Get(name, color, texture string) *TreeType {
	if f.types == nil {
		f.types = map[[3]string]*TreeType{}
	}
	key := [3]string{name, color, texture}
	if value, ok := f.types[key]; ok {
		return value
	}
	value := &TreeType{name, color, texture}
	f.types[key] = value
	return value
}

type forestTree struct {
	x, y float64
	kind *TreeType
}
type Forest struct {
	factory *TreeTypeFactory
	trees   []forestTree
}

func NewForest(factories ...*TreeTypeFactory) *Forest {
	factory := &TreeTypeFactory{}
	if len(factories) > 0 && factories[0] != nil {
		factory = factories[0]
	}
	return &Forest{factory: factory}
}
func (f *Forest) TreeCount() int { return len(f.trees) }
func (f *Forest) TypeCount() int { return f.factory.Count() }
func (f *Forest) Plant(x, y float64, name, color, texture string) *Forest {
	f.trees = append(f.trees, forestTree{x, y, f.factory.Get(name, color, texture)})
	return f
}
func (f *Forest) Draw() []string {
	lines := []string{}
	for _, tree := range f.trees {
		lines = append(lines, tree.kind.Draw(tree.x, tree.y))
	}
	return lines
}
