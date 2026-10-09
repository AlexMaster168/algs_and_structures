pub use super::tree_core::Node as BSTNode;
use super::tree_core::{Link, TreeIter};
use crate::shared::compare::Comparator;
use std::cmp::Ordering;
pub struct BinarySearchTree<T> {
    root: Link<T>,
    compare: Comparator<T>,
    count: usize,
}
impl<T: Clone> BinarySearchTree<T> {
    pub fn new(compare: Comparator<T>) -> Self {
        Self {
            root: None,
            compare,
            count: 0,
        }
    }
    pub fn from(values: impl IntoIterator<Item = T>, compare: Comparator<T>) -> Self {
        let mut result = Self::new(compare);
        for value in values {
            result.insert(value);
        }
        result
    }
    pub fn size(&self) -> usize {
        self.count
    }
    pub fn root_node(&self) -> Option<&BSTNode<T>> {
        self.root.as_deref()
    }
    pub fn has(&self, value: &T) -> bool {
        let mut node = self.root.as_deref();
        while let Some(current) = node {
            match (self.compare)(value, &current.value) {
                Ordering::Equal => return true,
                Ordering::Less => node = current.left.as_deref(),
                Ordering::Greater => node = current.right.as_deref(),
            }
        }
        false
    }
    pub fn insert(&mut self, value: T) -> bool {
        let mut link = &mut self.root;
        while let Some(node) = link {
            match (self.compare)(&value, &node.value) {
                Ordering::Equal => return false,
                Ordering::Less => link = &mut node.left,
                Ordering::Greater => link = &mut node.right,
            }
        }
        *link = Some(Box::new(BSTNode::new(value)));
        self.count += 1;
        true
    }
    fn remove(link: &mut Link<T>, value: &T, compare: Comparator<T>) {
        let node = link.as_mut().unwrap();
        match compare(value, &node.value) {
            Ordering::Less => Self::remove(&mut node.left, value, compare),
            Ordering::Greater => Self::remove(&mut node.right, value, compare),
            Ordering::Equal => {
                if node.left.is_none() {
                    *link = node.right.take();
                } else if node.right.is_none() {
                    *link = node.left.take();
                } else {
                    let mut next = node.right.as_deref().unwrap();
                    while let Some(left) = next.left.as_deref() {
                        next = left;
                    }
                    let replacement = next.value.clone();
                    node.value = replacement.clone();
                    Self::remove(&mut node.right, &replacement, compare);
                }
            }
        }
    }
    pub fn delete(&mut self, value: &T) -> bool {
        if !self.has(value) {
            return false;
        }
        Self::remove(&mut self.root, value, self.compare);
        self.count -= 1;
        true
    }
    pub fn min(&self) -> Option<&T> {
        let mut node = self.root.as_deref()?;
        while let Some(left) = node.left.as_deref() {
            node = left;
        }
        Some(&node.value)
    }
    pub fn max(&self) -> Option<&T> {
        let mut node = self.root.as_deref()?;
        while let Some(right) = node.right.as_deref() {
            node = right;
        }
        Some(&node.value)
    }
    pub fn floor(&self, value: &T) -> Option<&T> {
        let mut current = self.root.as_deref();
        let mut candidate = None;
        while let Some(node) = current {
            match (self.compare)(value, &node.value) {
                Ordering::Equal => return Some(&node.value),
                Ordering::Less => current = node.left.as_deref(),
                Ordering::Greater => {
                    candidate = Some(&node.value);
                    current = node.right.as_deref();
                }
            }
        }
        candidate
    }
    pub fn ceil(&self, value: &T) -> Option<&T> {
        let mut current = self.root.as_deref();
        let mut candidate = None;
        while let Some(node) = current {
            match (self.compare)(value, &node.value) {
                Ordering::Equal => return Some(&node.value),
                Ordering::Greater => current = node.right.as_deref(),
                Ordering::Less => {
                    candidate = Some(&node.value);
                    current = node.left.as_deref();
                }
            }
        }
        candidate
    }
    pub fn height(&self) -> usize {
        fn measure<T>(node: Option<&BSTNode<T>>) -> usize {
            node.map_or(0, |node| {
                1 + measure(node.left.as_deref()).max(measure(node.right.as_deref()))
            })
        }
        measure(self.root.as_deref())
    }
    pub fn iter(&self) -> TreeIter<'_, T> {
        TreeIter::new(self.root.as_deref())
    }
    pub fn to_array(&self) -> Vec<T> {
        self.iter().cloned().collect()
    }
}
