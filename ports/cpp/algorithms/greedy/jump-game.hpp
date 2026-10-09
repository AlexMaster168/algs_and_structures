#pragma once
#include "../../support.hpp"
namespace algs {
inline bool canReachEnd(const Numbers& jumps) { double farthest = 0; for (std::size_t i = 0; i < jumps.size(); ++i) { if (i > farthest) return false; farthest = std::max(farthest, i + jumps[i]); } return true; }
inline int minJumps(const Numbers& jumps) { int count = 0; double end = 0, farthest = 0; for (std::size_t i = 0; i + 1 < jumps.size(); ++i) { farthest = std::max(farthest, i + jumps[i]); if (i == end) { if (farthest <= i) return -1; ++count; end = farthest; } } return count; }
inline Numbers greedyChange(double amount, Numbers denominations) { std::sort(denominations.begin(), denominations.end(), std::greater<double>()); Numbers result; for (double coin : denominations) { if (coin <= 0) throw std::invalid_argument("Coin must be positive"); while (amount >= coin) { result.push_back(coin); amount -= coin; } } return result; }
}
