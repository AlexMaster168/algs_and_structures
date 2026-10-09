#pragma once
#include "../../support.hpp"
namespace algs {
template<class T>class Stack{std::vector<T>items;public:int size()const{return int(items.size());}bool isEmpty()const{return items.empty();}Stack&push(T v){items.push_back(std::move(v));return *this;}std::optional<T>pop(){if(items.empty())return {};T v=items.back();items.pop_back();return v;}std::optional<T>peek()const{return items.empty()?std::optional<T>{}:items.back();}std::vector<T>toArray()const{return {items.rbegin(),items.rend()};}auto begin()const{return items.rbegin();}auto end()const{return items.rend();}};
}
