class LowestCommonAncestor:
    def __init__(self, tree, root=0):
        if not tree or not 0 <= root < len(tree):
            raise ValueError('Invalid root')
        self.depth = [-1] * len(tree)
        self.up = [[root] * len(tree) for _ in range(max(1, len(tree).bit_length()))]
        self.depth[root] = 0
        queue = [root]
        for vertex in queue:
            for child in tree[vertex]:
                if self.depth[child] != -1:
                    continue
                self.depth[child] = self.depth[vertex] + 1
                self.up[0][child] = vertex
                queue.append(child)
        for k in range(1, len(self.up)):
            for vertex in range(len(tree)):
                self.up[k][vertex] = self.up[k - 1][self.up[k - 1][vertex]]

    def ancestor(self, vertex, steps):
        if steps < 0:
            raise ValueError('Negative steps')
        for k in range(len(self.up)):
            if steps & (1 << k):
                vertex = self.up[k][vertex]
        return vertex

    def lca(self, a, b):
        if self.depth[a] < self.depth[b]:
            a, b = b, a
        a = self.ancestor(a, self.depth[a] - self.depth[b])
        if a == b:
            return a
        for k in range(len(self.up) - 1, -1, -1):
            if self.up[k][a] != self.up[k][b]:
                a, b = self.up[k][a], self.up[k][b]
        return self.up[0][a]

    def distance(self, a, b):
        return self.depth[a] + self.depth[b] - 2 * self.depth[self.lca(a, b)]
