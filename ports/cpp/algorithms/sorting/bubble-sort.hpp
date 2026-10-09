#pragma once
#include "../../support.hpp"
#include "../../shared/compare.hpp"
namespace algs {
template<class T> std::vector<T> bubbleSort(std::vector<T> a,Comparator<T> c=defaultCompare<T>) { for(int end=int(a.size())-1;end>0;--end){bool swapped=false;for(int i=0;i<end;++i)if(c(a[i],a[i+1])>0){std::swap(a[i],a[i+1]);swapped=true;}if(!swapped)break;}return a;}
}
