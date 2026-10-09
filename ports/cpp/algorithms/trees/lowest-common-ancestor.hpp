#pragma once
#include "../graphs/types.hpp"
namespace algs {
class LowestCommonAncestor {
    std::vector<int> depth; std::vector<std::vector<int>> up;
public:
    explicit LowestCommonAncestor(const AdjacencyList& tree, int root = 0): depth(tree.size(), -1) { if (tree.empty() || root < 0 || root >= int(tree.size())) throw std::invalid_argument("Invalid root"); int levels = 1; while ((std::size_t(1) << levels) < tree.size() + 1) ++levels; up.assign(levels, std::vector<int>(tree.size(), root)); std::vector<int> order{root}; depth[root] = 0; for (std::size_t head = 0; head < order.size(); ++head) for (int child : tree[order[head]]) if (depth.at(child) < 0) { depth[child] = depth[order[head]] + 1; up[0][child] = order[head]; order.push_back(child); } for (int k = 1; k < levels; ++k) for (std::size_t v = 0; v < tree.size(); ++v) up[k][v] = up[k - 1][up[k - 1][v]]; }
    int ancestor(int vertex, int steps) const { if (steps < 0 || depth.at(vertex) < 0) throw std::invalid_argument("Invalid ancestor query"); steps = std::min(steps, depth[vertex]); for (std::size_t k = 0; k < up.size() && steps; ++k, steps >>= 1) if (steps & 1) vertex = up[k][vertex]; return vertex; }
    int lca(int a, int b) const { if (depth.at(a) < 0 || depth.at(b) < 0) throw std::invalid_argument("Unreachable vertex"); if (depth[a] < depth[b]) std::swap(a, b); a = ancestor(a, depth[a] - depth[b]); if (a == b) return a; for (int k = int(up.size()) - 1; k >= 0; --k) if (up[k][a] != up[k][b]) { a = up[k][a]; b = up[k][b]; } return up[0][a]; }
    int distance(int a, int b) const { return depth.at(a) + depth.at(b) - 2 * depth[lca(a, b)]; }
};
}
