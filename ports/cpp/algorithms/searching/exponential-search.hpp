#pragma once
#include "../../support.hpp"
#include "binary-search.hpp"
namespace algs {
template<class T> int exponentialSearch(const std::vector<T>&a,const T&t,Comparator<T>c=defaultCompare<T>){if(a.empty())return -1;if(!c(a[0],t))return 0;int b=1;while(b<int(a.size())&&c(a[b],t)<0)b*=2;return binarySearch(a,t,c,b/2,std::min(b,int(a.size())-1));}
}
