use std::collections::VecDeque;
pub struct Deque<T> {
    items: VecDeque<T>,
}
impl<T> Deque<T> {
    pub fn new(initial_capacity: usize) -> Self {
        Self {
            items: VecDeque::with_capacity(initial_capacity.max(1)),
        }
    }
    pub fn size(&self) -> usize {
        self.items.len()
    }
    pub fn is_empty(&self) -> bool {
        self.items.is_empty()
    }
    pub fn push_back(&mut self, value: T) -> &mut Self {
        self.items.push_back(value);
        self
    }
    pub fn push_front(&mut self, value: T) -> &mut Self {
        self.items.push_front(value);
        self
    }
    pub fn pop_back(&mut self) -> Option<T> {
        self.items.pop_back()
    }
    pub fn pop_front(&mut self) -> Option<T> {
        self.items.pop_front()
    }
    pub fn peek_front(&self) -> Option<&T> {
        self.items.front()
    }
    pub fn peek_back(&self) -> Option<&T> {
        self.items.back()
    }
    pub fn at(&self, index: isize) -> Option<&T> {
        let i = if index < 0 {
            self.items.len() as isize + index
        } else {
            index
        };
        if i < 0 {
            None
        } else {
            self.items.get(i as usize)
        }
    }
    pub fn iter(&self) -> impl Iterator<Item = &T> {
        self.items.iter()
    }
    pub fn to_array(&self) -> Vec<T>
    where
        T: Clone,
    {
        self.iter().cloned().collect()
    }
}
