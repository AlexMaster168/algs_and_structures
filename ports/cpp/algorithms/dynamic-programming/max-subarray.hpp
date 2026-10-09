#pragma once
#include "../../support.hpp"
namespace algs {
struct MaxSubarrayResult{double sum;int start,end;};inline MaxSubarrayResult maxSubarray(const Numbers&a){if(a.empty())throw std::out_of_range("Array must not be empty");MaxSubarrayResult best{a[0],0,0};double sum=a[0];int start=0;for(int i=1;i<int(a.size());++i){if(sum<0){sum=a[i];start=i;}else sum+=a[i];if(sum>best.sum)best={sum,start,i};}return best;}
}
