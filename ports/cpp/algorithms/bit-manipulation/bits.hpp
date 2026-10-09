#pragma once
#include "../../support.hpp"
namespace algs {
inline int getBit(std::uint32_t v,int p){return (v>>(p&31))&1;}inline std::uint32_t setBit(std::uint32_t v,int p){return v|(std::uint32_t(1)<<(p&31));}inline std::uint32_t clearBit(std::uint32_t v,int p){return v&~(std::uint32_t(1)<<(p&31));}inline std::uint32_t toggleBit(std::uint32_t v,int p){return v^(std::uint32_t(1)<<(p&31));}
inline int countSetBits(std::uint32_t v){int c=0;for(;v;v&=v-1)++c;return c;}inline bool isPowerOfTwo(std::int64_t v){return v>0&&(std::uint32_t(v)&(std::uint32_t(v)-1))==0;}inline std::int32_t lowestSetBit(std::uint32_t v){return std::int32_t(v&(~v+1));}
inline std::int32_t singleNumber(const std::vector<std::int32_t>&a){std::uint32_t r=0;for(auto v:a)r^=std::uint32_t(v);return std::int32_t(r);}inline std::uint32_t reverseBits(std::uint32_t v){std::uint32_t r=0;for(int i=0;i<32;++i){r=(r<<1)|(v&1);v>>=1;}return r;}
inline std::vector<std::uint32_t>grayCode(int bits){if(bits<0||bits>30)throw std::out_of_range("Invalid bits");std::vector<std::uint32_t>r;for(std::uint32_t i=0;i<(std::uint32_t(1)<<bits);++i)r.push_back(i^(i>>1));return r;}
template<class T>std::vector<std::vector<T>>subsetsByMask(const std::vector<T>&a){if(a.size()>30)throw std::out_of_range("Too many items");std::vector<std::vector<T>>r;for(std::uint32_t m=0;m<(std::uint32_t(1)<<a.size());++m){std::vector<T>v;for(int i=0;i<int(a.size());++i)if(m&(std::uint32_t(1)<<i))v.push_back(a[i]);r.push_back(v);}return r;}
inline std::pair<std::int32_t,std::int32_t>swapWithoutTemp(std::int32_t a,std::int32_t b){a^=b;b^=a;a^=b;return {a,b};}inline int hammingDistance(std::uint32_t a,std::uint32_t b){return countSetBits(a^b);}
}
