#pragma once
#include "../../support.hpp"
namespace algs {
inline int editDistance(const std::string&a,const std::string&b){std::vector<int>prev(b.size()+1);std::iota(prev.begin(),prev.end(),0);for(int i=1;i<=int(a.size());++i){std::vector<int>cur(b.size()+1);cur[0]=i;for(int j=1;j<=int(b.size());++j)cur[j]=std::min({prev[j]+1,cur[j-1]+1,prev[j-1]+(a[i-1]!=b[j-1])});prev.swap(cur);}return prev.back();}
}
