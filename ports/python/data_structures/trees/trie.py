class _Node:
    def __init__(self):
        self.children, self.is_word, self.pass_count = {}, False, 0


class Trie:
    def __init__(self):
        self.root, self.count = _Node(), 0

    @classmethod
    def from_iterable(cls, words):
        trie = cls()
        for word in words:
            trie.insert(word)
        return trie

    @property
    def size(self):
        return self.count

    def _walk(self, prefix):
        node = self.root
        for char in prefix:
            node = node.children.get(char)
            if node is None:
                return None
        return node

    def insert(self, word):
        if self.has(word):
            return False
        node = self.root
        node.pass_count += 1
        for char in word:
            if char not in node.children:
                node.children[char] = _Node()
            node = node.children[char]
            node.pass_count += 1
        node.is_word = True
        self.count += 1
        return True

    def has(self, word):
        node = self._walk(word)
        return node is not None and node.is_word

    def starts_with(self, prefix):
        return self._walk(prefix) is not None

    def count_with_prefix(self, prefix):
        node = self._walk(prefix)
        return node.pass_count if node else 0

    def words_with_prefix(self, prefix):
        node, words = self._walk(prefix), []
        if node is None:
            return words

        def collect(current, path):
            if current.is_word:
                words.append(path)
            for char in sorted(current.children):
                collect(current.children[char], path + char)

        collect(node, prefix)
        return words

    def delete(self, word):
        if not self.has(word):
            return False
        node = self.root
        node.pass_count -= 1
        for char in word:
            next_node = node.children[char]
            next_node.pass_count -= 1
            if next_node.pass_count == 0:
                del node.children[char]
                self.count -= 1
                return True
            node = next_node
        node.is_word = False
        self.count -= 1
        return True
