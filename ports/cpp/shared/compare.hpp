#pragma once
#include "../support.hpp"
namespace algs {
template<class T> using Comparator = std::function<int(const T&,const T&)>;
template<class T> int defaultCompare(const T& a,const T& b) { return a<b?-1:a>b?1:0; }
template<class T> Comparator<T> reverseCompare(Comparator<T> compare=defaultCompare<T>) { return [compare](const T&a,const T&b){return compare(b,a);}; }
}
