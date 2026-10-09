#pragma once
#include "../../support.hpp"
namespace algs {
inline std::string longestCommonSubsequence(const std::string&a,const std::string&b){std::vector<std::vector<int>>t(a.size()+1,std::vector<int>(b.size()+1));for(int i=1;i<=int(a.size());++i)for(int j=1;j<=int(b.size());++j)t[i][j]=a[i-1]==b[j-1]?t[i-1][j-1]+1:std::max(t[i-1][j],t[i][j-1]);std::string r;for(int i=int(a.size()),j=int(b.size());i>0&&j>0;)if(a[i-1]==b[j-1]){r+=a[i-1];--i;--j;}else if(t[i-1][j]>=t[i][j-1])--i;else --j;std::reverse(r.begin(),r.end());return r;}
inline std::string longestCommonSubstring(const std::string&a,const std::string&b){std::vector<int>prev(b.size()+1);int len=0,end=0;for(int i=1;i<=int(a.size());++i){std::vector<int>cur(b.size()+1);for(int j=1;j<=int(b.size());++j)if(a[i-1]==b[j-1]){cur[j]=prev[j-1]+1;if(cur[j]>len){len=cur[j];end=i;}}prev.swap(cur);}return a.substr(end-len,len);}
}
