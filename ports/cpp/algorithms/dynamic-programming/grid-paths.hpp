#pragma once
#include "../../support.hpp"
namespace algs {
inline double uniquePaths(int rows,int cols,const std::vector<std::vector<bool>>&blocked={}){if(cols<=0)return 0;Numbers w(cols);w[0]=1;for(int r=0;r<rows;++r)for(int c=0;c<cols;++c){if(r<int(blocked.size())&&c<int(blocked[r].size())&&blocked[r][c])w[c]=0;else if(c>0)w[c]+=w[c-1];}return w.back();}
inline double minPathSum(const Matrix&grid){if(grid.empty()||grid[0].empty())return infinity;int cols=int(grid[0].size());Numbers best(cols,infinity);best[0]=0;for(auto&row:grid)for(int c=0;c<cols;++c)best[c]=row[c]+std::min(best[c],c?best[c-1]:infinity);return best.back();}
}
