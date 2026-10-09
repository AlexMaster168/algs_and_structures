pub struct LinkedListNode<T> {
    pub value: T,
    pub next: Option<usize>,
}
impl<T> LinkedListNode<T> {
    pub fn new(value: T) -> Self {
        Self { value, next: None }
    }
}
pub struct LinkedList<T> {
    nodes: Vec<Option<LinkedListNode<T>>>,
    free: Vec<usize>,
    head: Option<usize>,
    tail: Option<usize>,
    length: usize,
}
impl<T> Default for LinkedList<T> {
    fn default() -> Self {
        Self::new()
    }
}
impl<T> LinkedList<T> {
    pub fn new() -> Self {
        Self {
            nodes: Vec::new(),
            free: Vec::new(),
            head: None,
            tail: None,
            length: 0,
        }
    }
    pub fn from(values: impl IntoIterator<Item = T>) -> Self {
        let mut list = Self::new();
        for value in values {
            list.append(value);
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
    fn allocate(&mut self, value: T, next: Option<usize>) -> usize {
        let node = Some(LinkedListNode { value, next });
        if let Some(index) = self.free.pop() {
            self.nodes[index] = node;
            index
        } else {
            self.nodes.push(node);
            self.nodes.len() - 1
        }
    }
    pub fn append(&mut self, value: T) -> &mut Self {
        let index = self.allocate(value, None);
        if let Some(tail) = self.tail {
            self.nodes[tail].as_mut().unwrap().next = Some(index);
        } else {
            self.head = Some(index);
        }
        self.tail = Some(index);
        self.length += 1;
        self
    }
    pub fn prepend(&mut self, value: T) -> &mut Self {
        let index = self.allocate(value, self.head);
        self.head = Some(index);
        if self.tail.is_none() {
            self.tail = Some(index);
        }
        self.length += 1;
        self
    }
    fn node_at(&self, index: usize) -> Option<usize> {
        let mut current = self.head;
        for _ in 0..index {
            current = self.nodes[current?].as_ref().unwrap().next;
        }
        current
    }
    pub fn insert_at(&mut self, index: usize, value: T) -> &mut Self {
        assert!(index <= self.length, "Index out of bounds");
        if index == 0 {
            return self.prepend(value);
        }
        if index == self.length {
            return self.append(value);
        }
        let previous = self.node_at(index - 1).unwrap();
        let next = self.nodes[previous].as_ref().unwrap().next;
        let inserted = self.allocate(value, next);
        self.nodes[previous].as_mut().unwrap().next = Some(inserted);
        self.length += 1;
        self
    }
    pub fn get(&self, index: usize) -> Option<&T> {
        self.node_at(index)
            .map(|i| &self.nodes[i].as_ref().unwrap().value)
    }
    pub fn index_of(&self, value: &T) -> isize
    where
        T: PartialEq,
    {
        self.iter()
            .position(|item| item == value)
            .map_or(-1, |i| i as isize)
    }
    pub fn find(&self, predicate: impl Fn(&T) -> bool) -> Option<&T> {
        self.iter().find(|item| predicate(item))
    }
    pub fn remove_at(&mut self, index: usize) -> Option<T> {
        if index >= self.length {
            return None;
        }
        let previous = if index > 0 {
            self.node_at(index - 1)
        } else {
            None
        };
        let removed = if let Some(previous) = previous {
            self.nodes[previous].as_ref().unwrap().next?
        } else {
            self.head?
        };
        let node = self.nodes[removed].take().unwrap();
        if let Some(previous) = previous {
            self.nodes[previous].as_mut().unwrap().next = node.next;
        } else {
            self.head = node.next;
        }
        if self.tail == Some(removed) {
            self.tail = previous;
        }
        self.free.push(removed);
        self.length -= 1;
        Some(node.value)
    }
    pub fn remove(&mut self, value: &T) -> bool
    where
        T: PartialEq,
    {
        let index = self.index_of(value);
        index >= 0 && self.remove_at(index as usize).is_some()
    }
    pub fn reverse(&mut self) -> &mut Self {
        let mut previous = None;
        let mut current = self.head;
        self.tail = self.head;
        while let Some(index) = current {
            let node = self.nodes[index].as_mut().unwrap();
            current = node.next;
            node.next = previous;
            previous = Some(index);
        }
        self.head = previous;
        self
    }
    pub fn iter(&self) -> LinkedListIter<'_, T> {
        LinkedListIter {
            list: self,
            current: self.head,
        }
    }
    pub fn to_array(&self) -> Vec<T>
    where
        T: Clone,
    {
        self.iter().cloned().collect()
    }
}
pub struct LinkedListIter<'a, T> {
    list: &'a LinkedList<T>,
    current: Option<usize>,
}
impl<'a, T> Iterator for LinkedListIter<'a, T> {
    type Item = &'a T;
    fn next(&mut self) -> Option<Self::Item> {
        let node = self.list.nodes[self.current?].as_ref().unwrap();
        self.current = node.next;
        Some(&node.value)
    }
}
