#pragma once
#include "../../support.hpp"
#include "types.hpp"
namespace algs {
inline std::optional<std::vector<int>>bipartiteColoring(const AdjacencyList&g){std::vector<int>c(g.size(),-1);for(int s=0;s<int(g.size());++s){if(c[s]!=-1)continue;c[s]=0;std::vector<int>q{s};for(int h=0;h<int(q.size());++h){int v=q[h];for(int n:g[v])if(c[n]==-1){c[n]=1-c[v];q.push_back(n);}else if(c[n]==c[v])return {};}}return c;}inline bool isBipartite(const AdjacencyList&g){return bipartiteColoring(g).has_value();}
}
