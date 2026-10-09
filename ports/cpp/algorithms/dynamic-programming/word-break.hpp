#pragma once
#include "../../support.hpp"
namespace algs {
inline std::optional<std::vector<std::string>>wordBreak(const std::string&s,const std::vector<std::string>&dictionary){std::set<std::string>words(dictionary.begin(),dictionary.end());int max=0;for(auto&w:words)max=std::max(max,int(w.size()));std::vector<int>prev(s.size()+1,-1);std::vector<bool>reach(s.size()+1);reach[0]=true;for(int end=1;end<=int(s.size());++end)for(int start=std::max(0,end-max);start<end;++start)if(reach[start]&&words.count(s.substr(start,end-start))){reach[end]=true;prev[end]=start;break;}if(!reach.back())return {};std::vector<std::string>r;for(int end=int(s.size());end>0;end=prev[end])r.push_back(s.substr(prev[end],end-prev[end]));std::reverse(r.begin(),r.end());return r;}
}
