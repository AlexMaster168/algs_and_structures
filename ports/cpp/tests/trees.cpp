#include "../data-structures/trees/binary-search-tree.hpp"
#include "../data-structures/trees/avl-tree.hpp"
#include "../data-structures/trees/b-tree.hpp"
#include "../data-structures/trees/red-black-tree.hpp"
#include "../data-structures/trees/trie.hpp"
#include <cassert>
#include <iostream>
template<class Tree> void check(Tree& tree) { std::set<int> expected; std::uint32_t seed = 718; for (int i = 0; i < 20000; ++i) { seed = seed * 1664525 + 1013904223; int value = int(seed % 300); bool insert = (seed >> 15) & 1; bool changed = insert ? expected.insert(value).second : expected.erase(value) != 0; assert((insert ? tree.insert(value) : tree.deleteValue(value)) == changed); assert(tree.size() == expected.size()); assert(tree.toArray() == std::vector<int>(expected.begin(), expected.end())); if constexpr (requires { tree.isValid(); }) assert(tree.isValid()); if constexpr (requires { tree.isBalanced(); }) assert(tree.isBalanced()); } }
int main() { algs::BinarySearchTree<int> bst; algs::AVLTree<int> avl; algs::RedBlackTree<int> rb; check(bst); check(avl); check(rb); for (int degree = 2; degree < 9; ++degree) { algs::BTree<int> tree(degree); check(tree); } std::cout << "C++: tree mutation checks passed\n"; }
