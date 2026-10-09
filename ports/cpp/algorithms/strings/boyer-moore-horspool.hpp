#pragma once
#include "../../support.hpp"
namespace algs {
inline std::vector<int>boyerMooreHorspool(const std::string&t,const std::string&p){int m=int(p.size());if(!m||m>int(t.size()))return {};std::array<int,256>shift;shift.fill(m);for(int i=0;i<m-1;++i)shift[static_cast<unsigned char>(p[i])]=m-1-i;std::vector<int>r;int pos=0;while(pos<=int(t.size())-m){int j=m-1;while(j>=0&&t[pos+j]==p[j])--j;if(j<0)r.push_back(pos);pos+=shift[static_cast<unsigned char>(t[pos+m-1])];}return r;}
}
