#pragma once
#include "../../support.hpp"
#include "../../shared/compare.hpp"
namespace algs {
template<class T> void insertionSortRange(std::vector<T>&a,int left,int right,Comparator<T>c){for(int i=left+1;i<=right;++i){T v=a[i];int j=i-1;while(j>=left&&c(a[j],v)>0){a[j+1]=a[j];--j;}a[j+1]=v;}}
template<class T> std::vector<T> insertionSort(std::vector<T>a,Comparator<T>c=defaultCompare<T>){insertionSortRange(a,0,int(a.size())-1,c);return a;}
}
