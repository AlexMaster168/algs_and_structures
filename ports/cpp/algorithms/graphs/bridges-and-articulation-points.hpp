#pragma once
#include "../../support.hpp"
#include "types.hpp"
#include "../sorting/merge-sort.hpp"
namespace algs {
struct CutStructure{std::vector<std::pair<int,int>>bridges;std::vector<int>articulationPoints;};inline CutStructure findBridgesAndArticulationPoints(const AdjacencyList&g){std::vector<int>entry(g.size(),-1),low(g.size());std::vector<bool>cut(g.size());CutStructure r;int timer=0;std::function<void(int,int)>visit=[&](int v,int p){entry[v]=low[v]=timer++;int children=0;bool skipped=false;for(int n:g[v]){if(n==p&&!skipped){skipped=true;continue;}if(entry[n]!=-1){low[v]=std::min(low[v],entry[n]);continue;}visit(n,v);++children;low[v]=std::min(low[v],low[n]);if(low[n]>entry[v])r.bridges.emplace_back(std::min(v,n),std::max(v,n));if(p!=-1&&low[n]>=entry[v])cut[v]=true;}if(p==-1&&children>1)cut[v]=true;};for(int v=0;v<int(g.size());++v)if(entry[v]==-1)visit(v,-1);r.bridges=mergeSort(r.bridges);for(int v=0;v<int(g.size());++v)if(cut[v])r.articulationPoints.push_back(v);return r;}
}
