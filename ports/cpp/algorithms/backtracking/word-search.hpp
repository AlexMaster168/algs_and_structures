#pragma once
#include "../../support.hpp"
namespace algs {
inline bool wordSearch(const std::vector<std::string>&g,const std::string&w){int rows=int(g.size()),cols=rows?int(g[0].size()):0;std::vector<std::vector<bool>>seen(rows,std::vector<bool>(cols));std::function<bool(int,int,int)>search=[&](int r,int c,int i){if(i==int(w.size()))return true;if(r<0||c<0||r>=rows||c>=cols||seen[r][c]||g[r][c]!=w[i])return false;seen[r][c]=true;bool found=search(r+1,c,i+1)||search(r-1,c,i+1)||search(r,c+1,i+1)||search(r,c-1,i+1);seen[r][c]=false;return found;};for(int r=0;r<rows;++r)for(int c=0;c<cols;++c)if(search(r,c,0))return true;return false;}
}
