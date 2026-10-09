#pragma once
#include "../../support.hpp"
namespace algs {
inline double fastPower(double b,std::int64_t e){if(e<0)return 1/fastPower(b,-e);double r=1;while(e>0){if(e&1)r*=b;b*=b;e/=2;}return r;}
inline BigInt modPow(BigInt b,BigInt e,const BigInt&m){if(m==1)return 0;BigInt r=1;b%=m;if(b<0)b+=m;while(e>0){if(e&1)r=r*b%m;b=b*b%m;e>>=1;}return r;}
inline double integerSqrt(double n){if(n<0)throw std::out_of_range("Square root of a negative number");if(n<2)return n;double x=n,y=std::floor((x+1)/2);while(y<x){x=y;y=std::floor((x+std::floor(n/x))/2);}return x;}
inline double newtonSqrt(double n,double epsilon=1e-12){if(n<0)throw std::out_of_range("Square root of a negative number");if(n==0)return 0;double x=n;while(std::abs(x*x-n)>epsilon*n)x=(x+n/x)/2;return x;}
}
