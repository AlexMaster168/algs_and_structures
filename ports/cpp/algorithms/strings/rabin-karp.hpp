#pragma once
#include "../../support.hpp"
namespace algs {
inline std::vector<int>rabinKarp(const std::string&t,const std::string&p){int m=int(p.size());if(!m||m>int(t.size()))return {};constexpr std::int64_t mod=1000000007,base=256;std::int64_t hp=1,ph=0,wh=0;for(int i=1;i<m;++i)hp=hp*base%mod;for(int i=0;i<m;++i){ph=(ph*base+static_cast<unsigned char>(p[i]))%mod;wh=(wh*base+static_cast<unsigned char>(t[i]))%mod;}std::vector<int>r;for(int s=0;;++s){if(ph==wh&&t.compare(s,m,p)==0)r.push_back(s);if(s+m>=int(t.size()))break;wh=(wh-static_cast<unsigned char>(t[s])*hp%mod+mod)%mod;wh=(wh*base+static_cast<unsigned char>(t[s+m]))%mod;}return r;}
}
