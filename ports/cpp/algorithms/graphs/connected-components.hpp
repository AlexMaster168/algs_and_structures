#pragma once
#include "../../support.hpp"
#include "types.hpp"
#include "../sorting/merge-sort.hpp"
namespace algs {
inline AdjacencyList connectedComponents(const AdjacencyList&g){std::vector<bool>seen(g.size());AdjacencyList r;for(int s=0;s<int(g.size());++s){if(seen[s])continue;std::vector<int>c,stack{s};seen[s]=true;while(!stack.empty()){int v=stack.back();stack.pop_back();c.push_back(v);for(int n:g[v])if(!seen[n]){seen[n]=true;stack.push_back(n);}}r.push_back(mergeSort(c));}return r;}
}
