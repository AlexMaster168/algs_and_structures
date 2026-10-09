#pragma once
#include "../../support.hpp"
namespace algs {
class FenwickTree{Numbers tree;public:explicit FenwickTree(int n):tree(n+1){}explicit FenwickTree(const Numbers&a):tree(1,0){tree.insert(tree.end(),a.begin(),a.end());for(int i=1;i<int(tree.size());++i){int p=i+(i&-i);if(p<int(tree.size()))tree[p]+=tree[i];}}int size()const{return int(tree.size())-1;}void add(int index,double d){if(index<0||index>=size())throw std::out_of_range("Invalid index");for(int i=index+1;i<int(tree.size());i+=i&-i)tree[i]+=d;}void set(int index,double v){add(index,v-rangeSum(index,index));}double prefixSum(int index)const{double sum=0;for(int i=std::min(index+1,size());i>0;i-=i&-i)sum+=tree[i];return sum;}double rangeSum(int l,int r)const{return prefixSum(r)-(l>0?prefixSum(l-1):0);}};
}
