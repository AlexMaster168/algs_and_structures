#pragma once
#include "../../support.hpp"
namespace algs {
inline int interpolationSearch(const Numbers&a,double t){int l=0,h=int(a.size())-1;while(l<=h&&t>=a[l]&&t<=a[h]){if(a[h]==a[l])return a[l]==t?l:-1;int p=l+int(std::floor((t-a[l])*(h-l)/(a[h]-a[l])));if(a[p]==t)return p;if(a[p]<t)l=p+1;else h=p-1;}return -1;}
}
