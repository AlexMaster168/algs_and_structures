#pragma once
#include "../../support.hpp"
namespace algs {
inline Numbers countingSort(const Numbers&a){if(a.empty())return {};double lo=a[0],hi=a[0];for(double v:a){if(!std::isfinite(v)||std::floor(v)!=v)throw std::invalid_argument("Counting sort works only with integers");lo=std::min(lo,v);hi=std::max(hi,v);}std::vector<std::size_t>counts(std::size_t(hi-lo+1));for(double v:a)++counts[std::size_t(v-lo)];for(std::size_t i=1;i<counts.size();++i)counts[i]+=counts[i-1];Numbers out(a.size());for(int i=int(a.size())-1;i>=0;--i)out[--counts[std::size_t(a[i]-lo)]]=a[i];return out;}
}
