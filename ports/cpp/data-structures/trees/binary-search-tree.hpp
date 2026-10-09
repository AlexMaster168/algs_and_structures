#pragma once
#include "../../shared/compare.hpp"
#include "tree-iterator.hpp"
namespace algs {
template<class T> struct BSTNode {
    T value;
    std::unique_ptr<BSTNode> left, right;
    explicit BSTNode(T value): value(std::move(value)) {}
};
template<class T> class BinarySearchTree {
    std::unique_ptr<BSTNode<T>> root;
    Comparator<T> compare;
    int count = 0;
    void remove(std::unique_ptr<BSTNode<T>>& node, const T& value) {
        auto order = compare(value, node->value);
        if (order < 0) remove(node->left, value);
        else if (order > 0) remove(node->right, value);
        else if (!node->left) node = std::move(node->right);
        else if (!node->right) node = std::move(node->left);
        else { auto next = node->right.get(); while (next->left) next = next->left.get(); node->value = next->value; remove(node->right, next->value); }
    }
public:
    explicit BinarySearchTree(Comparator<T> compare = defaultCompare<T>): compare(compare) {}
    static BinarySearchTree from(const std::vector<T>& values, Comparator<T> compare = defaultCompare<T>) { BinarySearchTree result(compare); for (const auto& value: values) result.insert(value); return result; }
    int size() const { return count; }
    const BSTNode<T>* rootNode() const { return root.get(); }
    bool insert(const T& value) { auto link = &root; while (*link) { auto order = compare(value, (*link)->value); if (!order) return false; link = order < 0 ? &(*link)->left : &(*link)->right; } *link = std::make_unique<BSTNode<T>>(value); ++count; return true; }
    bool has(const T& value) const { auto node = root.get(); while (node) { auto order = compare(value, node->value); if (!order) return true; node = order < 0 ? node->left.get() : node->right.get(); } return false; }
    bool deleteValue(const T& value) { if (!has(value)) return false; T copy = value; remove(root, copy); --count; return true; }
    std::optional<T> min() const { auto node = root.get(); if (!node) return {}; while (node->left) node = node->left.get(); return node->value; }
    std::optional<T> max() const { auto node = root.get(); if (!node) return {}; while (node->right) node = node->right.get(); return node->value; }
    std::optional<T> floor(const T& value) const { auto node = root.get(); std::optional<T> best; while (node) { auto order = compare(value, node->value); if (!order) return node->value; if (order < 0) node = node->left.get(); else { best = node->value; node = node->right.get(); } } return best; }
    std::optional<T> ceil(const T& value) const { auto node = root.get(); std::optional<T> best; while (node) { auto order = compare(value, node->value); if (!order) return node->value; if (order > 0) node = node->right.get(); else { best = node->value; node = node->left.get(); } } return best; }
    int height() const { std::function<int(const BSTNode<T>*)> measure = [&](auto node) { return node ? 1 + std::max(measure(node->left.get()), measure(node->right.get())) : 0; }; return measure(root.get()); }
    TreeIterator<BSTNode<T>, T> begin() const { return {root.get()}; }
    TreeIterator<BSTNode<T>, T> end() const { return {}; }
    std::vector<T> toArray() const { std::vector<T> values; for (const auto& value: *this) values.push_back(value); return values; }
};
}
