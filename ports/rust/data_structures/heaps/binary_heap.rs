use crate::shared::compare::Comparator;
use std::cmp::Ordering;
#[derive(Clone)]
pub struct BinaryHeap<T> {
    items: Vec<T>,
    compare: Comparator<T>,
}
impl<T> BinaryHeap<T> {
    pub fn new(compare: Comparator<T>, values: impl IntoIterator<Item = T>) -> Self {
        let mut heap = Self {
            items: values.into_iter().collect(),
            compare,
        };
        for i in (0..heap.items.len() / 2).rev() {
            heap.sift_down(i);
        }
        heap
    }
    pub fn size(&self) -> usize {
        self.items.len()
    }
    pub fn is_empty(&self) -> bool {
        self.items.is_empty()
    }
    pub fn peek(&self) -> Option<&T> {
        self.items.first()
    }
    pub fn push(&mut self, value: T) -> &mut Self {
        self.items.push(value);
        let mut i = self.items.len() - 1;
        while i > 0 {
            let parent = (i - 1) / 2;
            if (self.compare)(&self.items[i], &self.items[parent]) != Ordering::Less {
                break;
            }
            self.items.swap(i, parent);
            i = parent;
        }
        self
    }
    fn sift_down(&mut self, mut i: usize) {
        loop {
            let left = 2 * i + 1;
            let right = left + 1;
            let mut best = i;
            if left < self.items.len()
                && (self.compare)(&self.items[left], &self.items[best]) == Ordering::Less
            {
                best = left;
            }
            if right < self.items.len()
                && (self.compare)(&self.items[right], &self.items[best]) == Ordering::Less
            {
                best = right;
            }
            if best == i {
                break;
            }
            self.items.swap(i, best);
            i = best;
        }
    }
    pub fn pop(&mut self) -> Option<T> {
        if self.items.is_empty() {
            return None;
        }
        let top = self.items.swap_remove(0);
        if !self.items.is_empty() {
            self.sift_down(0);
        }
        Some(top)
    }
    pub fn push_pop(&mut self, value: T) -> T {
        if self.items.is_empty() || (self.compare)(&value, &self.items[0]) != Ordering::Greater {
            return value;
        }
        let top = std::mem::replace(&mut self.items[0], value);
        self.sift_down(0);
        top
    }
    pub fn iter(&self) -> std::slice::Iter<'_, T> {
        self.items.iter()
    }
    pub fn to_sorted_array(&self) -> Vec<T>
    where
        T: Clone,
    {
        let mut copy = self.clone();
        let mut result = Vec::new();
        while let Some(value) = copy.pop() {
            result.push(value);
        }
        result
    }
}
pub struct MinHeap<T: Ord>(pub BinaryHeap<T>);
pub struct MaxHeap<T: Ord>(pub BinaryHeap<T>);
impl<T: Ord> MinHeap<T> {
    pub fn new(values: impl IntoIterator<Item = T>) -> Self {
        Self(BinaryHeap::new(|a, b| a.cmp(b), values))
    }
}
impl<T: Ord> MaxHeap<T> {
    pub fn new(values: impl IntoIterator<Item = T>) -> Self {
        Self(BinaryHeap::new(|a, b| b.cmp(a), values))
    }
}
impl<T: Ord> std::ops::Deref for MinHeap<T> {
    type Target = BinaryHeap<T>;
    fn deref(&self) -> &Self::Target {
        &self.0
    }
}
impl<T: Ord> std::ops::DerefMut for MinHeap<T> {
    fn deref_mut(&mut self) -> &mut Self::Target {
        &mut self.0
    }
}
impl<T: Ord> std::ops::Deref for MaxHeap<T> {
    type Target = BinaryHeap<T>;
    fn deref(&self) -> &Self::Target {
        &self.0
    }
}
impl<T: Ord> std::ops::DerefMut for MaxHeap<T> {
    fn deref_mut(&mut self) -> &mut Self::Target {
        &mut self.0
    }
}
