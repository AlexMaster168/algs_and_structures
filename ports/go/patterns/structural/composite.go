package structural

import "fmt"

type FileSystemNode interface {
	Name() string
	Size() float64
	Render(...string) []string
}
type FileEntry struct {
	Filename string
	Bytes    float64
}

func (f FileEntry) Name() string  { return f.Filename }
func (f FileEntry) Size() float64 { return f.Bytes }
func (f FileEntry) Render(indents ...string) []string {
	indent := ""
	if len(indents) > 0 {
		indent = indents[0]
	}
	return []string{fmt.Sprintf("%s%s (%g)", indent, f.Filename, f.Bytes)}
}

type Directory struct {
	Filename string
	children []FileSystemNode
}

func (d *Directory) Name() string { return d.Filename }
func (d *Directory) Add(nodes ...FileSystemNode) *Directory {
	d.children = append(d.children, nodes...)
	return d
}
func (d *Directory) Remove(name string) bool {
	for i, node := range d.children {
		if node.Name() == name {
			d.children = append(d.children[:i], d.children[i+1:]...)
			return true
		}
	}
	return false
}
func (d *Directory) Size() float64 {
	total := 0.0
	for _, node := range d.children {
		total += node.Size()
	}
	return total
}
func (d *Directory) Render(indents ...string) []string {
	indent := ""
	if len(indents) > 0 {
		indent = indents[0]
	}
	lines := []string{fmt.Sprintf("%s%s/ (%g)", indent, d.Filename, d.Size())}
	for _, node := range d.children {
		lines = append(lines, node.Render(indent+"  ")...)
	}
	return lines
}
