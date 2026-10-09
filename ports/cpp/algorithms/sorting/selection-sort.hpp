#pragma once
#include "../../support.hpp"
#include "../../shared/compare.hpp"
namespace algs {
template<class T> std::vector<T> selectionSort(std::vector<T>a,Comparator<T>c=defaultCompare<T>){for(int i=0;i<int(a.size())-1;++i){int m=i;for(int j=i+1;j<int(a.size());++j)if(c(a[j],a[m])<0)m=j;if(m!=i)std::swap(a[i],a[m]);}return a;}
}
