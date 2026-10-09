#pragma once
#include "../../support.hpp"
#include "types.hpp"
namespace algs {
inline std::vector<int>dfs(const AdjacencyList&g,int s){std::vector<bool>seen(g.size());std::vector<int>r,stack{s};while(!stack.empty()){int v=stack.back();stack.pop_back();if(seen[v])continue;seen[v]=true;r.push_back(v);for(int i=int(g[v].size())-1;i>=0;--i)if(!seen[g[v][i]])stack.push_back(g[v][i]);}return r;}
inline std::vector<int>dfsRecursive(const AdjacencyList&g,int s){std::vector<bool>seen(g.size());std::vector<int>r;std::function<void(int)>visit=[&](int v){seen[v]=true;r.push_back(v);for(int n:g[v])if(!seen[n])visit(n);};visit(s);return r;}inline bool hasPath(const AdjacencyList&g,int f,int t){auto r=dfs(g,f);return std::find(r.begin(),r.end(),t)!=r.end();}
}
