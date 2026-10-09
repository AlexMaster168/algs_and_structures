#pragma once
#include "../../support.hpp"
#include "insertion-sort.hpp"
#include "merge-sort.hpp"
namespace algs {
template<class T> std::vector<T> timSort(std::vector<T>a,Comparator<T>c=defaultCompare<T>){int n=int(a.size()),run=n,remainder=0;while(run>=32){remainder|=run&1;run>>=1;}run+=remainder;if(!run)return a;for(int l=0;l<n;l+=run)insertionSortRange(a,l,std::min(l+run-1,n-1),c);for(int size=run;size<n;size*=2)for(int l=0;l<n;l+=2*size){int m=l+size-1,r=std::min(l+2*size-1,n-1);if(m<r){std::vector<T>x(a.begin()+l,a.begin()+m+1),y(a.begin()+m+1,a.begin()+r+1);auto z=merge(x,y,c);std::copy(z.begin(),z.end(),a.begin()+l);}}return a;}
}
