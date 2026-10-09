use std::collections::VecDeque;
pub struct CircularBuffer<T> {
    items: VecDeque<T>,
    pub capacity: usize,
}
impl<T> CircularBuffer<T> {
    pub fn new(capacity: usize) -> Self {
        assert!(capacity > 0, "Capacity must be positive");
        Self {
            items: VecDeque::with_capacity(capacity),
            capacity,
        }
    }
    pub fn size(&self) -> usize {
        self.items.len()
    }
    pub fn is_full(&self) -> bool {
        self.items.len() == self.capacity
    }
    pub fn is_empty(&self) -> bool {
        self.items.is_empty()
    }
    pub fn push(&mut self, value: T) -> Option<T> {
        let overwritten = if self.is_full() {
            self.items.pop_front()
        } else {
            None
        };
        self.items.push_back(value);
        overwritten
    }
    pub fn shift(&mut self) -> Option<T> {
        self.items.pop_front()
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
