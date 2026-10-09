use std::{
    any::Any,
    cell::RefCell,
    collections::{HashMap, HashSet},
    marker::PhantomData,
    rc::Rc,
};
pub struct Token<T> {
    key: u64,
    pub description: String,
    marker: PhantomData<fn() -> T>,
}
impl<T> Clone for Token<T> {
    fn clone(&self) -> Self {
        Self {
            key: self.key,
            description: self.description.clone(),
            marker: PhantomData,
        }
    }
}
pub fn token<T>(description: String) -> Token<T> {
    static NEXT: std::sync::atomic::AtomicU64 = std::sync::atomic::AtomicU64::new(1);
    Token {
        key: NEXT.fetch_add(1, std::sync::atomic::Ordering::Relaxed),
        description,
        marker: PhantomData,
    }
}
struct Registration {
    factory: Rc<dyn Fn(&Container) -> Result<Rc<dyn Any>, String>>,
    singleton: bool,
    instance: Option<Rc<dyn Any>>,
}
#[derive(Default)]
pub struct Container {
    registrations: RefCell<HashMap<u64, Rc<RefCell<Registration>>>>,
    resolving: RefCell<HashSet<u64>>,
}
impl Container {
    pub fn new() -> Self {
        Self::default()
    }
    pub fn register<T: 'static>(
        &self,
        target: &Token<T>,
        factory: impl Fn(&Container) -> Result<T, String> + 'static,
        singleton: bool,
    ) -> &Self {
        self.registrations.borrow_mut().insert(
            target.key,
            Rc::new(RefCell::new(Registration {
                factory: Rc::new(move |container| {
                    factory(container).map(|value| Rc::new(value) as Rc<dyn Any>)
                }),
                singleton,
                instance: None,
            })),
        );
        self
    }
    pub fn value<T: Clone + 'static>(&self, target: &Token<T>, value: T) -> &Self {
        let instance = Rc::new(value.clone());
        self.registrations.borrow_mut().insert(
            target.key,
            Rc::new(RefCell::new(Registration {
                factory: Rc::new(move |_| Ok(Rc::new(value.clone()))),
                singleton: true,
                instance: Some(instance),
            })),
        );
        self
    }
    pub fn resolve<T: Clone + 'static>(&self, target: &Token<T>) -> Result<T, String> {
        let registration = self
            .registrations
            .borrow()
            .get(&target.key)
            .cloned()
            .ok_or_else(|| format!("No provider for {}", target.description))?;
        let record = registration.borrow();
        if record.singleton {
            if let Some(instance) = &record.instance {
                return instance
                    .downcast_ref::<T>()
                    .cloned()
                    .ok_or("Provider type mismatch".into());
            }
        }
        let factory = record.factory.clone();
        let singleton = record.singleton;
        drop(record);
        if !self.resolving.borrow_mut().insert(target.key) {
            return Err(format!("Circular dependency on {}", target.description));
        }
        struct Guard<'a> {
            resolving: &'a RefCell<HashSet<u64>>,
            key: u64,
        }
        impl Drop for Guard<'_> {
            fn drop(&mut self) {
                self.resolving.borrow_mut().remove(&self.key);
            }
        }
        let _guard = Guard {
            resolving: &self.resolving,
            key: target.key,
        };
        let instance = factory(self)?;
        let value = instance
            .downcast_ref::<T>()
            .cloned()
            .ok_or("Provider type mismatch")?;
        if singleton {
            registration.borrow_mut().instance = Some(instance);
        }
        Ok(value)
    }
}
