class FileEntry:
    def __init__(self, name, bytes):
        self.name, self.bytes = name, bytes

    def size(self):
        return self.bytes

    def render(self, indent=''):
        return [f'{indent}{self.name} ({self.bytes})']


class Directory:
    def __init__(self, name):
        self.name, self.children = name, []

    def add(self, *nodes):
        self.children.extend(nodes)
        return self

    def remove(self, name):
        for i, child in enumerate(self.children):
            if child.name == name:
                del self.children[i]
                return True
        return False

    def size(self):
        return sum(child.size() for child in self.children)

    def render(self, indent=''):
        return [f'{indent}{self.name}/ ({self.size()})'] + [line for child in self.children for line in child.render(indent + '  ')]
