#pragma once
#include "../../support.hpp"
namespace algs {
template<class Signature,class Key> class Memoized;
template<class R,class...Args,class Key> class Memoized<R(Args...),Key>{std::function<R(Args...)>fn;std::function<Key(Args...)>resolve;public:std::map<Key,R>cache;Memoized(std::function<R(Args...)>f,std::function<Key(Args...)>k):fn(f),resolve(k){}R operator()(Args...args){auto key=resolve(args...);auto it=cache.find(key);if(it!=cache.end())return it->second;R value=fn(args...);cache.emplace(key,value);return value;}};
template<class R,class...Args,class Key> auto memoize(std::function<R(Args...)>f,std::function<Key(Args...)>key){return Memoized<R(Args...),Key>(f,key);}
template<class R,class...Args> auto memoize(std::function<R(Args...)>f){using Key=std::tuple<std::decay_t<Args>...>;return memoize(f,std::function<Key(Args...)>([](Args...args){return Key(args...);}));}
}
