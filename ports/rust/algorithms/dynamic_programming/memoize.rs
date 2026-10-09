use std::collections::HashMap;
use std::hash::Hash;

pub struct Memoized<A, K, R, F, G> {
    pub cache: HashMap<K, R>,
    function: F,
    key: G,
    arguments: std::marker::PhantomData<A>,
}

impl<A, K: Eq + Hash, R: Clone, F: FnMut(A) -> R, G: Fn(&A) -> K> Memoized<A, K, R, F, G> {
    pub fn call(&mut self, args: A) -> R {
        let key = (self.key)(&args);
        if let Some(value) = self.cache.get(&key) {
            return value.clone();
        }
        let value = (self.function)(args);
        self.cache.insert(key, value.clone());
        value
    }
}

pub fn memoize<A, K: Eq + Hash, R: Clone, F: FnMut(A) -> R, G: Fn(&A) -> K>(
    function: F,
    key: G,
) -> Memoized<A, K, R, F, G> {
    Memoized {
        cache: HashMap::new(),
        function,
        key,
        arguments: std::marker::PhantomData,
    }
}
