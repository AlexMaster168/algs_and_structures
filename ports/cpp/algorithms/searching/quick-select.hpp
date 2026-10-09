#pragma once
#include "../../support.hpp"
#include "../sorting/quick-sort.hpp"
namespace algs {
template<class T> T quickSelect(std::vector<T>a,int k,Comparator<T>c=defaultCompare<T>){if(k<0||k>=int(a.size()))throw std::out_of_range("k is out of bounds");int l=0,h=int(a.size())-1;while(true){int p=l+int(random()*(h-l+1));std::swap(a[p],a[h]);p=lomutoPartition(a,l,h,c);if(p==k)return a[p];if(p<k)l=p+1;else h=p-1;}}
inline double median(const Numbers&a){if(a.empty())throw std::out_of_range("Median of an empty array is undefined");int m=int(a.size())/2;return a.size()%2?quickSelect(a,m):(quickSelect(a,m-1)+quickSelect(a,m))/2;}
}
