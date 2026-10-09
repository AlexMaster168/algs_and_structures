pub struct HashTable<K, V> {
    buckets: Vec<Vec<(K, V)>>,
    count: usize,
    hasher: fn(&K) -> u32,
    max_load_factor: f64,
}
impl<K: PartialEq, V> HashTable<K, V> {
    pub fn new(hasher: fn(&K) -> u32, initial_capacity: usize, max_load_factor: f64) -> Self {
        assert!(max_load_factor > 0.0);
        Self {
            buckets: (0..initial_capacity.max(1)).map(|_| Vec::new()).collect(),
            count: 0,
            hasher,
            max_load_factor,
        }
    }
    pub fn size(&self) -> usize {
        self.count
    }
    pub fn capacity(&self) -> usize {
        self.buckets.len()
    }
    fn index(&self, key: &K) -> usize {
        (self.hasher)(key) as usize % self.buckets.len()
    }
    pub fn set(&mut self, key: K, value: V) -> &mut Self {
        let index = self.index(&key);
        if let Some(entry) = self.buckets[index].iter_mut().find(|(k, _)| k == &key) {
            entry.1 = value;
            return self;
        }
        self.buckets[index].push((key, value));
        self.count += 1;
        if self.count as f64 / self.capacity() as f64 > self.max_load_factor {
            self.resize(self.capacity() * 2);
        }
        self
    }
    pub fn get(&self, key: &K) -> Option<&V> {
        self.buckets[self.index(key)]
            .iter()
            .find(|(k, _)| k == key)
            .map(|(_, value)| value)
    }
    pub fn has(&self, key: &K) -> bool {
        self.get(key).is_some()
    }
    pub fn delete(&mut self, key: &K) -> bool {
        let index = self.index(key);
        if let Some(position) = self.buckets[index].iter().position(|(k, _)| k == key) {
            self.buckets[index].remove(position);
            self.count -= 1;
            true
        } else {
            false
        }
    }
    pub fn clear(&mut self) {
        for bucket in &mut self.buckets {
            bucket.clear();
        }
        self.count = 0;
    }
    fn resize(&mut self, capacity: usize) {
        let old = std::mem::replace(
            &mut self.buckets,
            (0..capacity).map(|_| Vec::new()).collect(),
        );
        for (key, value) in old.into_iter().flatten() {
            let index = self.index(&key);
            self.buckets[index].push((key, value));
        }
    }
    pub fn iter(&self) -> impl Iterator<Item = (&K, &V)> {
        self.buckets
            .iter()
            .flatten()
            .map(|(key, value)| (key, value))
    }
    pub fn keys(&self) -> impl Iterator<Item = &K> {
        self.iter().map(|(key, _)| key)
    }
    pub fn values(&self) -> impl Iterator<Item = &V> {
        self.iter().map(|(_, value)| value)
    }
}
