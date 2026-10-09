#pragma once
#include "../../shared/compare.hpp"
#include "tree-iterator.hpp"
namespace algs {
template<class T> class AVLTree {
    struct Node { T value; int height = 1; std::unique_ptr<Node> left, right; explicit Node(T value): value(std::move(value)) {} };
    std::unique_ptr<Node> root;
    Comparator<T> compare;
    int count = 0;
    static int nodeHeight(const std::unique_ptr<Node>& node) { return node ? node->height : 0; }
    static int balance(const std::unique_ptr<Node>& node) { return node ? nodeHeight(node->left) - nodeHeight(node->right) : 0; }
    static void refresh(Node* node) { node->height = 1 + std::max(nodeHeight(node->left), nodeHeight(node->right)); }
    static void rotateRight(std::unique_ptr<Node>& node) { auto pivot = std::move(node->left); node->left = std::move(pivot->right); refresh(node.get()); pivot->right = std::move(node); refresh(pivot.get()); node = std::move(pivot); }
    static void rotateLeft(std::unique_ptr<Node>& node) { auto pivot = std::move(node->right); node->right = std::move(pivot->left); refresh(node.get()); pivot->left = std::move(node); refresh(pivot.get()); node = std::move(pivot); }
    static void rebalance(std::unique_ptr<Node>& node) {
        if (!node) return; refresh(node.get()); auto difference = balance(node);
        if (difference > 1) { if (balance(node->left) < 0) rotateLeft(node->left); rotateRight(node); }
        else if (difference < -1) { if (balance(node->right) > 0) rotateRight(node->right); rotateLeft(node); }
    }
    void add(std::unique_ptr<Node>& node, const T& value) { if (!node) { node = std::make_unique<Node>(value); return; } if (compare(value, node->value) < 0) add(node->left, value); else add(node->right, value); rebalance(node); }
    void remove(std::unique_ptr<Node>& node, const T& value) {
        auto order = compare(value, node->value);
        if (order < 0) remove(node->left, value); else if (order > 0) remove(node->right, value);
        else if (!node->left) node = std::move(node->right); else if (!node->right) node = std::move(node->left);
        else { auto next = node->right.get(); while (next->left) next = next->left.get(); T replacement = next->value; node->value = replacement; remove(node->right, replacement); }
        rebalance(node);
    }
public:
    explicit AVLTree(Comparator<T> compare = defaultCompare<T>): compare(compare) {}
    int size() const { return count; }
    int height() const { return nodeHeight(root); }
    bool has(const T& value) const { auto node = root.get(); while (node) { auto order = compare(value, node->value); if (!order) return true; node = order < 0 ? node->left.get() : node->right.get(); } return false; }
    bool insert(const T& value) { if (has(value)) return false; add(root, value); ++count; return true; }
    bool deleteValue(const T& value) { if (!has(value)) return false; T copy = value; remove(root, copy); --count; return true; }
    bool isBalanced() const { std::function<bool(const Node*)> check = [&](auto node) { return !node || std::abs(nodeHeight(node->left) - nodeHeight(node->right)) <= 1 && check(node->left.get()) && check(node->right.get()); }; return check(root.get()); }
    TreeIterator<Node, T> begin() const { return {root.get()}; }
    TreeIterator<Node, T> end() const { return {}; }
    std::vector<T> toArray() const { std::vector<T> values; for (const auto& value: *this) values.push_back(value); return values; }
};
}
