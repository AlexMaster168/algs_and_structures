#pragma once
#include "../../support.hpp"
namespace algs {
using AdjacencyList=std::vector<std::vector<int>>;struct WeightedEdge{int to;double weight;};using WeightedAdjacencyList=std::vector<std::vector<WeightedEdge>>;struct Edge{int from,to;double weight;};inline std::vector<int>reconstructPath(const std::vector<int>&p,int target){std::vector<int>r;for(int v=target;v!=-1;v=p.at(v))r.push_back(v);std::reverse(r.begin(),r.end());return r;}inline AdjacencyList toUndirected(int n,const std::vector<std::pair<int,int>>&edges){AdjacencyList g(n);for(auto [a,b]:edges){g[a].push_back(b);g[b].push_back(a);}return g;}inline WeightedAdjacencyList toWeightedUndirected(int n,const std::vector<Edge>&edges){WeightedAdjacencyList g(n);for(auto e:edges){g[e.from].push_back({e.to,e.weight});g[e.to].push_back({e.from,e.weight});}return g;}
}
