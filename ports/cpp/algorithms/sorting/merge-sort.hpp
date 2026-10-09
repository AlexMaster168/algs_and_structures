#pragma once
#include "../../support.hpp"
#include "../../shared/compare.hpp"
namespace algs {
template<class T> std::vector<T> merge(const std::vector<T>&a,const std::vector<T>&b,Comparator<T>c=defaultCompare<T>){std::vector<T>r;int i=0,j=0;while(i<int(a.size())&&j<int(b.size()))if(c(a[i],b[j])<=0)r.push_back(a[i++]);else r.push_back(b[j++]);while(i<int(a.size()))r.push_back(a[i++]);while(j<int(b.size()))r.push_back(b[j++]);return r;}
template<class T> std::vector<T> mergeSort(const std::vector<T>&a,Comparator<T>c=defaultCompare<T>){if(a.size()<2)return a;int m=int(a.size())/2;return merge(mergeSort(std::vector<T>(a.begin(),a.begin()+m),c),mergeSort(std::vector<T>(a.begin()+m,a.end()),c),c);}
template<class T> std::vector<T> bottomUpMergeSort(std::vector<T>a,Comparator<T>c=defaultCompare<T>){std::vector<T>b=a;int n=int(a.size());for(int w=1;w<n;w*=2){for(int l=0;l<n;l+=2*w){int m=std::min(l+w,n),r=std::min(l+2*w,n),i=l,j=m,k=l;while(i<m&&j<r)b[k++]=c(a[i],a[j])<=0?a[i++]:a[j++];while(i<m)b[k++]=a[i++];while(j<r)b[k++]=a[j++];}a.swap(b);}return a;}
}
