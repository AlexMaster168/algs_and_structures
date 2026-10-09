use algorithm_collection::data_structures::{
    hashing::{
        hash::default_hasher, hash_table::HashTable, lru_cache::LRUCache,
        open_addressing_hash_map::OpenAddressingHashMap,
    },
    linear::{doubly_linked_list::DoublyLinkedList, linked_list::LinkedList, skip_list::SkipList},
    range_queries::{
        fenwick_tree::FenwickTree, lazy_segment_tree::LazySegmentTree,
        segment_tree::sum_segment_tree, sqrt_decomposition::SqrtDecomposition,
    },
    trees::{
        avl_tree::AVLTree, b_tree::BTree, binary_search_tree::BinarySearchTree,
        red_black_tree::RedBlackTree,
    },
};
use std::collections::BTreeSet;
trait Tree {
    fn insert(&mut self, value: i32) -> bool;
    fn delete(&mut self, value: &i32) -> bool;
    fn values(&self) -> Vec<i32>;
    fn valid(&self) -> bool;
}
impl Tree for AVLTree<i32> {
    fn insert(&mut self, value: i32) -> bool {
        AVLTree::insert(self, value)
    }
    fn delete(&mut self, value: &i32) -> bool {
        AVLTree::delete(self, value)
    }
    fn values(&self) -> Vec<i32> {
        self.to_array()
    }
    fn valid(&self) -> bool {
        self.is_balanced()
    }
}
impl Tree for RedBlackTree<i32> {
    fn insert(&mut self, value: i32) -> bool {
        RedBlackTree::insert(self, value)
    }
    fn delete(&mut self, value: &i32) -> bool {
        RedBlackTree::delete(self, value)
    }
    fn values(&self) -> Vec<i32> {
        self.to_array()
    }
    fn valid(&self) -> bool {
        self.is_valid()
    }
}
impl Tree for BTree<i32> {
    fn insert(&mut self, value: i32) -> bool {
        BTree::insert(self, value)
    }
    fn delete(&mut self, value: &i32) -> bool {
        BTree::delete(self, value)
    }
    fn values(&self) -> Vec<i32> {
        self.to_array()
    }
    fn valid(&self) -> bool {
        self.is_valid()
    }
}
impl Tree for BinarySearchTree<i32> {
    fn insert(&mut self, value: i32) -> bool {
        BinarySearchTree::insert(self, value)
    }
    fn delete(&mut self, value: &i32) -> bool {
        BinarySearchTree::delete(self, value)
    }
    fn values(&self) -> Vec<i32> {
        self.to_array()
    }
    fn valid(&self) -> bool {
        true
    }
}
fn exercise(tree: &mut impl Tree) {
    let mut expected = BTreeSet::new();
    let mut seed = 718u32;
    for _ in 0..20000 {
        seed = seed.wrapping_mul(1664525).wrapping_add(1013904223);
        let value = (seed % 300) as i32;
        let insert = seed >> 15 & 1 == 1;
        let changed = if insert {
            expected.insert(value)
        } else {
            expected.remove(&value)
        };
        assert_eq!(
            if insert {
                tree.insert(value)
            } else {
                tree.delete(&value)
            },
            changed
        );
        assert_eq!(tree.values(), expected.iter().copied().collect::<Vec<_>>());
        assert!(tree.valid());
    }
}
#[test]
fn trees() {
    exercise(&mut AVLTree::new(i32::cmp));
    exercise(&mut RedBlackTree::new(i32::cmp));
    exercise(&mut BinarySearchTree::new(i32::cmp));
    for degree in 2..9 {
        exercise(&mut BTree::new(degree, i32::cmp));
    }
}
#[test]
fn ranges() {
    let mut values = vec![0.0; 64];
    let mut fenwick = FenwickTree::new(&values);
    let mut segment = sum_segment_tree(&values);
    let mut lazy = LazySegmentTree::new(&values);
    let mut sqrt = SqrtDecomposition::new(&values);
    let mut seed = 913u32;
    for _ in 0..2000 {
        seed = seed.wrapping_mul(1664525).wrapping_add(1013904223);
        let index = seed as usize % 64;
        let value = (seed % 1000) as f64;
        values[index] = value;
        fenwick.set(index, value);
        segment.update(index, value);
        lazy.set(index, value);
        sqrt.update(index, value);
        let left = (seed >> 10) as usize % 64;
        let right = left + (seed >> 17) as usize % (64 - left);
        let sum: f64 = values[left..=right].iter().sum();
        assert_eq!(fenwick.range_sum(left, right), sum);
        assert_eq!(segment.query(left, right), sum);
        assert_eq!(lazy.range_sum(left, right), sum);
        assert_eq!(sqrt.range_sum(left, right), sum);
    }
    lazy.range_add(4, 19, 3.0);
    for value in &mut values[4..=19] {
        *value += 3.0;
    }
    assert_eq!(lazy.range_sum(0, 63), values.iter().sum::<f64>());
}
#[test]
fn hashing() {
    let mut chained = HashTable::new(|_| 1, 2, 0.75);
    let mut open = OpenAddressingHashMap::new(|_| 1, 2);
    for i in 0..1000 {
        chained.set(i, i * 3);
        open.set(i, i * 3);
    }
    for i in (0..1000).step_by(2) {
        assert!(chained.delete(&i));
        assert!(open.delete(&i));
    }
    for i in 1000..1500 {
        chained.set(i, i * 3);
        open.set(i, i * 3);
    }
    for i in 0..1500 {
        let expected = if i < 1000 && i % 2 == 0 {
            None
        } else {
            Some(i * 3)
        };
        assert_eq!(chained.get(&i).copied(), expected);
        assert_eq!(open.get(&i).copied(), expected);
    }
    assert_eq!(default_hasher(&"x"), default_hasher(&"x".to_owned()));
    let mut lru = LRUCache::new(2);
    lru.set(1, 3).set(2, 4);
    assert_eq!(lru.get(&1), Some(&3));
    lru.set(3, 5);
    assert!(!lru.has(&2));
    assert_eq!(lru.keys(), vec![3, 1]);
    for _ in 0..10000 {
        lru.get(&1);
    }
    assert_eq!(lru.keys(), vec![1, 3]);
}
#[test]
fn lists() {
    let mut linked = LinkedList::from([1, 2, 3]);
    linked.insert_at(1, 4);
    assert_eq!(linked.remove_at(2), Some(2));
    linked.reverse();
    assert_eq!(linked.to_array(), vec![3, 4, 1]);
    let mut doubly = DoublyLinkedList::new();
    let old = doubly.push_back(1);
    assert_eq!(doubly.unlink(old), Some(1));
    doubly.push_back(2);
    assert_eq!(doubly.unlink(old), None);
    assert_eq!(doubly.to_array(), vec![2]);
    let mut skip = SkipList::new(i32::cmp, 32, 0.5);
    for i in (0..1000).rev() {
        assert!(skip.insert(i));
    }
    for i in (0..1000).step_by(2) {
        assert!(skip.delete(&i));
    }
    assert_eq!(
        skip.to_array(),
        (0..1000).filter(|i| i % 2 == 1).collect::<Vec<_>>()
    );
}
