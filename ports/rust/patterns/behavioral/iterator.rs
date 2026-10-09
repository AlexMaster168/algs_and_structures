pub struct NumberRange {
    start: f64,
    end: f64,
    step: f64,
}
impl NumberRange {
    pub fn new(start: f64, end: f64, step: f64) -> Self {
        assert!(step != 0.0);
        Self { start, end, step }
    }
    pub fn create_iterator(&self) -> ClassicIterator {
        ClassicIterator {
            current: self.start,
            end: self.end,
            step: self.step,
        }
    }
    pub fn iter(&self) -> ClassicIterator {
        self.create_iterator()
    }
}
pub struct ClassicIterator {
    current: f64,
    end: f64,
    step: f64,
}
impl ClassicIterator {
    pub fn has_next(&self) -> bool {
        if self.step > 0.0 {
            self.current < self.end
        } else {
            self.current > self.end
        }
    }
    pub fn next_value(&mut self) -> f64 {
        let value = self.current;
        self.current += self.step;
        value
    }
}
impl Iterator for ClassicIterator {
    type Item = f64;
    fn next(&mut self) -> Option<f64> {
        self.has_next().then(|| self.next_value())
    }
}
pub struct TreeItem<T> {
    pub value: T,
    pub children: Vec<TreeItem<T>>,
}
pub fn depth_first<T>(roots: &[TreeItem<T>]) -> impl Iterator<Item = &T> {
    let mut stack: Vec<_> = roots.iter().rev().collect();
    std::iter::from_fn(move || {
        let node = stack.pop()?;
        stack.extend(node.children.iter().rev());
        Some(&node.value)
    })
}
pub fn breadth_first<T>(roots: &[TreeItem<T>]) -> impl Iterator<Item = &T> {
    let mut queue: std::collections::VecDeque<_> = roots.iter().collect();
    std::iter::from_fn(move || {
        let node = queue.pop_front()?;
        queue.extend(node.children.iter());
        Some(&node.value)
    })
}
pub fn take<T>(source: impl IntoIterator<Item = T>, count: usize) -> impl Iterator<Item = T> {
    source.into_iter().take(count)
}
