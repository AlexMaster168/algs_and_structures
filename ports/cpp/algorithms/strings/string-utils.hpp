#pragma once
#include "../../support.hpp"
#include "../sorting/merge-sort.hpp"
namespace algs {
inline bool isBalanced(const std::string&s){std::vector<char>stack;for(char c:s){if(c=='('||c=='['||c=='{')stack.push_back(c);else if(c==')'||c==']'||c=='}'){char expected=c==')'?'(':c==']'?'[':'{';if(stack.empty()||stack.back()!=expected)return false;stack.pop_back();}}return stack.empty();}
inline bool isPalindrome(const std::string&s){std::string n;for(unsigned char c:s)if(std::isalnum(c))n+=char(std::tolower(c));for(int i=0,j=int(n.size())-1;i<j;++i,--j)if(n[i]!=n[j])return false;return true;}
inline bool isAnagram(const std::string&a,const std::string&b){if(a.size()!=b.size())return false;std::array<int,256>counts{};for(unsigned char c:a)++counts[c];for(unsigned char c:b)if(--counts[c]<0)return false;return true;}
inline std::vector<std::vector<std::string>>groupAnagrams(const std::vector<std::string>&words){std::map<std::string,int>index;std::vector<std::vector<std::string>>groups;for(auto&w:words){std::vector<char>v(w.begin(),w.end());v=mergeSort(v);std::string key(v.begin(),v.end());auto it=index.find(key);if(it==index.end()){index[key]=int(groups.size());groups.push_back({w});}else groups[it->second].push_back(w);}return groups;}
inline std::string runLengthEncode(const std::string&s){std::string r;for(int i=0;i<int(s.size());){int j=i+1;while(j<int(s.size())&&s[j]==s[i])++j;r+=std::to_string(j-i)+s[i];i=j;}return r;}
inline std::string runLengthDecode(const std::string&s){std::string r;for(int i=0;i<int(s.size());){if(!std::isdigit(static_cast<unsigned char>(s[i]))){r+=s[i++];continue;}int start=i;std::size_t count=0;while(i<int(s.size())&&std::isdigit(static_cast<unsigned char>(s[i])))count=count*10+s[i++]-'0';if(i<int(s.size()))r.append(count,s[i++]);else r+=s.substr(start);}return r;}
inline std::string reverseWords(const std::string&s){std::istringstream in(s);std::vector<std::string>w;std::string t,r;while(in>>t)w.push_back(t);for(auto it=w.rbegin();it!=w.rend();++it){if(!r.empty())r+=' ';r+=*it;}return r;}
}
