use std::collections::VecDeque;
pub struct Queue<T> {
    items: VecDeque<T>,
}
impl<T> Default for Queue<T> {
    fn default() -> Self {
        Self::new()
    }
}
impl<T> Queue<T> {
    pub fn new() -> Self {
        Self {
            items: VecDeque::new(),
        }
    }
    pub fn size(&self) -> usize {
        self.items.len()
    }
    pub fn is_empty(&self) -> bool {
        self.items.is_empty()
    }
    pub fn enqueue(&mut self, value: T) -> &mut Self {
        self.items.push_back(value);
        self
    }
    pub fn dequeue(&mut self) -> Option<T> {
        self.items.pop_front()
    }
    pub fn peek(&self) -> Option<&T> {
        self.items.front()
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
