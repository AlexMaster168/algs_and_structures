#pragma once
#include "../../support.hpp"
namespace algs {
class SqrtDecomposition{Numbers values,blocks;int blockSize;public:explicit SqrtDecomposition(Numbers a):values(std::move(a)),blockSize(std::max(1,int(std::ceil(std::sqrt(values.size()))))){blocks.resize((values.size()+blockSize-1)/blockSize);for(int i=0;i<int(values.size());++i)blocks[i/blockSize]+=values[i];}void update(int i,double v){blocks.at(i/blockSize)+=v-values.at(i);values[i]=v;}double rangeSum(int l,int r)const{double sum=0;int i=l;while(i<=r&&i%blockSize)sum+=values.at(i++);while(i+blockSize-1<=r){sum+=blocks.at(i/blockSize);i+=blockSize;}while(i<=r)sum+=values.at(i++);return sum;}};
}
