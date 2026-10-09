from dataclasses import dataclass


@dataclass(frozen=True)
class EditorSnapshot:
    content: str
    cursor: int


class Editor:
    def __init__(self):
        self.content, self.cursor = '', 0

    @property
    def text(self):
        return self.content

    @property
    def cursor_position(self):
        return self.cursor

    def type(self, text):
        self.content = self.content[:self.cursor] + text + self.content[self.cursor:]
        self.cursor += len(text)

    def move_cursor(self, position):
        self.cursor = max(0, min(len(self.content), position))

    def save(self):
        return EditorSnapshot(self.content, self.cursor)

    def restore(self, snapshot):
        self.content, self.cursor = snapshot.content, snapshot.cursor


class EditorHistory:
    def __init__(self, editor):
        self.editor, self.snapshots = editor, []

    def backup(self):
        self.snapshots.append(self.editor.save())

    def undo(self):
        if not self.snapshots:
            return False
        self.editor.restore(self.snapshots.pop())
        return True
