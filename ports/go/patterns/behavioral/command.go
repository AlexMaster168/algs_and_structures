package behavioral

import "unicode/utf16"

type TextDocument struct{ Content string }
type Command interface {
	Execute()
	Undo()
}

func textUnits(value string) []uint16 { return utf16.Encode([]rune(value)) }
func unitText(value []uint16) string  { return string(utf16.Decode(value)) }

type InsertCommand struct {
	Document *TextDocument
	Position int
	Text     string
}

func (c *InsertCommand) Execute() {
	a := textUnits(c.Document.Content)
	c.Document.Content = unitText(append(append(append([]uint16{}, a[:c.Position]...), textUnits(c.Text)...), a[c.Position:]...))
}
func (c *InsertCommand) Undo() {
	a := textUnits(c.Document.Content)
	c.Document.Content = unitText(append(a[:c.Position], a[c.Position+len(textUnits(c.Text)):]...))
}

type DeleteCommand struct {
	Document         *TextDocument
	Position, Length int
	removed          string
}

func (c *DeleteCommand) Execute() {
	a := textUnits(c.Document.Content)
	end := min(len(a), c.Position+c.Length)
	c.removed = unitText(a[c.Position:end])
	c.Document.Content = unitText(append(a[:c.Position], a[end:]...))
}
func (c *DeleteCommand) Undo() {
	a := textUnits(c.Document.Content)
	c.Document.Content = unitText(append(append(append([]uint16{}, a[:c.Position]...), textUnits(c.removed)...), a[c.Position:]...))
}

type MacroCommand struct{ Commands []Command }

func (c MacroCommand) Execute() {
	for _, command := range c.Commands {
		command.Execute()
	}
}
func (c MacroCommand) Undo() {
	for i := len(c.Commands) - 1; i >= 0; i-- {
		c.Commands[i].Undo()
	}
}

type CommandHistory struct{ done, undone []Command }

func (h *CommandHistory) Run(command Command) {
	command.Execute()
	h.done = append(h.done, command)
	h.undone = nil
}
func (h *CommandHistory) Undo() bool {
	if len(h.done) == 0 {
		return false
	}
	command := h.done[len(h.done)-1]
	h.done = h.done[:len(h.done)-1]
	command.Undo()
	h.undone = append(h.undone, command)
	return true
}
func (h *CommandHistory) Redo() bool {
	if len(h.undone) == 0 {
		return false
	}
	command := h.undone[len(h.undone)-1]
	h.undone = h.undone[:len(h.undone)-1]
	command.Execute()
	h.done = append(h.done, command)
	return true
}
