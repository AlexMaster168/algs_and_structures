#pragma once
#include "../../support.hpp"
namespace algs {
inline std::string longestPalindromicSubstring(const std::string&s){if(s.size()<2)return s;std::vector<int>t{-2,-1};for(unsigned char c:s){t.push_back(c);t.push_back(-1);}t.push_back(-3);std::vector<int>radius(t.size());int center=0,right=0,best=0;for(int i=1;i<int(t.size())-1;++i){if(i<right)radius[i]=std::min(right-i,radius[2*center-i]);while(t[i+radius[i]+1]==t[i-radius[i]-1])++radius[i];if(i+radius[i]>right){center=i;right=i+radius[i];}if(radius[i]>radius[best])best=i;}return s.substr((best-radius[best])/2,radius[best]);}
}
