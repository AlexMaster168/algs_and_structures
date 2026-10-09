#pragma once
#include "../../support.hpp"
namespace algs {
inline int jumpSearch(const Numbers&a,double t){int n=int(a.size());if(!n)return -1;int step=int(std::sqrt(n)),prev=0,cur=step;while(cur<n&&a[cur-1]<t){prev=cur;cur+=step;}for(int i=prev;i<std::min(cur,n);++i)if(a[i]==t)return i;return -1;}
}
