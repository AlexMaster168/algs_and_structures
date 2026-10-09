#[derive(Default, Clone)]
pub struct Stack<T> {
    items: Vec<T>,
}
impl<T> Stack<T> {
    pub fn new() -> Self {
        Self { items: Vec::new() }
    }
    pub fn size(&self) -> usize {
        self.items.len()
    }
    pub fn is_empty(&self) -> bool {
        self.items.is_empty()
    }
    pub fn push(&mut self, value: T) -> &mut Self {
        self.items.push(value);
        self
    }
    pub fn pop(&mut self) -> Option<T> {
        self.items.pop()
    }
    pub fn peek(&self) -> Option<&T> {
        self.items.last()
    }
    pub fn clear(&mut self) {
        self.items.clear();
    }
    pub fn iter(&self) -> impl Iterator<Item = &T> {
        self.items.iter().rev()
    }
    pub fn to_array(&self) -> Vec<T>
    where
        T: Clone,
    {
        self.iter().cloned().collect()
    }
}
