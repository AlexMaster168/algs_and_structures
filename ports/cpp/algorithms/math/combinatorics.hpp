#pragma once
#include "../../support.hpp"
namespace algs {
inline BigInt factorial(int n){if(n<0)throw std::out_of_range("Factorial is defined for non-negative integers");BigInt r=1;for(int i=2;i<=n;++i)r*=i;return r;}inline BigInt binomial(int n,int k){if(k<0||k>n)return 0;k=std::min(k,n-k);BigInt r=1;for(int i=1;i<=k;++i)r=r*(n-k+i)/i;return r;}inline BigInt catalan(int n){return binomial(2*n,n)/(n+1);}
inline Matrix pascalTriangle(int rows){Matrix t;for(int r=0;r<rows;++r){Numbers row{1};for(int c=1;c<r;++c)row.push_back(t[r-1][c-1]+t[r-1][c]);if(r>0)row.push_back(1);t.push_back(row);}return t;}
inline bool nextPermutation(Numbers&a){int i=int(a.size())-2;while(i>=0&&a[i]>=a[i+1])--i;if(i<0){std::reverse(a.begin(),a.end());return false;}int j=int(a.size())-1;while(a[j]<=a[i])--j;std::swap(a[i],a[j]);for(int l=i+1,r=int(a.size())-1;l<r;++l,--r)std::swap(a[l],a[r]);return true;}
}
