use std::collections::{HashMap, VecDeque};

#[derive(Default)]
struct Node {
    next: HashMap<u16, usize>,
    fail: usize,
    output: Vec<usize>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Match {
    pub pattern: String,
    pub index: usize,
}

pub struct AhoCorasick {
    nodes: Vec<Node>,
    patterns: Vec<String>,
}

impl AhoCorasick {
    pub fn new(patterns: Vec<String>) -> Self {
        let mut tree = Self {
            nodes: vec![Node::default()],
            patterns,
        };
        for index in 0..tree.patterns.len() {
            let mut state = 0;
            let units: Vec<u16> = tree.patterns[index].encode_utf16().collect();
            if units.is_empty() {
                continue;
            }
            for c in units {
                let child = if let Some(&child) = tree.nodes[state].next.get(&c) {
                    child
                } else {
                    let child = tree.nodes.len();
                    tree.nodes.push(Node::default());
                    tree.nodes[state].next.insert(c, child);
                    child
                };
                state = child;
            }
            tree.nodes[state].output.push(index);
        }
        let mut queue: VecDeque<usize> = tree.nodes[0].next.values().copied().collect();
        while let Some(state) = queue.pop_front() {
            let children: Vec<(u16, usize)> = tree.nodes[state]
                .next
                .iter()
                .map(|(&c, &v)| (c, v))
                .collect();
            for (c, child) in children {
                let fail = tree.transition(tree.nodes[state].fail, c);
                tree.nodes[child].fail = fail;
                let output = tree.nodes[fail].output.clone();
                tree.nodes[child].output.extend(output);
                queue.push_back(child);
            }
        }
        tree
    }
    fn transition(&self, mut state: usize, c: u16) -> usize {
        loop {
            if let Some(&next) = self.nodes[state].next.get(&c) {
                return next;
            }
            if state == 0 {
                return 0;
            }
            state = self.nodes[state].fail;
        }
    }
    pub fn search(&self, text: &str) -> Vec<Match> {
        let mut result = Vec::new();
        let mut state = 0;
        for (i, c) in text.encode_utf16().enumerate() {
            state = self.transition(state, c);
            for &index in &self.nodes[state].output {
                let pattern = &self.patterns[index];
                result.push(Match {
                    pattern: pattern.clone(),
                    index: i + 1 - pattern.encode_utf16().count(),
                });
            }
        }
        result
    }
}
