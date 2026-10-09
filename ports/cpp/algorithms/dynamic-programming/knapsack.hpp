#pragma once
#include "../../support.hpp"
namespace algs {
struct KnapsackItem{int weight;double value;};struct KnapsackResult{double value;std::vector<int>items;};
inline KnapsackResult knapsack01(const std::vector<KnapsackItem>&items,int capacity){int n=int(items.size());Matrix table(n+1,Numbers(capacity+1));for(int i=1;i<=n;++i)for(int w=0;w<=capacity;++w){table[i][w]=table[i-1][w];if(items[i-1].weight<=w)table[i][w]=std::max(table[i][w],table[i-1][w-items[i-1].weight]+items[i-1].value);}std::vector<int>chosen;for(int i=n,w=capacity;i>0;--i)if(table[i][w]!=table[i-1][w]){chosen.push_back(i-1);w-=items[i-1].weight;}std::reverse(chosen.begin(),chosen.end());return {table[n][capacity],chosen};}
inline double unboundedKnapsack(const std::vector<KnapsackItem>&items,int capacity){Numbers best(capacity+1);for(int w=1;w<=capacity;++w)for(auto item:items)if(item.weight<=w)best[w]=std::max(best[w],best[w-item.weight]+item.value);return best.back();}
}
