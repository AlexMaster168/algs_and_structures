#pragma once
#include "../../support.hpp"
namespace algs {
inline double gcd(double a,double b){a=std::abs(a);b=std::abs(b);while(b!=0){double t=std::fmod(a,b);a=b;b=t;}return a;}inline double lcm(double a,double b){return a==0||b==0?0:std::abs(a/gcd(a,b)*b);}struct ExtendedGcdResult{double gcd,x,y;};inline ExtendedGcdResult extendedGcd(double a,double b){if(b==0)return {a,1,0};auto r=extendedGcd(b,std::fmod(a,b));return {r.gcd,r.y,r.x-std::floor(a/b)*r.y};}inline std::optional<double>modInverse(double a,double m){auto r=extendedGcd(std::fmod(std::fmod(a,m)+m,m),m);if(r.gcd!=1)return {};return std::fmod(std::fmod(r.x,m)+m,m);}
}
