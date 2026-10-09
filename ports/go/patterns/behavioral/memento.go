package behavioral

type EditorSnapshot struct {
	Content string
	Cursor  int
}
type Editor struct {
	content string
	cursor  int
}

func (e *Editor) Text() string        { return e.content }
func (e *Editor) CursorPosition() int { return e.cursor }
func (e *Editor) Type(text string) {
	a := textUnits(e.content)
	insert := textUnits(text)
	e.content = unitText(append(append(append([]uint16{}, a[:e.cursor]...), insert...), a[e.cursor:]...))
	e.cursor += len(insert)
}
func (e *Editor) MoveCursor(position int) {
	e.cursor = max(0, min(len(textUnits(e.content)), position))
}
func (e *Editor) Save() EditorSnapshot { return EditorSnapshot{e.content, e.cursor} }
func (e *Editor) Restore(snapshot EditorSnapshot) {
	e.content, e.cursor = snapshot.Content, snapshot.Cursor
}

type EditorHistory struct {
	Editor    *Editor
	snapshots []EditorSnapshot
}

func (h *EditorHistory) Backup() { h.snapshots = append(h.snapshots, h.Editor.Save()) }
func (h *EditorHistory) Undo() bool {
	if len(h.snapshots) == 0 {
		return false
	}
	snapshot := h.snapshots[len(h.snapshots)-1]
	h.snapshots = h.snapshots[:len(h.snapshots)-1]
	h.Editor.Restore(snapshot)
	return true
}
