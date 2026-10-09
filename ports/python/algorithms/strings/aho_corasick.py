from collections import deque
from dataclasses import dataclass, field


@dataclass
class _Node:
    next: dict = field(default_factory=dict)
    fail: int = 0
    output: list = field(default_factory=list)


class AhoCorasick:
    def __init__(self, patterns):
        self.patterns = list(patterns)
        self.nodes = [_Node()]
        for index, pattern in enumerate(self.patterns):
            if not pattern:
                continue
            state = 0
            for char in pattern:
                if char not in self.nodes[state].next:
                    self.nodes[state].next[char] = len(self.nodes)
                    self.nodes.append(_Node())
                state = self.nodes[state].next[char]
            self.nodes[state].output.append(index)
        queue = deque(self.nodes[0].next.values())
        while queue:
            state = queue.popleft()
            for char, child in self.nodes[state].next.items():
                fail = self._transition(self.nodes[state].fail, char)
                self.nodes[child].fail = fail
                self.nodes[child].output.extend(self.nodes[fail].output)
                queue.append(child)

    def _transition(self, state, char):
        while char not in self.nodes[state].next:
            if state == 0:
                return 0
            state = self.nodes[state].fail
        return self.nodes[state].next[char]

    def search(self, text):
        matches, state = [], 0
        for i, char in enumerate(text):
            state = self._transition(state, char)
            for pattern_index in self.nodes[state].output:
                pattern = self.patterns[pattern_index]
                matches.append({'pattern': pattern, 'index': i - len(pattern) + 1})
        return matches
