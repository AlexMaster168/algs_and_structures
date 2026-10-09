#pragma once
#include "../../support.hpp"
#include "types.hpp"
namespace algs {
struct BellmanFordResult{Numbers distance;std::vector<int>parent;bool hasNegativeCycle;};inline BellmanFordResult bellmanFord(int n,const std::vector<Edge>&edges,int s){BellmanFordResult r{Numbers(n,infinity),std::vector<int>(n,-1),false};r.distance.at(s)=0;for(int i=0;i<n-1;++i){bool changed=false;for(auto e:edges)if(r.distance[e.from]+e.weight<r.distance[e.to]){r.distance[e.to]=r.distance[e.from]+e.weight;r.parent[e.to]=e.from;changed=true;}if(!changed)break;}for(auto e:edges)if(r.distance[e.from]+e.weight<r.distance[e.to])r.hasNegativeCycle=true;return r;}
}
