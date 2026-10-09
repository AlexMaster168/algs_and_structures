#pragma once
#include "../../support.hpp"
#include "../../shared/compare.hpp"
namespace algs {
template<class T> class BTree {
    struct Node { std::vector<T> keys; std::vector<std::unique_ptr<Node>> children; bool leaf() const { return children.empty(); } };
    std::unique_ptr<Node> root = std::make_unique<Node>();
    std::size_t degree, count = 0;
    Comparator<T> compare;
    std::size_t index(const Node& node, const T& value) const { std::size_t i = 0; while (i < node.keys.size() && compare(node.keys[i], value) < 0) ++i; return i; }
    void split(Node& parent, std::size_t i) {
        auto& child = *parent.children[i]; auto right = std::make_unique<Node>(); T middle = child.keys[degree - 1];
        right->keys.assign(child.keys.begin() + degree, child.keys.end()); child.keys.resize(degree - 1);
        if (!child.leaf()) { for (std::size_t j = degree; j < child.children.size(); ++j) right->children.push_back(std::move(child.children[j])); child.children.resize(degree); }
        parent.keys.insert(parent.keys.begin() + i, std::move(middle)); parent.children.insert(parent.children.begin() + i + 1, std::move(right));
    }
    void add(Node& node, const T& value) {
        auto i = index(node, value); if (node.leaf()) { node.keys.insert(node.keys.begin() + i, value); return; }
        if (node.children[i]->keys.size() == 2 * degree - 1) { split(node, i); if (compare(value, node.keys[i]) > 0) ++i; }
        add(*node.children[i], value);
    }
    void merge(Node& parent, std::size_t i) {
        auto& left = *parent.children[i]; auto right = std::move(parent.children[i + 1]); left.keys.push_back(parent.keys[i]); left.keys.insert(left.keys.end(), right->keys.begin(), right->keys.end());
        for (auto& child : right->children) left.children.push_back(std::move(child));
        parent.keys.erase(parent.keys.begin() + i); parent.children.erase(parent.children.begin() + i + 1);
    }
    void strengthen(Node& parent, std::size_t i) {
        auto& child = *parent.children[i];
        if (i && parent.children[i - 1]->keys.size() >= degree) {
            auto& left = *parent.children[i - 1]; child.keys.insert(child.keys.begin(), parent.keys[i - 1]); parent.keys[i - 1] = left.keys.back(); left.keys.pop_back();
            if (!left.leaf()) { child.children.insert(child.children.begin(), std::move(left.children.back())); left.children.pop_back(); }
        } else if (i + 1 < parent.children.size() && parent.children[i + 1]->keys.size() >= degree) {
            auto& right = *parent.children[i + 1]; child.keys.push_back(parent.keys[i]); parent.keys[i] = right.keys.front(); right.keys.erase(right.keys.begin());
            if (!right.leaf()) { child.children.push_back(std::move(right.children.front())); right.children.erase(right.children.begin()); }
        } else merge(parent, i + 1 < parent.children.size() ? i : i - 1);
    }
    void remove(Node& node, const T& value) {
        auto i = index(node, value);
        if (i < node.keys.size() && compare(node.keys[i], value) == 0) {
            if (node.leaf()) { node.keys.erase(node.keys.begin() + i); return; }
            if (node.children[i]->keys.size() >= degree) { auto next = node.children[i].get(); while (!next->leaf()) next = next->children.back().get(); T replacement = next->keys.back(); node.keys[i] = replacement; remove(*node.children[i], replacement); }
            else if (node.children[i + 1]->keys.size() >= degree) { auto next = node.children[i + 1].get(); while (!next->leaf()) next = next->children.front().get(); T replacement = next->keys.front(); node.keys[i] = replacement; remove(*node.children[i + 1], replacement); }
            else { merge(node, i); remove(*node.children[i], value); }
        } else if (!node.leaf()) { if (node.children[i]->keys.size() < degree) { strengthen(node, i); if (i > node.keys.size()) --i; } remove(*node.children[i], value); }
    }
    bool validate(const Node& node, bool top, int depth, int& leaves, const T* low, const T* high, std::size_t& total) const {
        if (node.keys.size() > 2 * degree - 1 || (!top && node.keys.size() < degree - 1)) return false;
        for (std::size_t i = 0; i < node.keys.size(); ++i) { if ((i && compare(node.keys[i - 1], node.keys[i]) >= 0) || (low && compare(*low, node.keys[i]) >= 0) || (high && compare(node.keys[i], *high) >= 0)) return false; }
        total += node.keys.size(); if (node.leaf()) { if (leaves < 0) leaves = depth; return leaves == depth; }
        if (node.children.size() != node.keys.size() + 1 || node.keys.empty()) return false;
        for (std::size_t i = 0; i < node.children.size(); ++i) if (!validate(*node.children[i], false, depth + 1, leaves, i ? &node.keys[i - 1] : low, i < node.keys.size() ? &node.keys[i] : high, total)) return false;
        return true;
    }
public:
    explicit BTree(std::size_t minDegree = 2, Comparator<T> compare = defaultCompare<T>): degree(minDegree), compare(std::move(compare)) { if (degree < 2) throw std::invalid_argument("Minimum degree must be >= 2"); }
    std::size_t size() const { return count; }
    std::size_t height() const { std::size_t h = 1; auto node = root.get(); while (!node->leaf()) { ++h; node = node->children.front().get(); } return h; }
    bool has(const T& value) const { auto node = root.get(); while (true) { auto i = index(*node, value); if (i < node->keys.size() && compare(node->keys[i], value) == 0) return true; if (node->leaf()) return false; node = node->children[i].get(); } }
    bool insert(const T& value) { if (has(value)) return false; if (root->keys.size() == 2 * degree - 1) { auto parent = std::make_unique<Node>(); parent->children.push_back(std::move(root)); root = std::move(parent); split(*root, 0); } add(*root, value); ++count; return true; }
    bool deleteValue(const T& value) { if (!has(value)) return false; T copy = value; remove(*root, copy); if (root->keys.empty() && !root->leaf()) { auto child = std::move(root->children.front()); root = std::move(child); } --count; return true; }
    bool isValid() const { int leaves = -1; std::size_t total = 0; return validate(*root, true, 0, leaves, nullptr, nullptr, total) && total == count; }
    class Iterator {
        struct Frame { const Node* node; std::size_t index; }; std::vector<Frame> stack;
        void descend(const Node* node) { while (node) { stack.push_back({node, 0}); node = node->leaf() ? nullptr : node->children.front().get(); } normalize(); }
        void normalize() { while (!stack.empty() && stack.back().index >= stack.back().node->keys.size()) stack.pop_back(); }
    public:
        explicit Iterator(const Node* node = nullptr) { descend(node); }
        const T& operator*() const { return stack.back().node->keys[stack.back().index]; }
        Iterator& operator++() { auto& frame = stack.back(); ++frame.index; if (!frame.node->leaf()) descend(frame.node->children[frame.index].get()); else normalize(); return *this; }
        bool operator==(const Iterator& other) const { return stack.empty() ? other.stack.empty() : !other.stack.empty() && stack.back().node == other.stack.back().node && stack.back().index == other.stack.back().index; }
        bool operator!=(const Iterator& other) const { return !(*this == other); }
    };
    Iterator begin() const { return Iterator(root.get()); } Iterator end() const { return Iterator(); }
    std::vector<T> toArray() const { std::vector<T> values; for (const auto& value : *this) values.push_back(value); return values; }
};
}
