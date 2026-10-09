#pragma once
#include "../../support.hpp"
namespace algs {
struct MatrixChainResult{double cost;std::string order;};inline MatrixChainResult matrixChainOrder(const Numbers&d){int n=int(d.size())-1;if(n<1)return {0,""};Matrix cost(n,Numbers(n));std::vector<std::vector<int>>split(n,std::vector<int>(n));for(int len=2;len<=n;++len)for(int i=0;i+len-1<n;++i){int j=i+len-1;cost[i][j]=infinity;for(int k=i;k<j;++k){double v=cost[i][k]+cost[k+1][j]+d[i]*d[k+1]*d[j+1];if(v<cost[i][j]){cost[i][j]=v;split[i][j]=k;}}}std::function<std::string(int,int)>render=[&](int i,int j){return i==j?"A"+std::to_string(i+1):"("+render(i,split[i][j])+render(split[i][j]+1,j)+")";};return {cost[0][n-1],render(0,n-1)};}
}
