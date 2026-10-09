#pragma once
#include "../../support.hpp"
namespace algs {
inline double maxSumWindow(const Numbers&a,int size){if(size<=0||size>int(a.size()))throw std::out_of_range("Invalid window size");double sum=std::accumulate(a.begin(),a.begin()+size,0.0),best=sum;for(int i=size;i<int(a.size());++i){sum+=a[i]-a[i-size];best=std::max(best,sum);}return best;}
inline Numbers slidingWindowMaximum(const Numbers&a,int size){std::deque<int>w;Numbers r;for(int i=0;i<int(a.size());++i){while(!w.empty()&&w.front()<=i-size)w.pop_front();while(!w.empty()&&a[w.back()]<=a[i])w.pop_back();w.push_back(i);if(i>=size-1)r.push_back(a[w.front()]);}return r;}
inline std::string longestUniqueSubstring(const std::string&s){std::map<char,int>last;int start=0,bestStart=0,len=0;for(int end=0;end<int(s.size());++end){auto it=last.find(s[end]);if(it!=last.end()&&it->second>=start)start=it->second+1;last[s[end]]=end;if(end-start+1>len){len=end-start+1;bestStart=start;}}return s.substr(bestStart,len);}
inline std::string minWindowSubstring(const std::string&s,const std::string&required){if(required.empty())return "";std::map<char,int>need;for(char c:required)++need[c];int missing=int(required.size()),best=std::numeric_limits<int>::max(),start=0;for(int l=0,r=0;r<int(s.size());++r){if(need[s[r]]>0)--missing;--need[s[r]];while(missing==0){if(r-l+1<best){best=r-l+1;start=l;}if(++need[s[l++]]>0)++missing;}}return best==std::numeric_limits<int>::max()?"":s.substr(start,best);}
}
