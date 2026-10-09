#pragma once
#include "../../support.hpp"
#include "binary-heap.hpp"
namespace algs {
template<class T>class PriorityQueue{struct Entry{T value;double priority;std::uint64_t order;};BinaryHeap<Entry>heap{[](const Entry&a,const Entry&b){return a.priority<b.priority?-1:a.priority>b.priority?1:a.order<b.order?-1:a.order>b.order?1:0;}};std::uint64_t counter=0;public:int size()const{return heap.size();}bool isEmpty()const{return heap.isEmpty();}PriorityQueue&enqueue(T value,double priority){heap.push({value,priority,counter++});return *this;}std::optional<T>dequeue(){auto e=heap.pop();return e?std::optional<T>(e->value):std::optional<T>{};}std::optional<T>peek()const{auto e=heap.peek();return e?std::optional<T>(e->value):std::optional<T>{};}std::optional<double>peekPriority()const{auto e=heap.peek();return e?std::optional<double>(e->priority):std::optional<double>{};}};
}
