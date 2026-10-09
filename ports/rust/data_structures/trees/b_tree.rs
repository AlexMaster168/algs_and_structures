use crate::shared::compare::Comparator;
use std::cmp::Ordering;
struct Node<T> {
    keys: Vec<T>,
    children: Vec<Node<T>>,
}
impl<T> Node<T> {
    fn new() -> Self {
        Self {
            keys: Vec::new(),
            children: Vec::new(),
        }
    }
    fn leaf(&self) -> bool {
        self.children.is_empty()
    }
}
pub struct BTree<T> {
    root: Node<T>,
    pub min_degree: usize,
    compare: Comparator<T>,
    count: usize,
}
impl<T: Clone> BTree<T> {
    pub fn new(min_degree: usize, compare: Comparator<T>) -> Self {
        assert!(min_degree >= 2);
        Self {
            root: Node::new(),
            min_degree,
            compare,
            count: 0,
        }
    }
    pub fn size(&self) -> usize {
        self.count
    }
    fn index(node: &Node<T>, value: &T, compare: Comparator<T>) -> usize {
        node.keys
            .partition_point(|key| compare(key, value) == Ordering::Less)
    }
    pub fn has(&self, value: &T) -> bool {
        let mut node = &self.root;
        loop {
            let i = Self::index(node, value, self.compare);
            if i < node.keys.len() && (self.compare)(&node.keys[i], value) == Ordering::Equal {
                return true;
            }
            if node.leaf() {
                return false;
            }
            node = &node.children[i];
        }
    }
    pub fn height(&self) -> usize {
        let mut h = 1;
        let mut node = &self.root;
        while !node.leaf() {
            h += 1;
            node = &node.children[0];
        }
        h
    }
    fn split(parent: &mut Node<T>, i: usize, degree: usize) {
        let child = &mut parent.children[i];
        let keys = child.keys.split_off(degree);
        let middle = child.keys.pop().unwrap();
        let children = if child.leaf() {
            Vec::new()
        } else {
            child.children.split_off(degree)
        };
        parent.keys.insert(i, middle);
        parent.children.insert(i + 1, Node { keys, children });
    }
    fn add(node: &mut Node<T>, value: T, degree: usize, compare: Comparator<T>) {
        let mut i = Self::index(node, &value, compare);
        if node.leaf() {
            node.keys.insert(i, value);
            return;
        }
        if node.children[i].keys.len() == 2 * degree - 1 {
            Self::split(node, i, degree);
            if compare(&value, &node.keys[i]) == Ordering::Greater {
                i += 1;
            }
        }
        Self::add(&mut node.children[i], value, degree, compare);
    }
    pub fn insert(&mut self, value: T) -> bool {
        if self.has(&value) {
            return false;
        }
        if self.root.keys.len() == 2 * self.min_degree - 1 {
            let old = std::mem::replace(&mut self.root, Node::new());
            self.root.children.push(old);
            Self::split(&mut self.root, 0, self.min_degree);
        }
        Self::add(&mut self.root, value, self.min_degree, self.compare);
        self.count += 1;
        true
    }
    fn merge(node: &mut Node<T>, i: usize) {
        let middle = node.keys.remove(i);
        let right = node.children.remove(i + 1);
        node.children[i].keys.push(middle);
        node.children[i].keys.extend(right.keys);
        node.children[i].children.extend(right.children);
    }
    fn strengthen(node: &mut Node<T>, i: usize, degree: usize) {
        if i > 0 && node.children[i - 1].keys.len() >= degree {
            let key = node.children[i - 1].keys.pop().unwrap();
            let middle = std::mem::replace(&mut node.keys[i - 1], key);
            node.children[i].keys.insert(0, middle);
            if !node.children[i - 1].leaf() {
                let child = node.children[i - 1].children.pop().unwrap();
                node.children[i].children.insert(0, child);
            }
        } else if i + 1 < node.children.len() && node.children[i + 1].keys.len() >= degree {
            let key = node.children[i + 1].keys.remove(0);
            let middle = std::mem::replace(&mut node.keys[i], key);
            node.children[i].keys.push(middle);
            if !node.children[i + 1].leaf() {
                let child = node.children[i + 1].children.remove(0);
                node.children[i].children.push(child);
            }
        } else {
            Self::merge(
                node,
                if i + 1 < node.children.len() {
                    i
                } else {
                    i - 1
                },
            );
        }
    }
    fn remove(node: &mut Node<T>, value: &T, degree: usize, compare: Comparator<T>) {
        let mut i = Self::index(node, value, compare);
        if i < node.keys.len() && compare(&node.keys[i], value) == Ordering::Equal {
            if node.leaf() {
                node.keys.remove(i);
                return;
            }
            if node.children[i].keys.len() >= degree {
                let mut next = &node.children[i];
                while !next.leaf() {
                    next = next.children.last().unwrap();
                }
                let replacement = next.keys.last().unwrap().clone();
                node.keys[i] = replacement.clone();
                Self::remove(&mut node.children[i], &replacement, degree, compare);
            } else if node.children[i + 1].keys.len() >= degree {
                let mut next = &node.children[i + 1];
                while !next.leaf() {
                    next = &next.children[0];
                }
                let replacement = next.keys[0].clone();
                node.keys[i] = replacement.clone();
                Self::remove(&mut node.children[i + 1], &replacement, degree, compare);
            } else {
                Self::merge(node, i);
                Self::remove(&mut node.children[i], value, degree, compare);
            }
        } else if !node.leaf() {
            if node.children[i].keys.len() < degree {
                Self::strengthen(node, i, degree);
                if i > node.keys.len() {
                    i -= 1;
                }
            }
            Self::remove(&mut node.children[i], value, degree, compare);
        }
    }
    pub fn delete(&mut self, value: &T) -> bool {
        if !self.has(value) {
            return false;
        }
        Self::remove(&mut self.root, value, self.min_degree, self.compare);
        if self.root.keys.is_empty() && !self.root.leaf() {
            self.root = self.root.children.remove(0);
        }
        self.count -= 1;
        true
    }
    pub fn is_valid(&self) -> bool {
        fn check<T>(
            node: &Node<T>,
            top: bool,
            degree: usize,
            compare: Comparator<T>,
            low: Option<&T>,
            high: Option<&T>,
            depth: usize,
            leaf_depth: &mut Option<usize>,
            total: &mut usize,
        ) -> bool {
            if node.keys.len() > 2 * degree - 1 || (!top && node.keys.len() < degree - 1) {
                return false;
            }
            for (i, key) in node.keys.iter().enumerate() {
                if (i > 0 && compare(&node.keys[i - 1], key) != Ordering::Less)
                    || low.is_some_and(|v| compare(v, key) != Ordering::Less)
                    || high.is_some_and(|v| compare(key, v) != Ordering::Less)
                {
                    return false;
                }
            }
            *total += node.keys.len();
            if node.leaf() {
                if leaf_depth.is_none() {
                    *leaf_depth = Some(depth);
                }
                return *leaf_depth == Some(depth);
            }
            if node.children.len() != node.keys.len() + 1 || node.keys.is_empty() {
                return false;
            }
            (0..node.children.len()).all(|i| {
                check(
                    &node.children[i],
                    false,
                    degree,
                    compare,
                    if i > 0 { Some(&node.keys[i - 1]) } else { low },
                    node.keys.get(i).or(high),
                    depth + 1,
                    leaf_depth,
                    total,
                )
            })
        }
        let mut total = 0;
        check(
            &self.root,
            true,
            self.min_degree,
            self.compare,
            None,
            None,
            0,
            &mut None,
            &mut total,
        ) && total == self.count
    }
    pub fn iter(&self) -> BTreeIter<'_, T> {
        BTreeIter::new(&self.root)
    }
    pub fn to_array(&self) -> Vec<T> {
        self.iter().cloned().collect()
    }
}
pub struct BTreeIter<'a, T> {
    stack: Vec<(&'a Node<T>, usize)>,
}
impl<'a, T> BTreeIter<'a, T> {
    fn new(root: &'a Node<T>) -> Self {
        let mut result = Self { stack: Vec::new() };
        result.descend(root);
        result
    }
    fn descend(&mut self, mut node: &'a Node<T>) {
        loop {
            self.stack.push((node, 0));
            if node.leaf() {
                break;
            }
            node = &node.children[0];
        }
        self.normalize();
    }
    fn normalize(&mut self) {
        while self
            .stack
            .last()
            .is_some_and(|(node, i)| *i >= node.keys.len())
        {
            self.stack.pop();
        }
    }
}
impl<'a, T> Iterator for BTreeIter<'a, T> {
    type Item = &'a T;
    fn next(&mut self) -> Option<Self::Item> {
        let (node, i) = *self.stack.last()?;
        let value = &node.keys[i];
        self.stack.last_mut().unwrap().1 += 1;
        if node.leaf() {
            self.normalize();
        } else {
            self.descend(&node.children[i + 1]);
        }
        Some(value)
    }
}
