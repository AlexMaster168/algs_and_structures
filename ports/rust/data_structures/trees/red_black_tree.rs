use super::tree_core::{Link, Node, TreeIter};
use crate::shared::compare::Comparator;
use std::cmp::Ordering;
pub struct RedBlackTree<T> {
    root: Link<T>,
    compare: Comparator<T>,
    count: usize,
}
impl<T: Clone> RedBlackTree<T> {
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
    fn red(node: &Link<T>) -> bool {
        node.as_ref().is_some_and(|n| n.red)
    }
    fn left(mut node: Box<Node<T>>) -> Box<Node<T>> {
        let mut child = node.right.take().unwrap();
        node.right = child.left.take();
        child.red = node.red;
        node.red = true;
        child.left = Some(node);
        child
    }
    fn right(mut node: Box<Node<T>>) -> Box<Node<T>> {
        let mut child = node.left.take().unwrap();
        node.left = child.right.take();
        child.red = node.red;
        node.red = true;
        child.right = Some(node);
        child
    }
    fn flip(node: &mut Node<T>) {
        node.red = !node.red;
        if let Some(left) = &mut node.left {
            left.red = !left.red;
        }
        if let Some(right) = &mut node.right {
            right.red = !right.red;
        }
    }
    fn fix(mut node: Box<Node<T>>) -> Box<Node<T>> {
        if Self::red(&node.right) {
            node = Self::left(node);
        }
        if Self::red(&node.left) && Self::red(&node.left.as_ref().unwrap().left) {
            node = Self::right(node);
        }
        if Self::red(&node.left) && Self::red(&node.right) {
            Self::flip(&mut node);
        }
        node
    }
    fn move_left(mut node: Box<Node<T>>) -> Box<Node<T>> {
        Self::flip(&mut node);
        if node.right.as_ref().is_some_and(|n| Self::red(&n.left)) {
            node.right = Some(Self::right(node.right.take().unwrap()));
            node = Self::left(node);
            Self::flip(&mut node);
        }
        node
    }
    fn move_right(mut node: Box<Node<T>>) -> Box<Node<T>> {
        Self::flip(&mut node);
        if node.left.as_ref().is_some_and(|n| Self::red(&n.left)) {
            node = Self::right(node);
            Self::flip(&mut node);
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
        if Self::red(&node.right) && !Self::red(&node.left) {
            node = Self::left(node);
        }
        if Self::red(&node.left) && Self::red(&node.left.as_ref().unwrap().left) {
            node = Self::right(node);
        }
        if Self::red(&node.left) && Self::red(&node.right) {
            Self::flip(&mut node);
        }
        node
    }
    fn remove_min(mut node: Box<Node<T>>) -> Link<T> {
        if node.left.is_none() {
            return None;
        }
        if !Self::red(&node.left) && !Self::red(&node.left.as_ref().unwrap().left) {
            node = Self::move_left(node);
        }
        node.left = Self::remove_min(node.left.take().unwrap());
        Some(Self::fix(node))
    }
    fn remove(mut node: Box<Node<T>>, value: &T, compare: Comparator<T>) -> Link<T> {
        if compare(value, &node.value) == Ordering::Less {
            if node.left.is_some() {
                if !Self::red(&node.left) && !Self::red(&node.left.as_ref().unwrap().left) {
                    node = Self::move_left(node);
                }
                node.left = Self::remove(node.left.take().unwrap(), value, compare);
            }
        } else {
            if Self::red(&node.left) {
                node = Self::right(node);
            }
            if compare(value, &node.value) == Ordering::Equal && node.right.is_none() {
                return None;
            }
            if node.right.is_some() {
                if !Self::red(&node.right) && !Self::red(&node.right.as_ref().unwrap().left) {
                    node = Self::move_right(node);
                }
                if compare(value, &node.value) == Ordering::Equal {
                    let mut next = node.right.as_deref().unwrap();
                    while let Some(left) = next.left.as_deref() {
                        next = left;
                    }
                    node.value = next.value.clone();
                    node.right = Self::remove_min(node.right.take().unwrap());
                } else {
                    node.right = Self::remove(node.right.take().unwrap(), value, compare);
                }
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
        let mut root = Self::add(self.root.take(), value, self.compare);
        root.red = false;
        self.root = Some(root);
        self.count += 1;
        true
    }
    pub fn delete(&mut self, value: &T) -> bool {
        if !self.has(value) {
            return false;
        }
        let mut root = self.root.take().unwrap();
        if !Self::red(&root.left) && !Self::red(&root.right) {
            root.red = true;
        }
        self.root = Self::remove(root, value, self.compare);
        if let Some(root) = &mut self.root {
            root.red = false;
        }
        self.count -= 1;
        true
    }
    pub fn height(&self) -> usize {
        fn h<T>(node: Option<&Node<T>>) -> usize {
            node.map_or(0, |n| 1 + h(n.left.as_deref()).max(h(n.right.as_deref())))
        }
        h(self.root.as_deref())
    }
    pub fn is_valid(&self) -> bool {
        fn check<T: Clone>(
            node: Option<&Node<T>>,
            low: Option<&T>,
            high: Option<&T>,
            compare: Comparator<T>,
            count: &mut usize,
        ) -> Option<usize> {
            let Some(node) = node else {
                return Some(1);
            };
            if low.is_some_and(|v| compare(v, &node.value) != Ordering::Less)
                || high.is_some_and(|v| compare(&node.value, v) != Ordering::Less)
                || RedBlackTree::<T>::red(&node.right)
                || (node.red
                    && (RedBlackTree::<T>::red(&node.left) || RedBlackTree::<T>::red(&node.right)))
            {
                return None;
            }
            *count += 1;
            let a = check(node.left.as_deref(), low, Some(&node.value), compare, count)?;
            let b = check(
                node.right.as_deref(),
                Some(&node.value),
                high,
                compare,
                count,
            )?;
            if a != b {
                None
            } else {
                Some(a + usize::from(!node.red))
            }
        }
        let mut count = 0;
        !Self::red(&self.root)
            && check(self.root.as_deref(), None, None, self.compare, &mut count).is_some()
            && count == self.count
    }
    pub fn iter(&self) -> TreeIter<'_, T> {
        TreeIter::new(self.root.as_deref())
    }
    pub fn to_array(&self) -> Vec<T> {
        self.iter().cloned().collect()
    }
}
