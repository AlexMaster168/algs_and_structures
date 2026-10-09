#pragma once
#include "../../support.hpp"
#include "../sorting/merge-sort.hpp"
namespace algs {
inline std::optional<std::pair<int,int>>twoSumSorted(const Numbers&a,double t){int l=0,r=int(a.size())-1;while(l<r){double sum=a[l]+a[r];if(sum==t)return std::pair<int,int>{l,r};if(sum<t)++l;else --r;}return {};}
inline std::optional<std::pair<int,int>>twoSum(const Numbers&a,double t){std::map<double,int>seen;for(int i=0;i<int(a.size());++i){auto it=seen.find(t-a[i]);if(it!=seen.end())return std::pair<int,int>{it->second,i};seen[a[i]]=i;}return {};}
inline std::vector<std::array<double,3>>threeSum(const Numbers&a,double t=0){auto s=mergeSort(a);std::vector<std::array<double,3>>r;for(int i=0;i<int(s.size())-2;++i){if(i&&s[i]==s[i-1])continue;int l=i+1,h=int(s.size())-1;while(l<h){double sum=s[i]+s[l]+s[h];if(sum<t)++l;else if(sum>t)--h;else{r.push_back({s[i],s[l],s[h]});while(l<h&&s[l]==s[l+1])++l;while(l<h&&s[h]==s[h-1])--h;++l;--h;}}}return r;}
inline double containerWithMostWater(const Numbers&a){double best=0;for(int l=0,r=int(a.size())-1;l<r;){best=std::max(best,std::min(a[l],a[r])*(r-l));if(a[l]<a[r])++l;else --r;}return best;}
inline int removeDuplicatesSorted(Numbers&a){int w=0;for(int r=0;r<int(a.size());++r)if(!r||a[r]!=a[w-1])a[w++]=a[r];a.resize(w);return w;}
inline Numbers&dutchNationalFlag(Numbers&a,double pivot){int l=0,m=0,h=int(a.size())-1;while(m<=h)if(a[m]<pivot)std::swap(a[l++],a[m++]);else if(a[m]>pivot)std::swap(a[m],a[h--]);else ++m;return a;}
template<class T,class F>bool hasCycleFloyd(T start,F next){std::optional<T>slow=start,fast=start;while(fast){fast=next(*fast);if(!fast)return false;fast=next(*fast);slow=next(*slow);if(fast&&fast==slow)return true;}return false;}
}
