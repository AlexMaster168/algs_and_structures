#pragma once
#include "../../support.hpp"
#include "types.hpp"
#include "../sorting/merge-sort.hpp"
namespace algs {
inline AdjacencyList tarjanScc(const AdjacencyList&g){int n=int(g.size()),counter=0;std::vector<int>index(n,-1),low(n),stack;std::vector<bool>on(n);AdjacencyList result;std::function<void(int)>connect=[&](int v){index[v]=low[v]=counter++;stack.push_back(v);on[v]=true;for(int w:g[v])if(index[w]==-1){connect(w);low[v]=std::min(low[v],low[w]);}else if(on[w])low[v]=std::min(low[v],index[w]);if(low[v]!=index[v])return;std::vector<int>c;int w;do{w=stack.back();stack.pop_back();on[w]=false;c.push_back(w);}while(w!=v);result.push_back(mergeSort(c));};for(int v=0;v<n;++v)if(index[v]==-1)connect(v);return result;}
inline AdjacencyList kosarajuScc(const AdjacencyList&g){int n=int(g.size());AdjacencyList rev(n),result;for(int v=0;v<n;++v)for(int w:g[v])rev[w].push_back(v);std::vector<bool>seen(n);std::vector<int>order;std::function<void(int)>fill=[&](int v){seen[v]=true;for(int w:g[v])if(!seen[w])fill(w);order.push_back(v);};std::function<void(int,std::vector<int>&)>collect=[&](int v,std::vector<int>&c){seen[v]=true;c.push_back(v);for(int w:rev[v])if(!seen[w])collect(w,c);};for(int v=0;v<n;++v)if(!seen[v])fill(v);std::fill(seen.begin(),seen.end(),false);for(auto it=order.rbegin();it!=order.rend();++it)if(!seen[*it]){std::vector<int>c;collect(*it,c);result.push_back(mergeSort(c));}return result;}
}
