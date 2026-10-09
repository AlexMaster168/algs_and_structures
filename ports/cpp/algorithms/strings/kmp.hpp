#pragma once
#include "../../support.hpp"
namespace algs {
inline std::vector<int>prefixFunction(const std::string&p){std::vector<int>pi(p.size());for(int i=1;i<int(p.size());++i){int k=pi[i-1];while(k>0&&p[i]!=p[k])k=pi[k-1];if(p[i]==p[k])++k;pi[i]=k;}return pi;}
inline std::vector<int>kmpSearch(const std::string&t,const std::string&p){if(p.empty())return {};auto pi=prefixFunction(p);std::vector<int>r;int k=0;for(int i=0;i<int(t.size());++i){while(k>0&&t[i]!=p[k])k=pi[k-1];if(t[i]==p[k])++k;if(k==int(p.size())){r.push_back(i-k+1);k=pi[k-1];}}return r;}
}
