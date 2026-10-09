#pragma once
#include "../../support.hpp"
#include "../../shared/compare.hpp"
namespace algs {
template<class T> int binarySearch(const std::vector<T>&a,const T&target,Comparator<T>c=defaultCompare<T>,int low=0,int high=-2){if(high==-2)high=int(a.size())-1;while(low<=high){int m=low+(high-low)/2,o=c(a[m],target);if(!o)return m;if(o<0)low=m+1;else high=m-1;}return -1;}
template<class T> int binarySearchRecursive(const std::vector<T>&a,const T&t,Comparator<T>c=defaultCompare<T>,int l=0,int h=-2){if(h==-2)h=int(a.size())-1;if(l>h)return -1;int m=l+(h-l)/2,o=c(a[m],t);return !o?m:o<0?binarySearchRecursive(a,t,c,m+1,h):binarySearchRecursive(a,t,c,l,m-1);}
template<class T> int lowerBound(const std::vector<T>&a,const T&t,Comparator<T>c=defaultCompare<T>){int l=0,h=int(a.size());while(l<h){int m=(l+h)/2;if(c(a[m],t)<0)l=m+1;else h=m;}return l;}
template<class T> int upperBound(const std::vector<T>&a,const T&t,Comparator<T>c=defaultCompare<T>){int l=0,h=int(a.size());while(l<h){int m=(l+h)/2;if(c(a[m],t)<=0)l=m+1;else h=m;}return l;}
inline int firstTrue(int l,int h,const std::function<bool(int)>&p){while(l<h){int m=l+(h-l)/2;if(p(m))h=m;else l=m+1;}return l;}
}
