#pragma once
#include <vector>
#include <numeric>
#include <utility>
#include <stdexcept>

class DisjointSet {
    std::vector<std::size_t> parent, sizes;
public:
    explicit DisjointSet(std::size_t size) : parent(size), sizes(size, 1) {
        std::iota(parent.begin(), parent.end(), 0);
    }
    std::size_t find(std::size_t value) {
        if (value >= parent.size()) throw std::out_of_range("Invalid index");
        while (value != parent[value]) {
            parent[value] = parent[parent[value]];
            value = parent[value];
        }
        return value;
    }
    bool unite(std::size_t a, std::size_t b) {
        a = find(a);
        b = find(b);
        if (a == b) return false;
        if (sizes[a] < sizes[b]) std::swap(a, b);
        parent[b] = a;
        sizes[a] += sizes[b];
        return true;
    }
};
