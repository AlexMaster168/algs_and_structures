#pragma once
#include "../../support.hpp"
#include "types.hpp"
namespace algs {
inline std::optional<std::vector<int>>topologicalSortKahn(const AdjacencyList&g){std::vector<int>d(g.size()),q,r;for(auto&ns:g)for(int n:ns)++d[n];for(int v=0;v<int(d.size());++v)if(!d[v])q.push_back(v);for(int h=0;h<int(q.size());++h){int v=q[h];r.push_back(v);for(int n:g[v])if(--d[n]==0)q.push_back(n);}if(r.size()!=g.size())return {};return r;}
inline std::optional<std::vector<int>>topologicalSortDfs(const AdjacencyList&g){std::vector<int>state(g.size()),r;std::function<bool(int)>visit=[&](int v){state[v]=1;for(int n:g[v]){if(state[n]==1)return false;if(!state[n]&&!visit(n))return false;}state[v]=2;r.push_back(v);return true;};for(int v=0;v<int(g.size());++v)if(!state[v]&&!visit(v))return {};std::reverse(r.begin(),r.end());return r;}
}
