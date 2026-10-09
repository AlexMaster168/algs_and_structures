#pragma once
#include "../../support.hpp"
#include "hash.hpp"
namespace algs {
class BloomFilter{std::vector<std::uint8_t>bits;std::vector<int>positions(const std::string&s)const{std::uint64_t h1=fnv1a(s),h2=fnv1a(s,0x5bd1e995)|1u;std::vector<int>r;for(int i=0;i<hashCount;++i)r.push_back(int((h1+std::uint64_t(i)*h2)%bitCount));return r;}public:const int bitCount,hashCount;BloomFilter(int n,double rate=0.01):bitCount(std::max(8,int(std::ceil(-n*std::log(rate)/(std::log(2)*std::log(2)))))),hashCount(std::max(1,int(std::floor(double(bitCount)/n*std::log(2)+0.5)))){if(n<=0||rate<=0||rate>=1)throw std::out_of_range("Invalid filter parameters");bits.resize((bitCount+7)/8);}BloomFilter&add(const std::string&s){for(int p:positions(s))bits[p>>3]|=std::uint8_t(1<<(p&7));return *this;}bool mightContain(const std::string&s)const{for(int p:positions(s))if((bits[p>>3]&(1<<(p&7)))==0)return false;return true;}};
}
