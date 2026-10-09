use crate::shared::compare::Comparator;
use std::cmp::Ordering;
struct Node<T> {
    value: Option<T>,
    next: Vec<Option<usize>>,
}
pub struct SkipList<T> {
    nodes: Vec<Option<Node<T>>>,
    level: usize,
    length: usize,
    max_level: usize,
    probability: f64,
    compare: Comparator<T>,
    seed: u64,
}
impl<T> SkipList<T> {
    pub fn new(compare: Comparator<T>, max_level: usize, probability: f64) -> Self {
        assert!(max_level > 0 && probability > 0.0 && probability < 1.0);
        Self {
            nodes: vec![Some(Node {
                value: None,
                next: vec![None; max_level],
            })],
            level: 1,
            length: 0,
            max_level,
            probability,
            compare,
            seed: 0x9e3779b97f4a7c15,
        }
    }
    pub fn size(&self) -> usize {
        self.length
    }
    fn predecessors(&self, value: &T) -> Vec<usize> {
        let mut update = vec![0; self.max_level];
        let mut current = 0;
        for level in (0..self.level).rev() {
            while let Some(next) = self.nodes[current].as_ref().unwrap().next[level] {
                if (self.compare)(
                    self.nodes[next].as_ref().unwrap().value.as_ref().unwrap(),
                    value,
                ) != Ordering::Less
                {
                    break;
                }
                current = next;
            }
            update[level] = current;
        }
        update
    }
    pub fn has(&self, value: &T) -> bool {
        let predecessor = self.predecessors(value)[0];
        self.nodes[predecessor].as_ref().unwrap().next[0].is_some_and(|i| {
            (self.compare)(
                self.nodes[i].as_ref().unwrap().value.as_ref().unwrap(),
                value,
            ) == Ordering::Equal
        })
    }
    fn random_level(&mut self) -> usize {
        let mut level = 1;
        while level < self.max_level {
            self.seed ^= self.seed << 13;
            self.seed ^= self.seed >> 7;
            self.seed ^= self.seed << 17;
            if (self.seed >> 11) as f64 / 9007199254740992.0 >= self.probability {
                break;
            }
            level += 1;
        }
        level
    }
    pub fn insert(&mut self, value: T) -> bool {
        let mut update = self.predecessors(&value);
        if self.nodes[update[0]].as_ref().unwrap().next[0].is_some_and(|i| {
            (self.compare)(
                self.nodes[i].as_ref().unwrap().value.as_ref().unwrap(),
                &value,
            ) == Ordering::Equal
        }) {
            return false;
        }
        let level = self.random_level();
        if level > self.level {
            for item in &mut update[self.level..level] {
                *item = 0;
            }
            self.level = level;
        }
        let index = self.nodes.len();
        let next = (0..level)
            .map(|i| self.nodes[update[i]].as_ref().unwrap().next[i])
            .collect();
        self.nodes.push(Some(Node {
            value: Some(value),
            next,
        }));
        for (i, &previous) in update.iter().enumerate().take(level) {
            self.nodes[previous].as_mut().unwrap().next[i] = Some(index);
        }
        self.length += 1;
        true
    }
    pub fn delete(&mut self, value: &T) -> bool {
        let update = self.predecessors(value);
        let Some(target) = self.nodes[update[0]].as_ref().unwrap().next[0] else {
            return false;
        };
        if (self.compare)(
            self.nodes[target].as_ref().unwrap().value.as_ref().unwrap(),
            value,
        ) != Ordering::Equal
        {
            return false;
        }
        for (i, &previous) in update.iter().enumerate().take(self.level) {
            if self.nodes[previous].as_ref().unwrap().next[i] != Some(target) {
                break;
            }
            let next = self.nodes[target].as_ref().unwrap().next[i];
            self.nodes[previous].as_mut().unwrap().next[i] = next;
        }
        self.nodes[target] = None;
        while self.level > 1 && self.nodes[0].as_ref().unwrap().next[self.level - 1].is_none() {
            self.level -= 1;
        }
        self.length -= 1;
        true
    }
    pub fn iter(&self) -> impl Iterator<Item = &T> {
        let mut current = self.nodes[0].as_ref().unwrap().next[0];
        std::iter::from_fn(move || {
            let node = self.nodes[current?].as_ref().unwrap();
            current = node.next[0];
            node.value.as_ref()
        })
    }
    pub fn to_array(&self) -> Vec<T>
    where
        T: Clone,
    {
        self.iter().cloned().collect()
    }
}
