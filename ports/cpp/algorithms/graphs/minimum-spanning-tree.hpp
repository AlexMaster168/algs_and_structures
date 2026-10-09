#pragma once
#include "../../support.hpp"
#include "types.hpp"
#include "../../data-structures/graphs/disjoint-set.hpp"
#include "../../data-structures/heaps/binary-heap.hpp"
#include "../sorting/merge-sort.hpp"
namespace algs {
struct SpanningTree{double weight;std::vector<Edge>edges;};inline SpanningTree kruskal(int n,const std::vector<Edge>&edges){DisjointSet sets(n);SpanningTree r{0,{}};auto sorted=mergeSort(edges,Comparator<Edge>([](const Edge&a,const Edge&b){return defaultCompare(a.weight,b.weight);}));for(auto e:sorted){if(!sets.unite(e.from,e.to))continue;r.edges.push_back(e);r.weight+=e.weight;if(int(r.edges.size())==n-1)break;}return r;}
inline SpanningTree prim(const WeightedAdjacencyList&g,int s=0){SpanningTree r{0,{}};if(g.empty())return r;std::vector<bool>seen(g.size());BinaryHeap<Edge>heap([](const Edge&a,const Edge&b){return defaultCompare(a.weight,b.weight);});auto visit=[&](int v){seen[v]=true;for(auto e:g[v])if(!seen[e.to])heap.push({v,e.to,e.weight});};visit(s);while(!heap.isEmpty()&&int(r.edges.size())<int(g.size())-1){auto e=*heap.pop();if(seen[e.to])continue;r.edges.push_back(e);r.weight+=e.weight;visit(e.to);}return r;}
}
