class TextDocument:
    def __init__(self):
        self.content = ''


class InsertCommand:
    def __init__(self, document, position, text):
        self.document, self.position, self.text = document, position, text

    def execute(self):
        c, p = self.document.content, self.position
        self.document.content = c[:p] + self.text + c[p:]

    def undo(self):
        c, p = self.document.content, self.position
        self.document.content = c[:p] + c[p + len(self.text):]


class DeleteCommand:
    def __init__(self, document, position, length):
        self.document, self.position, self.length = document, position, length
        self.removed = ''

    def execute(self):
        c, p = self.document.content, self.position
        self.removed = c[p:p + self.length]
        self.document.content = c[:p] + c[p + self.length:]

    def undo(self):
        c, p = self.document.content, self.position
        self.document.content = c[:p] + self.removed + c[p:]


class MacroCommand:
    def __init__(self, commands):
        self.commands = list(commands)

    def execute(self):
        for command in self.commands:
            command.execute()

    def undo(self):
        for command in reversed(self.commands):
            command.undo()


class CommandHistory:
    def __init__(self):
        self.done, self.undone = [], []

    def run(self, command):
        command.execute()
        self.done.append(command)
        self.undone.clear()

    def undo(self):
        if not self.done:
            return False
        command = self.done.pop()
        command.undo()
        self.undone.append(command)
        return True

    def redo(self):
        if not self.undone:
            return False
        command = self.undone.pop()
        command.execute()
        self.done.append(command)
        return True
