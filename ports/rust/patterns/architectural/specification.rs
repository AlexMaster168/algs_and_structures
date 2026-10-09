use std::rc::Rc;
pub trait Specification<T> {
    fn is_satisfied_by(&self, candidate: &T) -> bool;
}
pub struct Spec<T> {
    predicate: Rc<dyn Fn(&T) -> bool>,
}
impl<T> Clone for Spec<T> {
    fn clone(&self) -> Self {
        Self {
            predicate: self.predicate.clone(),
        }
    }
}
impl<T: 'static> Spec<T> {
    pub fn new(predicate: impl Fn(&T) -> bool + 'static) -> Self {
        Self {
            predicate: Rc::new(predicate),
        }
    }
    pub fn and(&self, other: Self) -> Self {
        let first = self.clone();
        Self::new(move |value| first.is_satisfied_by(value) && other.is_satisfied_by(value))
    }
    pub fn or(&self, other: Self) -> Self {
        let first = self.clone();
        Self::new(move |value| first.is_satisfied_by(value) || other.is_satisfied_by(value))
    }
    pub fn not(&self) -> Self {
        let first = self.clone();
        Self::new(move |value| !first.is_satisfied_by(value))
    }
}
impl<T> Specification<T> for Spec<T> {
    fn is_satisfied_by(&self, candidate: &T) -> bool {
        (self.predicate)(candidate)
    }
}
pub fn spec<T: 'static>(predicate: impl Fn(&T) -> bool + 'static) -> Spec<T> {
    Spec::new(predicate)
}
