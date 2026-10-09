#pragma once
#include "../dynamic-programming/knapsack.hpp"
namespace algs {
inline double fractionalKnapsack(std::vector<KnapsackItem> items, double capacity) { std::stable_sort(items.begin(), items.end(), [](auto a, auto b) { return a.value / a.weight > b.value / b.weight; }); double value = 0; for (auto item : items) { if (capacity <= 0) break; double taken = std::min(double(item.weight), capacity); value += item.value / item.weight * taken; capacity -= taken; } return value; }
}
