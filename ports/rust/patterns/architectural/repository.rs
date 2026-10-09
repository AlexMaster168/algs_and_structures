use super::specification::Spec;
use super::specification::Specification;
use std::{collections::HashMap, future::Future, pin::Pin};
pub trait Entity {
    fn id(&self) -> &str;
}
pub type RepositoryFuture<'a, T> = Pin<Box<dyn Future<Output = T> + 'a>>;
pub trait Repository<T: Entity> {
    fn find_by_id<'a>(&'a self, id: &'a str) -> RepositoryFuture<'a, Option<T>>;
    fn find_all<'a>(&'a self, specification: Option<&'a Spec<T>>) -> RepositoryFuture<'a, Vec<T>>;
    fn save<'a>(&'a mut self, entity: T) -> RepositoryFuture<'a, ()>;
    fn delete<'a>(&'a mut self, id: &'a str) -> RepositoryFuture<'a, bool>;
}
pub struct InMemoryRepository<T> {
    items: HashMap<String, T>,
    order: Vec<String>,
    clone: Box<dyn Fn(&T) -> T>,
}
impl<T: Entity + Clone + 'static> Default for InMemoryRepository<T> {
    fn default() -> Self {
        Self::new(Clone::clone)
    }
}
impl<T: Entity + Clone + 'static> InMemoryRepository<T> {
    pub fn new(clone: impl Fn(&T) -> T + 'static) -> Self {
        Self {
            items: HashMap::new(),
            order: Vec::new(),
            clone: Box::new(clone),
        }
    }
}
impl<T: Entity + Clone + 'static> Repository<T> for InMemoryRepository<T> {
    fn find_by_id<'a>(&'a self, id: &'a str) -> RepositoryFuture<'a, Option<T>> {
        Box::pin(async move { self.items.get(id).map(|item| (self.clone)(item)) })
    }
    fn find_all<'a>(&'a self, specification: Option<&'a Spec<T>>) -> RepositoryFuture<'a, Vec<T>> {
        Box::pin(async move {
            self.order
                .iter()
                .filter_map(|id| {
                    let item = &self.items[id];
                    if specification.is_none_or(|spec| spec.is_satisfied_by(item)) {
                        Some((self.clone)(item))
                    } else {
                        None
                    }
                })
                .collect()
        })
    }
    fn save<'a>(&'a mut self, entity: T) -> RepositoryFuture<'a, ()> {
        Box::pin(async move {
            let id = entity.id().to_owned();
            let copy = (self.clone)(&entity);
            if !self.items.contains_key(&id) {
                self.order.push(id.clone());
            }
            self.items.insert(id, copy);
        })
    }
    fn delete<'a>(&'a mut self, id: &'a str) -> RepositoryFuture<'a, bool> {
        Box::pin(async move {
            if self.items.remove(id).is_some() {
                self.order.retain(|key| key != id);
                true
            } else {
                false
            }
        })
    }
}
