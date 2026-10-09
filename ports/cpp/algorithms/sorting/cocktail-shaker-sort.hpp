#pragma once
#include "../../support.hpp"
#include "../../shared/compare.hpp"
namespace algs {
template<class T> std::vector<T> cocktailShakerSort(std::vector<T>a,Comparator<T>c=defaultCompare<T>){int start=0,end=int(a.size())-1;bool swapped=true;auto swap=[&](int i){if(c(a[i],a[i+1])>0){std::swap(a[i],a[i+1]);swapped=true;}};while(swapped&&start<end){swapped=false;for(int i=start;i<end;++i)swap(i);--end;if(!swapped)break;swapped=false;for(int i=end-1;i>=start;--i)swap(i);++start;}return a;}
}
