#pragma once
#include "../../support.hpp"
#include "../../shared/compare.hpp"
namespace algs {
template<class T> std::vector<T> heapSort(std::vector<T>a,Comparator<T>c=defaultCompare<T>){auto sift=[&](int root,int end){while(true){int l=2*root+1,r=l+1,m=root;if(l<end&&c(a[l],a[m])>0)m=l;if(r<end&&c(a[r],a[m])>0)m=r;if(m==root)return;std::swap(a[root],a[m]);root=m;}};for(int i=int(a.size())/2-1;i>=0;--i)sift(i,int(a.size()));for(int end=int(a.size())-1;end>0;--end){std::swap(a[0],a[end]);sift(0,end);}return a;}
}
