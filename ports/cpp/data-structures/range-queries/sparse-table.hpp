#pragma once
#include "../../support.hpp"
namespace algs {
template<class T>class SparseTable{std::vector<std::vector<T>>table;std::vector<int>log;std::function<T(const T&,const T&)>combine;public:SparseTable(const std::vector<T>&a,std::function<T(const T&,const T&)>c):table{a},log(a.size()+1),combine(c){int n=int(a.size());for(int i=2;i<=n;++i)log[i]=log[i/2]+1;for(int k=1;(1<<k)<=n;++k){std::vector<T>row;int half=1<<(k-1);for(int i=0;i+(1<<k)<=n;++i)row.push_back(combine(table[k-1][i],table[k-1][i+half]));table.push_back(row);}}T query(int l,int r)const{if(l<0||r>=int(table[0].size())||l>r)throw std::out_of_range("Invalid range");int k=log[r-l+1];return combine(table[k][l],table[k][r-(1<<k)+1]);}};
inline SparseTable<double>minSparseTable(const Numbers&a){return {a,[](double x,double y){return std::min(x,y);}};}inline SparseTable<double>maxSparseTable(const Numbers&a){return {a,[](double x,double y){return std::max(x,y);}};}
}
