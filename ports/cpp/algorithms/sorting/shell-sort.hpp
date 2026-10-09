#pragma once
#include "../../support.hpp"
#include "../../shared/compare.hpp"
namespace algs {
template<class T> std::vector<T> shellSort(std::vector<T>a,Comparator<T>c=defaultCompare<T>){int gap=1;while(gap<int(a.size())/3)gap=gap*3+1;for(;gap>=1;gap=(gap-1)/3)for(int i=gap;i<int(a.size());++i){T v=a[i];int j=i;while(j>=gap&&c(a[j-gap],v)>0){a[j]=a[j-gap];j-=gap;}a[j]=v;}return a;}
}
