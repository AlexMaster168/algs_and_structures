#pragma once
#include "../../support.hpp"
#include "topological-sort.hpp"
#include "../../data-structures/graphs/disjoint-set.hpp"
namespace algs {
inline bool hasCycleDirected(const AdjacencyList&g){return !topologicalSortKahn(g);}inline bool hasCycleUndirected(int n,const std::vector<std::pair<int,int>>&edges){DisjointSet sets(n);for(auto [a,b]:edges)if(!sets.unite(a,b))return true;return false;}
}
