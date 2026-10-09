#pragma once
#include "../../support.hpp"
namespace algs {
struct MinCoinsResult{int count;Numbers coins;};
inline std::optional<MinCoinsResult>minCoins(const Numbers&coins,int amount){Numbers best(amount+1,infinity);std::vector<int>last(amount+1,-1);best[0]=0;for(int sum=1;sum<=amount;++sum)for(double raw:coins){int coin=int(raw);if(coin<=0)throw std::invalid_argument("Coin must be positive");if(coin<=sum&&best[sum-coin]+1<best[sum]){best[sum]=best[sum-coin]+1;last[sum]=coin;}}if(best[amount]==infinity)return {};Numbers used;for(int sum=amount;sum>0;sum-=last[sum])used.push_back(last[sum]);return MinCoinsResult{int(best[amount]),used};}
inline double coinChangeWays(const Numbers&coins,int amount){Numbers ways(amount+1);ways[0]=1;for(double raw:coins){int coin=int(raw);if(coin<=0)throw std::invalid_argument("Coin must be positive");for(int s=coin;s<=amount;++s)ways[s]+=ways[s-coin];}return ways[amount];}
}
