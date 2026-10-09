use std::cell::RefCell;
use std::collections::HashMap;
use std::rc::Rc;
pub struct ObjectPool<T> {
    available: Vec<Rc<RefCell<T>>>,
    in_use: HashMap<usize, Rc<RefCell<T>>>,
    create: Box<dyn FnMut() -> T>,
    reset: Box<dyn FnMut(&mut T)>,
    max_size: usize,
}
impl<T> ObjectPool<T> {
    pub fn new(
        create: impl FnMut() -> T + 'static,
        reset: impl FnMut(&mut T) + 'static,
        max_size: usize,
    ) -> Self {
        Self {
            available: Vec::new(),
            in_use: HashMap::new(),
            create: Box::new(create),
            reset: Box::new(reset),
            max_size,
        }
    }
    pub fn available_count(&self) -> usize {
        self.available.len()
    }
    pub fn in_use_count(&self) -> usize {
        self.in_use.len()
    }
    pub fn acquire(&mut self) -> Result<Rc<RefCell<T>>, String> {
        let item = if let Some(item) = self.available.pop() {
            item
        } else {
            if self.in_use.len() >= self.max_size {
                return Err("Pool is exhausted".into());
            }
            Rc::new(RefCell::new((self.create)()))
        };
        self.in_use.insert(Rc::as_ptr(&item) as usize, item.clone());
        Ok(item)
    }
    pub fn release(&mut self, item: Rc<RefCell<T>>) -> Result<(), String> {
        if self.in_use.remove(&(Rc::as_ptr(&item) as usize)).is_none() {
            return Err("Item does not belong to this pool".into());
        }
        (self.reset)(&mut item.borrow_mut());
        self.available.push(item);
        Ok(())
    }
    pub fn use_item<R>(&mut self, work: impl FnOnce(&mut T) -> R) -> Result<R, String> {
        let item = self.acquire()?;
        let result = std::panic::catch_unwind(std::panic::AssertUnwindSafe(|| {
            work(&mut item.borrow_mut())
        }));
        self.release(item)?;
        match result {
            Ok(value) => Ok(value),
            Err(error) => std::panic::resume_unwind(error),
        }
    }
}
