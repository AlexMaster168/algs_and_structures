#pragma once
#include "../../support.hpp"
namespace algs {
inline std::uint32_t fnv1a(const std::string&s,std::uint32_t seed=0x811c9dc5){std::uint32_t h=seed;for(unsigned char c:s){h^=c;h*=0x01000193u;}return h;}template<class T>std::uint32_t defaultHasher(const T&key){std::string type=std::is_same_v<T,std::string>?"string":std::is_same_v<T,bool>?"boolean":std::is_arithmetic_v<T>?"number":"object";return fnv1a(type+":"+text(key));}
}
