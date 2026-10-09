use std::collections::HashMap;
use std::hash::Hash;
struct Entry<K, V> {
    key: K,
    value: V,
    prev: Option<usize>,
    next: Option<usize>,
}
pub struct LRUCache<K, V> {
    pub capacity: usize,
    nodes: HashMap<K, usize>,
    entries: Vec<Option<Entry<K, V>>>,
    free: Vec<usize>,
    head: Option<usize>,
    tail: Option<usize>,
}
impl<K: Eq + Hash + Clone, V> LRUCache<K, V> {
    pub fn new(capacity: usize) -> Self {
        assert!(capacity > 0);
        Self {
            capacity,
            nodes: HashMap::new(),
            entries: Vec::new(),
            free: Vec::new(),
            head: None,
            tail: None,
        }
    }
    pub fn size(&self) -> usize {
        self.nodes.len()
    }
    pub fn has(&self, key: &K) -> bool {
        self.nodes.contains_key(key)
    }
    fn unlink(&mut self, index: usize) {
        let entry = self.entries[index].as_ref().unwrap();
        let (prev, next) = (entry.prev, entry.next);
        if let Some(prev) = prev {
            self.entries[prev].as_mut().unwrap().next = next;
        } else {
            self.head = next;
        }
        if let Some(next) = next {
            self.entries[next].as_mut().unwrap().prev = prev;
        } else {
            self.tail = prev;
        }
    }
    fn front(&mut self, index: usize) {
        let entry = self.entries[index].as_mut().unwrap();
        entry.prev = None;
        entry.next = self.head;
        if let Some(head) = self.head {
            self.entries[head].as_mut().unwrap().prev = Some(index);
        } else {
            self.tail = Some(index);
        }
        self.head = Some(index);
    }
    fn touch(&mut self, index: usize) {
        if self.head != Some(index) {
            self.unlink(index);
            self.front(index);
        }
    }
    pub fn get(&mut self, key: &K) -> Option<&V> {
        let index = *self.nodes.get(key)?;
        self.touch(index);
        Some(&self.entries[index].as_ref().unwrap().value)
    }
    pub fn set(&mut self, key: K, value: V) -> &mut Self {
        if let Some(&index) = self.nodes.get(&key) {
            self.entries[index].as_mut().unwrap().value = value;
            self.touch(index);
        } else {
            let entry = Some(Entry {
                key: key.clone(),
                value,
                prev: None,
                next: None,
            });
            let index = if let Some(index) = self.free.pop() {
                self.entries[index] = entry;
                index
            } else {
                self.entries.push(entry);
                self.entries.len() - 1
            };
            self.nodes.insert(key, index);
            self.front(index);
            if self.nodes.len() > self.capacity {
                let index = self.tail.unwrap();
                self.unlink(index);
                let entry = self.entries[index].take().unwrap();
                self.nodes.remove(&entry.key);
                self.free.push(index);
            }
        }
        self
    }
    pub fn delete(&mut self, key: &K) -> bool {
        let Some(index) = self.nodes.remove(key) else {
            return false;
        };
        self.unlink(index);
        self.entries[index] = None;
        self.free.push(index);
        true
    }
    pub fn keys(&self) -> Vec<K> {
        let mut result = Vec::new();
        let mut current = self.head;
        while let Some(index) = current {
            let entry = self.entries[index].as_ref().unwrap();
            result.push(entry.key.clone());
            current = entry.next;
        }
        result
    }
}
