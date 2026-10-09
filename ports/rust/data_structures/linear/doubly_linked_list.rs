#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub struct NodeHandle {
    index: usize,
    owner: u64,
    generation: u64,
}
pub struct DoublyLinkedListNode<T> {
    pub value: T,
    pub prev: Option<usize>,
    pub next: Option<usize>,
}
pub struct DoublyLinkedList<T> {
    nodes: Vec<Option<DoublyLinkedListNode<T>>>,
    head: Option<usize>,
    tail: Option<usize>,
    length: usize,
    owner: u64,
    free: Vec<usize>,
    generations: Vec<u64>,
}
impl<T> Default for DoublyLinkedList<T> {
    fn default() -> Self {
        Self::new()
    }
}
impl<T> DoublyLinkedList<T> {
    pub fn new() -> Self {
        static NEXT: std::sync::atomic::AtomicU64 = std::sync::atomic::AtomicU64::new(1);
        Self {
            nodes: Vec::new(),
            head: None,
            tail: None,
            length: 0,
            owner: NEXT.fetch_add(1, std::sync::atomic::Ordering::Relaxed),
            free: Vec::new(),
            generations: Vec::new(),
        }
    }
    pub fn from(values: impl IntoIterator<Item = T>) -> Self {
        let mut list = Self::new();
        for value in values {
            list.push_back(value);
        }
        list
    }
    pub fn size(&self) -> usize {
        self.length
    }
    pub fn first(&self) -> Option<&T> {
        self.head.map(|i| &self.nodes[i].as_ref().unwrap().value)
    }
    pub fn last(&self) -> Option<&T> {
        self.tail.map(|i| &self.nodes[i].as_ref().unwrap().value)
    }
    fn allocate(&mut self, node: DoublyLinkedListNode<T>) -> usize {
        if let Some(index) = self.free.pop() {
            self.nodes[index] = Some(node);
            self.generations[index] += 1;
            index
        } else {
            self.nodes.push(Some(node));
            self.generations.push(0);
            self.nodes.len() - 1
        }
    }
    pub fn push_back(&mut self, value: T) -> NodeHandle {
        let index = self.allocate(DoublyLinkedListNode {
            value,
            prev: self.tail,
            next: None,
        });
        if let Some(tail) = self.tail {
            self.nodes[tail].as_mut().unwrap().next = Some(index);
        } else {
            self.head = Some(index);
        }
        self.tail = Some(index);
        self.length += 1;
        NodeHandle {
            index,
            owner: self.owner,
            generation: self.generations[index],
        }
    }
    pub fn push_front(&mut self, value: T) -> NodeHandle {
        let index = self.allocate(DoublyLinkedListNode {
            value,
            prev: None,
            next: self.head,
        });
        if let Some(head) = self.head {
            self.nodes[head].as_mut().unwrap().prev = Some(index);
        } else {
            self.tail = Some(index);
        }
        self.head = Some(index);
        self.length += 1;
        NodeHandle {
            index,
            owner: self.owner,
            generation: self.generations[index],
        }
    }
    pub fn unlink(&mut self, handle: NodeHandle) -> Option<T> {
        if handle.owner != self.owner
            || self.generations.get(handle.index) != Some(&handle.generation)
        {
            return None;
        }
        let node = self.nodes.get_mut(handle.index)?.take()?;
        if let Some(prev) = node.prev {
            self.nodes[prev].as_mut().unwrap().next = node.next;
        } else {
            self.head = node.next;
        }
        if let Some(next) = node.next {
            self.nodes[next].as_mut().unwrap().prev = node.prev;
        } else {
            self.tail = node.prev;
        }
        self.free.push(handle.index);
        self.length -= 1;
        Some(node.value)
    }
    pub fn pop_front(&mut self) -> Option<T> {
        self.unlink(NodeHandle {
            index: self.head?,
            owner: self.owner,
            generation: self.generations[self.head?],
        })
    }
    pub fn pop_back(&mut self) -> Option<T> {
        self.unlink(NodeHandle {
            index: self.tail?,
            owner: self.owner,
            generation: self.generations[self.tail?],
        })
    }
    pub fn remove(&mut self, value: &T) -> bool
    where
        T: PartialEq,
    {
        let mut current = self.head;
        while let Some(index) = current {
            let node = self.nodes[index].as_ref().unwrap();
            if &node.value == value {
                return self
                    .unlink(NodeHandle {
                        index,
                        owner: self.owner,
                        generation: self.generations[index],
                    })
                    .is_some();
            }
            current = node.next;
        }
        false
    }
    pub fn iter(&self) -> DoublyLinkedListIter<'_, T> {
        DoublyLinkedListIter {
            list: self,
            current: self.head,
            reverse: false,
        }
    }
    pub fn reversed(&self) -> DoublyLinkedListIter<'_, T> {
        DoublyLinkedListIter {
            list: self,
            current: self.tail,
            reverse: true,
        }
    }
    pub fn to_array(&self) -> Vec<T>
    where
        T: Clone,
    {
        self.iter().cloned().collect()
    }
}
pub struct DoublyLinkedListIter<'a, T> {
    list: &'a DoublyLinkedList<T>,
    current: Option<usize>,
    reverse: bool,
}
impl<'a, T> Iterator for DoublyLinkedListIter<'a, T> {
    type Item = &'a T;
    fn next(&mut self) -> Option<Self::Item> {
        let node = self.list.nodes[self.current?].as_ref().unwrap();
        self.current = if self.reverse { node.prev } else { node.next };
        Some(&node.value)
    }
}
