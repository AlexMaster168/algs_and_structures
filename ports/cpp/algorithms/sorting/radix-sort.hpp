#pragma once
#include "../../support.hpp"
namespace algs {
inline Numbers radixSort(const Numbers&a,int base=10){if(base<2)throw std::invalid_argument("Invalid base");Numbers neg,pos;for(double v:a){if(!std::isfinite(v)||std::floor(v)!=v)throw std::invalid_argument("Radix sort works only with integers");(v<0?neg:pos).push_back(std::abs(v));}auto sort=[base](Numbers a){double m=0;for(double v:a)m=std::max(m,v);for(double exp=1;std::floor(m/exp)>0;exp*=base){std::vector<Numbers>b(base);for(double v:a)b[std::size_t(std::fmod(std::floor(v/exp),base))].push_back(v);a.clear();for(auto& bucket:b)a.insert(a.end(),bucket.begin(),bucket.end());}return a;};neg=sort(neg);pos=sort(pos);Numbers out;for(auto it=neg.rbegin();it!=neg.rend();++it)out.push_back(-*it);out.insert(out.end(),pos.begin(),pos.end());return out;}
}
