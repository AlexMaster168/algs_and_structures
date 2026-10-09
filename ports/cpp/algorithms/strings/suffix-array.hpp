#pragma once
#include "../../support.hpp"
#include "../sorting/merge-sort.hpp"
namespace algs {
inline std::vector<int>suffixArray(const std::string&s){int n=int(s.size());std::vector<int>rank(n),suffixes(n);for(int i=0;i<n;++i){rank[i]=static_cast<unsigned char>(s[i]);suffixes[i]=i;}for(int k=1;n>0;k*=2){auto key=[&](int i){return std::pair<int,int>{rank[i],i+k<n?rank[i+k]:-1};};suffixes=mergeSort(suffixes,Comparator<int>([&](int a,int b){auto x=key(a),y=key(b);return x<y?-1:x>y?1:0;}));std::vector<int>next(n);for(int i=1;i<n;++i)next[suffixes[i]]=next[suffixes[i-1]]+(key(suffixes[i-1])!=key(suffixes[i]));rank.swap(next);if(rank[suffixes.back()]==n-1)break;}return suffixes;}
inline std::vector<int>lcpArray(const std::string&s,const std::vector<int>&suffixes){int n=int(s.size()),h=0;std::vector<int>rank(n),lcp(std::max(0,n-1));for(int i=0;i<n;++i)rank[suffixes[i]]=i;for(int i=0;i<n;++i){if(!rank[i]){h=0;continue;}int j=suffixes[rank[i]-1];while(i+h<n&&j+h<n&&s[i+h]==s[j+h])++h;lcp[rank[i]-1]=h;if(h)--h;}return lcp;}
inline double countDistinctSubstrings(const std::string&s){auto lcp=lcpArray(s,suffixArray(s));return double(s.size())*(s.size()+1)/2-std::accumulate(lcp.begin(),lcp.end(),0.0);}
}
