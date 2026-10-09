#pragma once
#include "../../support.hpp"
#include "types.hpp"
namespace algs {
inline std::optional<std::vector<int>>eulerianPathDirected(const AdjacencyList&g){int n=int(g.size()),edges=0,start=-1,starts=0,ends=0;std::vector<int>in(n);for(int v=0;v<n;++v){if(start<0&&!g[v].empty())start=v;for(int w:g[v])++in[w];edges+=int(g[v].size());}if(!edges)return n?std::vector<int>{0}:std::vector<int>{};for(int v=0;v<n;++v){int b=int(g[v].size())-in[v];if(b==1){++starts;start=v;}else if(b==-1)++ends;else if(b!=0)return {};}if(!((starts==0&&ends==0)||(starts==1&&ends==1)))return {};std::vector<int>next(n),stack{start},path;while(!stack.empty()){int v=stack.back();if(next[v]<int(g[v].size()))stack.push_back(g[v][next[v]++]);else{path.push_back(v);stack.pop_back();}}if(int(path.size())!=edges+1)return {};std::reverse(path.begin(),path.end());return path;}
}
