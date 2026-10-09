#pragma once
#include "../../support.hpp"
namespace algs {
inline std::vector<std::vector<std::string>>nQueens(int n){std::vector<std::vector<std::string>>solutions;std::vector<int>cols;std::set<int>used,diag,anti;std::function<void(int)>place=[&](int row){if(row==n){std::vector<std::string>b;for(int c:cols)b.push_back(std::string(c,'.')+'Q'+std::string(n-c-1,'.'));solutions.push_back(b);return;}for(int c=0;c<n;++c){if(used.count(c)||diag.count(row-c)||anti.count(row+c))continue;cols.push_back(c);used.insert(c);diag.insert(row-c);anti.insert(row+c);place(row+1);cols.pop_back();used.erase(c);diag.erase(row-c);anti.erase(row+c);}};place(0);return solutions;}
inline double countNQueens(int n){if(n<0||n>31)throw std::out_of_range("Invalid board size");std::uint32_t full=n==0?0:(std::uint32_t(1)<<n)-1;std::function<double(std::uint32_t,std::uint32_t,std::uint32_t)>count=[&](auto cols,auto d,auto a)->double{if(cols==full)return 1;double total=0;auto free=full&~(cols|d|a);while(free){auto bit=free&(~free+1);free^=bit;total+=count(cols|bit,((d|bit)<<1)&full,(a|bit)>>1);}return total;};return count(0,0,0);}
}
