#pragma once
#include <vector>

inline std::vector<int> merge_sort(const std::vector<int>& values) {
    if (values.size() < 2) return values;
    auto middle = values.begin() + values.size() / 2;
    auto left = merge_sort(std::vector<int>(values.begin(), middle));
    auto right = merge_sort(std::vector<int>(middle, values.end()));
    std::vector<int> result;
    result.reserve(values.size());
    std::size_t i = 0, j = 0;
    while (i < left.size() && j < right.size())
        result.push_back(left[i] <= right[j] ? left[i++] : right[j++]);
    result.insert(result.end(), left.begin() + i, left.end());
    result.insert(result.end(), right.begin() + j, right.end());
    return result;
}
