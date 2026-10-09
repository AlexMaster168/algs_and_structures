use std::cmp::Ordering;

pub type Comparator<T> = fn(&T, &T) -> Ordering;

pub fn default_compare<T: Ord>(a: &T, b: &T) -> Ordering {
    a.cmp(b)
}

pub fn reverse_compare<T>(compare: Comparator<T>) -> impl Fn(&T, &T) -> Ordering {
    move |a, b| compare(b, a)
}
