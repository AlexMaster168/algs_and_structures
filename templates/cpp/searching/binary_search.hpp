#pragma once
#include <vector>
#include <cstddef>

inline std::ptrdiff_t binary_search(const std::vector<int>& values, int target) {
    std::size_t left = 0, right = values.size();
    while (left < right) {
        auto middle = left + (right - left) / 2;
        if (values[middle] < target) left = middle + 1;
        else right = middle;
    }
    return left < values.size() && values[left] == target ? static_cast<std::ptrdiff_t>(left) : -1;
}
