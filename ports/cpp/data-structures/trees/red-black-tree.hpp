#pragma once
#include "../../support.hpp"
#include "../../shared/compare.hpp"
#include "tree-iterator.hpp"
namespace algs {
template<class T> class RedBlackTree {
    struct Node { T value; bool red = true; std::unique_ptr<Node> left, right; explicit Node(const T& value): value(value) {} };
    using Link = std::unique_ptr<Node>;
    Link root; std::size_t count = 0; Comparator<T> compare;
    static bool red(const Link& node) { return node && node->red; }
    static Link left(Link node) { auto child = std::move(node->right); node->right = std::move(child->left); child->left = std::move(node); child->red = child->left->red; child->left->red = true; return child; }
    static Link right(Link node) { auto child = std::move(node->left); node->left = std::move(child->right); child->right = std::move(node); child->red = child->right->red; child->right->red = true; return child; }
    static void flip(Node& node) { node.red = !node.red; if (node.left) node.left->red = !node.left->red; if (node.right) node.right->red = !node.right->red; }
    static Link fix(Link node) { if (red(node->right)) node = left(std::move(node)); if (red(node->left) && red(node->left->left)) node = right(std::move(node)); if (red(node->left) && red(node->right)) flip(*node); return node; }
    static Link moveLeft(Link node) { flip(*node); if (node->right && red(node->right->left)) { node->right = right(std::move(node->right)); node = left(std::move(node)); flip(*node); } return node; }
    static Link moveRight(Link node) { flip(*node); if (node->left && red(node->left->left)) { node = right(std::move(node)); flip(*node); } return node; }
    Link add(Link node, const T& value) { if (!node) return std::make_unique<Node>(value); if (compare(value, node->value) < 0) node->left = add(std::move(node->left), value); else node->right = add(std::move(node->right), value); if (red(node->right) && !red(node->left)) node = left(std::move(node)); if (red(node->left) && red(node->left->left)) node = right(std::move(node)); if (red(node->left) && red(node->right)) flip(*node); return node; }
    static Link removeMin(Link node) { if (!node->left) return nullptr; if (!red(node->left) && !red(node->left->left)) node = moveLeft(std::move(node)); node->left = removeMin(std::move(node->left)); return fix(std::move(node)); }
    Link remove(Link node, const T& value) {
        if (compare(value, node->value) < 0) { if (node->left) { if (!red(node->left) && !red(node->left->left)) node = moveLeft(std::move(node)); node->left = remove(std::move(node->left), value); } }
        else { if (red(node->left)) node = right(std::move(node)); if (compare(value, node->value) == 0 && !node->right) return nullptr; if (node->right) { if (!red(node->right) && !red(node->right->left)) node = moveRight(std::move(node)); if (compare(value, node->value) == 0) { auto next = node->right.get(); while (next->left) next = next->left.get(); node->value = next->value; node->right = removeMin(std::move(node->right)); } else node->right = remove(std::move(node->right), value); } }
        return fix(std::move(node));
    }
    int validate(const Node* node, const T* low, const T* high, std::size_t& total) const { if (!node) return 1; if ((low && compare(*low, node->value) >= 0) || (high && compare(node->value, *high) >= 0) || (node->red && (red(node->left) || red(node->right))) || red(node->right)) return -1; ++total; int a = validate(node->left.get(), low, &node->value, total), b = validate(node->right.get(), &node->value, high, total); return a < 0 || a != b ? -1 : a + !node->red; }
    static std::size_t measure(const Node* node) { return node ? 1 + std::max(measure(node->left.get()), measure(node->right.get())) : 0; }
public:
    explicit RedBlackTree(Comparator<T> compare = defaultCompare<T>): compare(std::move(compare)) {}
    std::size_t size() const { return count; } std::size_t height() const { return measure(root.get()); }
    bool has(const T& value) const { auto node = root.get(); while (node) { int order = compare(value, node->value); if (!order) return true; node = order < 0 ? node->left.get() : node->right.get(); } return false; }
    bool insert(const T& value) { if (has(value)) return false; root = add(std::move(root), value); root->red = false; ++count; return true; }
    bool deleteValue(const T& value) { if (!has(value)) return false; T copy = value; if (!red(root->left) && !red(root->right)) root->red = true; root = remove(std::move(root), copy); if (root) root->red = false; --count; return true; }
    bool isValid() const { std::size_t total = 0; return (!root || !root->red) && validate(root.get(), nullptr, nullptr, total) >= 0 && total == count; }
    auto begin() const { return TreeIterator<Node, T>(root.get()); } auto end() const { return TreeIterator<Node, T>(); }
    std::vector<T> toArray() const { std::vector<T> values; for (const auto& value : *this) values.push_back(value); return values; }
};
}
