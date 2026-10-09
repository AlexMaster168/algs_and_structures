use super::tree_core::{Link, Node, TreeIter};
use crate::shared::compare::Comparator;
use std::cmp::Ordering;
pub struct AVLTree<T> {
    root: Link<T>,
    compare: Comparator<T>,
    count: usize,
}
impl<T: Clone> AVLTree<T> {
    pub fn new(compare: Comparator<T>) -> Self {
        Self {
            root: None,
            compare,
            count: 0,
        }
    }
    pub fn size(&self) -> usize {
        self.count
    }
    fn h(link: &Link<T>) -> usize {
        link.as_ref().map_or(0, |n| n.height)
    }
    fn balance(node: &Node<T>) -> isize {
        Self::h(&node.left) as isize - Self::h(&node.right) as isize
    }
    fn refresh(node: &mut Node<T>) {
        node.height = 1 + Self::h(&node.left).max(Self::h(&node.right));
    }
    fn left(mut node: Box<Node<T>>) -> Box<Node<T>> {
        let mut child = node.right.take().unwrap();
        node.right = child.left.take();
        Self::refresh(&mut node);
        child.left = Some(node);
        Self::refresh(&mut child);
        child
    }
    fn right(mut node: Box<Node<T>>) -> Box<Node<T>> {
        let mut child = node.left.take().unwrap();
        node.left = child.right.take();
        Self::refresh(&mut node);
        child.right = Some(node);
        Self::refresh(&mut child);
        child
    }
    fn fix(mut node: Box<Node<T>>) -> Box<Node<T>> {
        Self::refresh(&mut node);
        let balance = Self::balance(&node);
        if balance > 1 {
            if Self::balance(node.left.as_ref().unwrap()) < 0 {
                node.left = Some(Self::left(node.left.take().unwrap()));
            }
            node = Self::right(node);
        } else if balance < -1 {
            if Self::balance(node.right.as_ref().unwrap()) > 0 {
                node.right = Some(Self::right(node.right.take().unwrap()));
            }
            node = Self::left(node);
        }
        node
    }
    fn add(link: Link<T>, value: T, compare: Comparator<T>) -> Box<Node<T>> {
        let Some(mut node) = link else {
            return Box::new(Node::new(value));
        };
        if compare(&value, &node.value) == Ordering::Less {
            node.left = Some(Self::add(node.left.take(), value, compare));
        } else {
            node.right = Some(Self::add(node.right.take(), value, compare));
        }
        Self::fix(node)
    }
    fn remove(link: Link<T>, value: &T, compare: Comparator<T>) -> Link<T> {
        let mut node = link.unwrap();
        match compare(value, &node.value) {
            Ordering::Less => node.left = Self::remove(node.left.take(), value, compare),
            Ordering::Greater => node.right = Self::remove(node.right.take(), value, compare),
            Ordering::Equal => {
                if node.left.is_none() {
                    return node.right;
                }
                if node.right.is_none() {
                    return node.left;
                }
                let mut next = node.right.as_deref().unwrap();
                while let Some(left) = next.left.as_deref() {
                    next = left;
                }
                let replacement = next.value.clone();
                node.value = replacement.clone();
                node.right = Self::remove(node.right.take(), &replacement, compare);
            }
        }
        Some(Self::fix(node))
    }
    pub fn has(&self, value: &T) -> bool {
        let mut current = self.root.as_deref();
        while let Some(node) = current {
            match (self.compare)(value, &node.value) {
                Ordering::Equal => return true,
                Ordering::Less => current = node.left.as_deref(),
                Ordering::Greater => current = node.right.as_deref(),
            }
        }
        false
    }
    pub fn insert(&mut self, value: T) -> bool {
        if self.has(&value) {
            return false;
        }
        self.root = Some(Self::add(self.root.take(), value, self.compare));
        self.count += 1;
        true
    }
    pub fn delete(&mut self, value: &T) -> bool {
        if !self.has(value) {
            return false;
        }
        self.root = Self::remove(self.root.take(), value, self.compare);
        self.count -= 1;
        true
    }
    pub fn height(&self) -> usize {
        Self::h(&self.root)
    }
    pub fn is_balanced(&self) -> bool {
        fn check<T>(node: Option<&Node<T>>) -> Option<usize> {
            let Some(node) = node else {
                return Some(0);
            };
            let a = check(node.left.as_deref())?;
            let b = check(node.right.as_deref())?;
            if a.abs_diff(b) > 1 || node.height != 1 + a.max(b) {
                None
            } else {
                Some(node.height)
            }
        }
        check(self.root.as_deref()).is_some()
    }
    pub fn iter(&self) -> TreeIter<'_, T> {
        TreeIter::new(self.root.as_deref())
    }
    pub fn to_array(&self) -> Vec<T> {
        self.iter().cloned().collect()
    }
}
