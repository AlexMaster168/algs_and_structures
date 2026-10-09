#pragma once
#include "../../support.hpp"
namespace algs {
inline double ternarySearchMax(const std::function<double(double)>&f,double l,double h,double epsilon=1e-9){if(epsilon<=0)throw std::invalid_argument("Invalid epsilon");while(h-l>epsilon){double m1=l+(h-l)/3,m2=h-(h-l)/3;if(f(m1)<f(m2))l=m1;else h=m2;}return (l+h)/2;}
inline double ternarySearchMin(const std::function<double(double)>&f,double l,double h,double e=1e-9){return ternarySearchMax([&](double x){return -f(x);},l,h,e);}
inline int findPeakIndex(const Numbers&a){int l=0,h=int(a.size())-1;while(l<h){int m=(l+h)/2;if(a[m]<a[m+1])l=m+1;else h=m;}return l;}
}
