#pragma once
#include "../../support.hpp"
#include "memoize.hpp"
namespace algs {
inline double fibonacciRecursive(int n){return n<2?n:fibonacciRecursive(n-1)+fibonacciRecursive(n-2);}
inline double fibonacciMemo(int n){static std::map<int,double>cache;auto it=cache.find(n);if(it!=cache.end())return it->second;double v=n<2?n:fibonacciMemo(n-1)+fibonacciMemo(n-2);cache[n]=v;return v;}
inline BigInt fibonacci(int n){BigInt a=0,b=1;if(n==0)return a;for(int i=1;i<n;++i){BigInt t=a+b;a=b;b=t;}return b;}
inline BigInt fibonacciFast(int n){std::function<std::pair<BigInt,BigInt>(int)>pair=[&](int k)->std::pair<BigInt,BigInt>{if(k==0)return {0,1};auto [a,b]=pair(k>>1);BigInt c=a*(2*b-a),d=a*a+b*b;return k&1?std::pair<BigInt,BigInt>{d,c+d}:std::pair<BigInt,BigInt>{c,d};};return pair(n).first;}
}
