#pragma once
#include "../../support.hpp"
namespace algs {
class Trie {
    struct Node { std::map<unsigned char, std::unique_ptr<Node>> children; bool isWord = false; int passCount = 0; };
    Node root;
    int count = 0;
    const Node* walk(const std::string& prefix) const { const Node* node = &root; for (unsigned char character: prefix) { auto next = node->children.find(character); if (next == node->children.end()) return nullptr; node = next->second.get(); } return node; }
public:
    static Trie from(const std::vector<std::string>& words) { Trie trie; for (const auto& word: words) trie.insert(word); return trie; }
    int size() const { return count; }
    bool has(const std::string& word) const { auto node = walk(word); return node && node->isWord; }
    bool startsWith(const std::string& prefix) const { return walk(prefix) != nullptr; }
    int countWithPrefix(const std::string& prefix) const { auto node = walk(prefix); return node ? node->passCount : 0; }
    bool insert(const std::string& word) { if (has(word)) return false; auto node = &root; ++node->passCount; for (unsigned char character: word) { auto& next = node->children[character]; if (!next) next = std::make_unique<Node>(); node = next.get(); ++node->passCount; } node->isWord = true; ++count; return true; }
    bool deleteValue(const std::string& word) { if (!has(word)) return false; auto node = &root; --node->passCount; --count; for (unsigned char character: word) { auto next = node->children[character].get(); if (--next->passCount == 0) { node->children.erase(character); return true; } node = next; } node->isWord = false; return true; }
    std::vector<std::string> wordsWithPrefix(const std::string& prefix) const { auto node = walk(prefix); if (!node) return {}; std::vector<std::string> words; std::function<void(const Node*, const std::string&)> collect = [&](auto current, const auto& path) { if (current->isWord) words.push_back(path); for (const auto& [character, child]: current->children) collect(child.get(), path + char(character)); }; collect(node, prefix); return words; }
};
}
