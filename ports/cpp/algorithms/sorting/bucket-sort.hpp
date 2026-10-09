#pragma once
#include "../../support.hpp"
#include "insertion-sort.hpp"
namespace algs {
inline Numbers bucketSort(const Numbers&a,int count=0){if(a.size()<2)return a;if(!count)count=std::max(1,int(std::floor(std::sqrt(a.size())+0.5)));if(count<1)throw std::invalid_argument("Invalid bucket count");double lo=a[0],hi=a[0];for(double v:a){lo=std::min(lo,v);hi=std::max(hi,v);}if(lo==hi)return a;std::vector<Numbers>b(count);double range=(hi-lo)/count;for(double v:a)b[std::min(count-1,int(std::floor((v-lo)/range)))].push_back(v);Numbers out;for(auto& bucket:b){bucket=insertionSort(bucket);out.insert(out.end(),bucket.begin(),bucket.end());}return out;}
}
