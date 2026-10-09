#pragma once
#include "../../support.hpp"
namespace algs {
inline std::function<double()>mulberry32(std::uint32_t seed){return [state=seed]()mutable{state+=0x6d2b79f5u;std::uint32_t t=state;t=(t^(t>>15))*(t|1u);t^=t+(t^(t>>7))*(t|61u);return double(t^(t>>14))/4294967296.0;};}
template<class T>std::vector<T>fisherYatesShuffle(std::vector<T>a,std::function<double()>rng=random){for(int i=int(a.size())-1;i>0;--i){int j=int(std::floor(rng()*(i+1)));std::swap(a[i],a.at(j));}return a;}
template<class Range>auto reservoirSample(const Range&stream,int size,std::function<double()>rng=random){using T=std::decay_t<decltype(*std::begin(stream))>;std::vector<T>r;int seen=0;for(auto&item:stream){++seen;if(int(r.size())<size)r.push_back(item);else{int j=int(std::floor(rng()*seen));if(j<size)r[j]=item;}}return r;}
inline double monteCarloPi(int samples,std::function<double()>rng=random){int inside=0;for(int i=0;i<samples;++i){double x=rng(),y=rng();if(x*x+y*y<=1)++inside;}return 4.0*inside/samples;}
}
