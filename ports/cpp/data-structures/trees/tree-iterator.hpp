#pragma once
#include "../../support.hpp"
namespace algs {
template<class Node> const Node* nodePointer(const std::unique_ptr<Node>& node) { return node.get(); }
template<class Node> const Node* nodePointer(const Node* node) { return node; }
template<class Node, class T> class TreeIterator {
    std::vector<const Node*> stack;
    const Node* sentinel;
    void descend(const Node* node) { while (node && node != sentinel) { stack.push_back(node); node = nodePointer(node->left); } }
public:
    TreeIterator(const Node* root = nullptr, const Node* sentinel = nullptr): sentinel(sentinel) { descend(root); }
    const T& operator*() const { return stack.back()->value; }
    TreeIterator& operator++() { auto node = stack.back(); stack.pop_back(); descend(nodePointer(node->right)); return *this; }
    bool operator==(const TreeIterator& other) const { return stack.empty() ? other.stack.empty() : !other.stack.empty() && stack.back() == other.stack.back(); }
    bool operator!=(const TreeIterator& other) const { return !(*this == other); }
};
}
