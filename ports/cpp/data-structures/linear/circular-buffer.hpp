#pragma once
#include "../../support.hpp"
namespace algs {
template<class T>class CircularBuffer{std::vector<std::optional<T>>buffer;int start=0,length=0;public:const int capacity;explicit CircularBuffer(int c):buffer(c>0?c:0),capacity(c){if(c<=0)throw std::out_of_range("Capacity must be a positive integer");}int size()const{return length;}bool isFull()const{return length==capacity;}bool isEmpty()const{return !length;}std::optional<T>push(T v){if(isFull()){auto old=buffer[start];buffer[start]=std::move(v);start=(start+1)%capacity;return old;}buffer[(start+length)%capacity]=std::move(v);++length;return {};}std::optional<T>shift(){if(!length)return {};auto v=buffer[start];buffer[start].reset();start=(start+1)%capacity;--length;return v;}std::vector<T>toArray()const{std::vector<T>r;for(int i=0;i<length;++i)r.push_back(*buffer[(start+i)%capacity]);return r;}};
}
