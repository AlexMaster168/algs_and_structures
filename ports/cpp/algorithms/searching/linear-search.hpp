#pragma once
#include "../../support.hpp"
namespace algs {
template<class T> int linearSearch(const std::vector<T>&a,const T&t){for(int i=0;i<int(a.size());++i)if(a[i]==t)return i;return -1;}
template<class T,class P> std::vector<int> linearSearchAll(const std::vector<T>&a,P p){std::vector<int>r;for(int i=0;i<int(a.size());++i)if(p(a[i],i))r.push_back(i);return r;}
}
