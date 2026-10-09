#pragma once
#include "../../support.hpp"
namespace algs {
struct FloydWarshallResult{Matrix distance;std::vector<std::vector<int>>next;bool hasNegativeCycle;};inline FloydWarshallResult floydWarshall(Matrix weights){int n=int(weights.size());FloydWarshallResult r{weights,std::vector<std::vector<int>>(n,std::vector<int>(n,-1)),false};for(int i=0;i<n;++i){for(int j=0;j<n;++j)if(i==j||weights[i][j]!=infinity)r.next[i][j]=j;if(r.distance[i][i]>0)r.distance[i][i]=0;}for(int k=0;k<n;++k)for(int i=0;i<n;++i){if(r.distance[i][k]==infinity)continue;for(int j=0;j<n;++j){double v=r.distance[i][k]+r.distance[k][j];if(v<r.distance[i][j]){r.distance[i][j]=v;r.next[i][j]=r.next[i][k];}}}for(int i=0;i<n;++i)if(r.distance[i][i]<0)r.hasNegativeCycle=true;return r;}
inline std::optional<std::vector<int>>floydWarshallPath(const std::vector<std::vector<int>>&next,int from,int to){if(next.at(from).at(to)==-1)return {};std::vector<int>r{from};while(from!=to){from=next[from][to];r.push_back(from);if(r.size()>next.size()+1)throw std::domain_error("Cyclic next matrix");}return r;}
}
