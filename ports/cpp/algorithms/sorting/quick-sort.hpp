#pragma once
#include "../../support.hpp"
#include "../../shared/compare.hpp"
namespace algs {
template<class T> std::pair<int,int> partition3(std::vector<T>&a,int low,int high,Comparator<T>c){T pivot=a[low+int(random()*(high-low+1))];int lt=low,gt=high,i=low;while(i<=gt){int o=c(a[i],pivot);if(o<0)std::swap(a[lt++],a[i++]);else if(o>0)std::swap(a[i],a[gt--]);else ++i;}return {lt,gt};}
template<class T> int lomutoPartition(std::vector<T>&a,int low,int high,Comparator<T>c){T pivot=a[high];int b=low;for(int i=low;i<high;++i)if(c(a[i],pivot)<0)std::swap(a[b++],a[i]);std::swap(a[b],a[high]);return b;}
template<class T> std::vector<T> quickSort(std::vector<T>a,Comparator<T>c=defaultCompare<T>){std::vector<std::pair<int,int>>stack{{0,int(a.size())-1}};while(!stack.empty()){auto [l,h]=stack.back();stack.pop_back();if(l>=h)continue;auto [lt,gt]=partition3(a,l,h,c);stack.emplace_back(l,lt-1);stack.emplace_back(gt+1,h);}return a;}
template<class T> std::vector<T> quickSortFunctional(const std::vector<T>&a,Comparator<T>c=defaultCompare<T>){if(a.size()<2)return a;std::vector<T>l,g;for(int i=1;i<int(a.size());++i)(c(a[i],a[0])<0?l:g).push_back(a[i]);auto r=quickSortFunctional(l,c);r.push_back(a[0]);g=quickSortFunctional(g,c);r.insert(r.end(),g.begin(),g.end());return r;}
}
