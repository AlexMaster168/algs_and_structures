#pragma once
#include "../graphs/bfs.hpp"
namespace algs {
struct TreeDiameterResult { int length; std::vector<int> path; };
inline TreeDiameterResult treeDiameter(const AdjacencyList& tree) { if (tree.empty()) return {0, {}}; auto first = bfs(tree, 0); auto start = int(std::max_element(first.distance.begin(), first.distance.end()) - first.distance.begin()); auto second = bfs(tree, start); auto end = int(std::max_element(second.distance.begin(), second.distance.end()) - second.distance.begin()); return {second.distance[end], reconstructPath(second.parent, end)}; }
}
