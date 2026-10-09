#pragma once
#include "../../support.hpp"
#include "types.hpp"
#include "../../data-structures/heaps/binary-heap.hpp"
namespace algs {
struct ShortestPaths{Numbers distance;std::vector<int>parent;};inline ShortestPaths dijkstra(const WeightedAdjacencyList&g,int s){ShortestPaths r{Numbers(g.size(),infinity),std::vector<int>(g.size(),-1)};BinaryHeap<std::pair<int,double>>heap([](auto&a,auto&b){return defaultCompare(a.second,b.second);});r.distance.at(s)=0;heap.push({s,0});while(!heap.isEmpty()){auto [v,current]=*heap.pop();if(current>r.distance[v])continue;for(auto e:g[v]){if(e.weight<0)throw std::out_of_range("Dijkstra does not support negative weights");double candidate=current+e.weight;if(candidate<r.distance[e.to]){r.distance[e.to]=candidate;r.parent[e.to]=v;heap.push({e.to,candidate});}}}return r;}struct DijkstraPathResult{double distance;std::vector<int>path;};inline std::optional<DijkstraPathResult>dijkstraPath(const WeightedAdjacencyList&g,int s,int t){auto r=dijkstra(g,s);if(r.distance[t]==infinity)return {};return DijkstraPathResult{r.distance[t],reconstructPath(r.parent,t)};}
}
