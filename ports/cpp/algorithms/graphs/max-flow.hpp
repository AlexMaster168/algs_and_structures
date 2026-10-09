#pragma once
#include "../../support.hpp"
namespace algs {
inline double edmondsKarp(Matrix residual,int source,int sink){if(source==sink)throw std::invalid_argument("Source and sink must differ");int n=int(residual.size());double flow=0;while(true){std::vector<int>parent(n,-1),q{source};parent[source]=source;for(int h=0;h<int(q.size())&&parent[sink]==-1;++h){int v=q[h];for(int next=0;next<n;++next)if(parent[next]==-1&&residual[v][next]>0){parent[next]=v;q.push_back(next);}}if(parent[sink]==-1)return flow;double bottleneck=infinity;for(int v=sink;v!=source;v=parent[v])bottleneck=std::min(bottleneck,residual[parent[v]][v]);for(int v=sink;v!=source;v=parent[v]){residual[parent[v]][v]-=bottleneck;residual[v][parent[v]]+=bottleneck;}flow+=bottleneck;}}
}
