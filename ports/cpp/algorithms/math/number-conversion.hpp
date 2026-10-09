#pragma once
#include "../../support.hpp"
namespace algs {
inline std::string toBase(std::int64_t value,int base){if(base<2||base>36)throw std::out_of_range("Base must be between 2 and 36");if(!value)return "0";bool neg=value<0;std::uint64_t rest=neg?std::uint64_t(-(value+1))+1:std::uint64_t(value);std::string r,d="0123456789abcdefghijklmnopqrstuvwxyz";while(rest){r=d[rest%base]+r;rest/=base;}return neg?"-"+r:r;}
inline std::int64_t fromBase(const std::string&s,int base){bool neg=!s.empty()&&s[0]=='-';std::int64_t r=0;std::string d="0123456789abcdefghijklmnopqrstuvwxyz";for(std::size_t i=neg?1:0;i<s.size();++i){auto v=d.find(char(std::tolower(static_cast<unsigned char>(s[i]))));if(v==std::string::npos||int(v)>=base)throw std::out_of_range("Invalid digit");r=r*base+std::int64_t(v);}return neg?-r:r;}
inline std::string toRoman(int v){if(v<1||v>3999)throw std::out_of_range("Value must be in 1..3999");std::string r;for(auto [amount,symbol]:std::vector<std::pair<int,std::string>>{{1000,"M"},{900,"CM"},{500,"D"},{400,"CD"},{100,"C"},{90,"XC"},{50,"L"},{40,"XL"},{10,"X"},{9,"IX"},{5,"V"},{4,"IV"},{1,"I"}})while(v>=amount){r+=symbol;v-=amount;}return r;}
inline int fromRoman(const std::string&s){std::map<char,int>values{{'I',1},{'V',5},{'X',10},{'L',50},{'C',100},{'D',500},{'M',1000}};int r=0;for(int i=0;i<int(s.size());++i){int current=values.at(s[i]),next=i+1<int(s.size())?values.at(s[i+1]):0;r+=current<next?-current:current;}return r;}
}
