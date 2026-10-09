#pragma once
#include "../../support.hpp"
namespace algs {
template<class T>class Queue{std::vector<T>items;std::size_t head=0;public:int size()const{return int(items.size()-head);}bool isEmpty()const{return size()==0;}Queue&enqueue(T v){items.push_back(std::move(v));return *this;}std::optional<T>dequeue(){if(isEmpty())return {};T v=items[head++];if(head*2>=items.size()){items.erase(items.begin(),items.begin()+head);head=0;}return v;}std::optional<T>peek()const{return isEmpty()?std::optional<T>{}:items[head];}std::vector<T>toArray()const{return {items.begin()+head,items.end()};}auto begin()const{return items.begin()+head;}auto end()const{return items.end();}};
}
