enum Slot<K, V> {
    Empty,
    Deleted,
    Entry(K, V),
}
pub struct OpenAddressingHashMap<K, V> {
    slots: Vec<Slot<K, V>>,
    count: usize,
    tombstones: usize,
    hasher: fn(&K) -> u32,
}
impl<K: PartialEq, V> OpenAddressingHashMap<K, V> {
    pub fn new(hasher: fn(&K) -> u32, initial_capacity: usize) -> Self {
        Self {
            slots: (0..initial_capacity.max(2)).map(|_| Slot::Empty).collect(),
            count: 0,
            tombstones: 0,
            hasher,
        }
    }
    pub fn size(&self) -> usize {
        self.count
    }
    fn find(&self, key: &K) -> Option<usize> {
        let start = (self.hasher)(key) as usize % self.slots.len();
        for probe in 0..self.slots.len() {
            let index = (start + probe) % self.slots.len();
            match &self.slots[index] {
                Slot::Empty => return None,
                Slot::Entry(k, _) if k == key => return Some(index),
                _ => {}
            }
        }
        None
    }
    pub fn set(&mut self, key: K, value: V) -> &mut Self {
        if (self.count + self.tombstones + 1) * 2 > self.slots.len() {
            self.resize(self.slots.len() * 2);
        }
        let mut index = (self.hasher)(&key) as usize % self.slots.len();
        let mut deleted = None;
        loop {
            match &mut self.slots[index] {
                Slot::Empty => break,
                Slot::Deleted => {
                    if deleted.is_none() {
                        deleted = Some(index);
                    }
                }
                Slot::Entry(k, v) if k == &key => {
                    *v = value;
                    return self;
                }
                _ => {}
            }
            index = (index + 1) % self.slots.len();
        }
        if let Some(first) = deleted {
            index = first;
            self.tombstones -= 1;
        }
        self.slots[index] = Slot::Entry(key, value);
        self.count += 1;
        self
    }
    pub fn get(&self, key: &K) -> Option<&V> {
        match &self.slots[self.find(key)?] {
            Slot::Entry(_, value) => Some(value),
            _ => None,
        }
    }
    pub fn has(&self, key: &K) -> bool {
        self.find(key).is_some()
    }
    pub fn delete(&mut self, key: &K) -> bool {
        if let Some(index) = self.find(key) {
            self.slots[index] = Slot::Deleted;
            self.count -= 1;
            self.tombstones += 1;
            true
        } else {
            false
        }
    }
    fn resize(&mut self, capacity: usize) {
        let old = std::mem::replace(
            &mut self.slots,
            (0..capacity).map(|_| Slot::Empty).collect(),
        );
        self.count = 0;
        self.tombstones = 0;
        for slot in old {
            if let Slot::Entry(key, value) = slot {
                self.set(key, value);
            }
        }
    }
    pub fn iter(&self) -> impl Iterator<Item = (&K, &V)> {
        self.slots.iter().filter_map(|slot| match slot {
            Slot::Entry(key, value) => Some((key, value)),
            _ => None,
        })
    }
}
