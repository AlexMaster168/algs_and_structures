#pragma once
#include "../../support.hpp"
namespace algs {
inline Numbers longestIncreasingSubsequence(const Numbers&a){std::vector<int>tails,prev(a.size(),-1);for(int i=0;i<int(a.size());++i){int l=0,h=int(tails.size());while(l<h){int m=(l+h)/2;if(a[tails[m]]<a[i])l=m+1;else h=m;}if(l)prev[i]=tails[l-1];if(l==int(tails.size()))tails.push_back(i);else tails[l]=i;}Numbers r;for(int i=tails.empty()?-1:tails.back();i!=-1;i=prev[i])r.push_back(a[i]);std::reverse(r.begin(),r.end());return r;}
}
