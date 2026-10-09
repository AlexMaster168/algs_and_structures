use std::collections::BTreeMap;
#[derive(Default)]
struct Node {
    children: BTreeMap<char, Node>,
    is_word: bool,
    pass: usize,
}
#[derive(Default)]
pub struct Trie {
    root: Node,
    count: usize,
}
impl Trie {
    pub fn new() -> Self {
        Self::default()
    }
    pub fn from(words: impl IntoIterator<Item = String>) -> Self {
        let mut trie = Self::new();
        for word in words {
            trie.insert(&word);
        }
        trie
    }
    pub fn size(&self) -> usize {
        self.count
    }
    fn node(&self, prefix: &str) -> Option<&Node> {
        let mut node = &self.root;
        for c in prefix.chars() {
            node = node.children.get(&c)?;
        }
        Some(node)
    }
    pub fn has(&self, word: &str) -> bool {
        self.node(word).is_some_and(|node| node.is_word)
    }
    pub fn starts_with(&self, prefix: &str) -> bool {
        self.node(prefix).is_some()
    }
    pub fn count_with_prefix(&self, prefix: &str) -> usize {
        self.node(prefix).map_or(0, |node| node.pass)
    }
    pub fn insert(&mut self, word: &str) -> bool {
        if self.has(word) {
            return false;
        }
        let mut node = &mut self.root;
        node.pass += 1;
        for c in word.chars() {
            node = node.children.entry(c).or_default();
            node.pass += 1;
        }
        node.is_word = true;
        self.count += 1;
        true
    }
    pub fn delete(&mut self, word: &str) -> bool {
        if !self.has(word) {
            return false;
        }
        fn remove(node: &mut Node, chars: &[char], index: usize) {
            node.pass -= 1;
            if index == chars.len() {
                node.is_word = false;
                return;
            }
            let c = chars[index];
            let child = node.children.get_mut(&c).unwrap();
            remove(child, chars, index + 1);
            if child.pass == 0 {
                node.children.remove(&c);
            }
        }
        remove(&mut self.root, &word.chars().collect::<Vec<_>>(), 0);
        self.count -= 1;
        true
    }
    pub fn words_with_prefix(&self, prefix: &str, limit: usize) -> Vec<String> {
        fn collect(node: &Node, word: &mut String, limit: usize, result: &mut Vec<String>) {
            if result.len() == limit {
                return;
            }
            if node.is_word {
                result.push(word.clone());
            }
            for (&c, child) in &node.children {
                if result.len() == limit {
                    break;
                }
                let length = word.len();
                word.push(c);
                collect(child, word, limit, result);
                word.truncate(length);
            }
        }
        let mut result = Vec::new();
        if let Some(node) = self.node(prefix) {
            collect(node, &mut prefix.to_owned(), limit, &mut result);
        }
        result
    }
}
