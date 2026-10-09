use super::binary_heap::BinaryHeap;
struct Entry<T> {
    value: T,
    priority: f64,
    order: u64,
}
pub struct PriorityQueue<T> {
    heap: BinaryHeap<Entry<T>>,
    counter: u64,
}
impl<T> Default for PriorityQueue<T> {
    fn default() -> Self {
        Self::new()
    }
}
impl<T> PriorityQueue<T> {
    pub fn new() -> Self {
        Self {
            heap: BinaryHeap::new(
                |a, b| {
                    a.priority
                        .total_cmp(&b.priority)
                        .then(a.order.cmp(&b.order))
                },
                [],
            ),
            counter: 0,
        }
    }
    pub fn size(&self) -> usize {
        self.heap.size()
    }
    pub fn is_empty(&self) -> bool {
        self.heap.is_empty()
    }
    pub fn enqueue(&mut self, value: T, priority: f64) -> &mut Self {
        self.heap.push(Entry {
            value,
            priority,
            order: self.counter,
        });
        self.counter += 1;
        self
    }
    pub fn dequeue(&mut self) -> Option<T> {
        self.heap.pop().map(|entry| entry.value)
    }
    pub fn peek(&self) -> Option<&T> {
        self.heap.peek().map(|entry| &entry.value)
    }
    pub fn peek_priority(&self) -> Option<f64> {
        self.heap.peek().map(|entry| entry.priority)
    }
}
