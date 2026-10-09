#pragma once
#include "../../support.hpp"
namespace algs {
inline std::vector<int>zFunction(const std::string&s){std::vector<int>z(s.size());if(!s.empty())z[0]=int(s.size());for(int i=1,l=0,r=0;i<int(s.size());++i){if(i<r)z[i]=std::min(r-i,z[i-l]);while(i+z[i]<int(s.size())&&s[z[i]]==s[i+z[i]])++z[i];if(i+z[i]>r){l=i;r=i+z[i];}}return z;}
inline std::vector<int>zSearch(const std::string&t,const std::string&p){if(p.empty())return {};auto z=zFunction(p+std::string(1,'\0')+t);std::vector<int>r;for(int i=int(p.size())+1;i<int(z.size());++i)if(z[i]>=int(p.size()))r.push_back(i-int(p.size())-1);return r;}
}
