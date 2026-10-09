#pragma once
#include "../../support.hpp"
namespace algs {
inline std::optional<Numbers>subsetSum(const Numbers&a,int target){std::vector<int>by(target+1,-1);std::vector<bool>reachable(target+1);reachable[0]=true;for(int i=0;i<int(a.size());++i){int v=int(a[i]);if(v<0)throw std::invalid_argument("Negative value");for(int s=target;s>=v;--s)if(!reachable[s]&&reachable[s-v]){reachable[s]=true;by[s]=i;}}if(!reachable[target])return {};Numbers chosen;for(int s=target;s>0;s-=int(a[by[s]]))chosen.push_back(a[by[s]]);std::reverse(chosen.begin(),chosen.end());return chosen;}
inline bool canPartition(const Numbers&a){double total=std::accumulate(a.begin(),a.end(),0.0);return std::fmod(total,2)==0&&subsetSum(a,int(total/2)).has_value();}
}
