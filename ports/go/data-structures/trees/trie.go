package trees

import "algs/algorithms/sorting"

type trieNode struct {
	children map[rune]*trieNode
	word     bool
	pass     int
}
type Trie struct {
	root  *trieNode
	count int
}

func NewTrie() *Trie { return &Trie{root: &trieNode{children: map[rune]*trieNode{}}} }
func TrieFrom(words []string) *Trie {
	t := NewTrie()
	for _, w := range words {
		t.Insert(w)
	}
	return t
}
func (t *Trie) Size() int { return t.count }
func (t *Trie) walk(s string) *trieNode {
	n := t.root
	for _, c := range s {
		n = n.children[c]
		if n == nil {
			return nil
		}
	}
	return n
}
func (t *Trie) Has(s string) bool        { n := t.walk(s); return n != nil && n.word }
func (t *Trie) StartsWith(s string) bool { return t.walk(s) != nil }
func (t *Trie) CountWithPrefix(s string) int {
	n := t.walk(s)
	if n == nil {
		return 0
	}
	return n.pass
}
func (t *Trie) Insert(s string) bool {
	if t.Has(s) {
		return false
	}
	n := t.root
	n.pass++
	for _, c := range s {
		if n.children[c] == nil {
			n.children[c] = &trieNode{children: map[rune]*trieNode{}}
		}
		n = n.children[c]
		n.pass++
	}
	n.word = true
	t.count++
	return true
}
func (t *Trie) Delete(s string) bool {
	if !t.Has(s) {
		return false
	}
	n := t.root
	n.pass--
	for _, c := range s {
		x := n.children[c]
		x.pass--
		if x.pass == 0 {
			delete(n.children, c)
			t.count--
			return true
		}
		n = x
	}
	n.word = false
	t.count--
	return true
}
func (t *Trie) WordsWithPrefix(s string) []string {
	out := []string{}
	n := t.walk(s)
	if n == nil {
		return out
	}
	var f func(*trieNode, string)
	f = func(n *trieNode, s string) {
		if n.word {
			out = append(out, s)
		}
		keys := []rune{}
		for c := range n.children {
			keys = append(keys, c)
		}
		for _, c := range sorting.QuickSort(keys) {
			f(n.children[c], s+string(c))
		}
	}
	f(n, s)
	return out
}
