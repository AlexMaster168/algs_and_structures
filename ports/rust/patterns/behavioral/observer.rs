use std::cell::RefCell;
use std::rc::Rc;
pub type Observer<T> = Rc<dyn Fn(&T)>;
pub struct Subject<T> {
    observers: Rc<RefCell<Vec<Observer<T>>>>,
}
impl<T> Default for Subject<T> {
    fn default() -> Self {
        Self {
            observers: Rc::new(RefCell::new(Vec::new())),
        }
    }
}
impl<T: 'static> Subject<T> {
    pub fn new() -> Self {
        Self::default()
    }
    pub fn observer_count(&self) -> usize {
        self.observers.borrow().len()
    }
    pub fn subscribe(&self, observer: Observer<T>) -> Box<dyn Fn()> {
        if !self
            .observers
            .borrow()
            .iter()
            .any(|item| Rc::ptr_eq(item, &observer))
        {
            self.observers.borrow_mut().push(observer.clone());
        }
        let weak = Rc::downgrade(&self.observers);
        Box::new(move || {
            if let Some(observers) = weak.upgrade() {
                observers
                    .borrow_mut()
                    .retain(|item| !Rc::ptr_eq(item, &observer));
            }
        })
    }
    pub fn notify(&self, value: &T) {
        let snapshot = self.observers.borrow().clone();
        for observer in snapshot {
            observer(value);
        }
    }
}
pub struct PriceChange {
    pub symbol: String,
    pub price: f64,
    pub change: f64,
}
#[derive(Default)]
pub struct StockTicker {
    pub changes: Subject<PriceChange>,
    prices: std::collections::HashMap<String, f64>,
}
impl StockTicker {
    pub fn new() -> Self {
        Self::default()
    }
    pub fn update(&mut self, symbol: String, price: f64) {
        let previous = self.prices.insert(symbol.clone(), price).unwrap_or(price);
        self.changes.notify(&PriceChange {
            symbol,
            price,
            change: price - previous,
        });
    }
}
pub struct BehaviorSubject<T> {
    subject: Subject<T>,
    current: RefCell<T>,
}
impl<T: Clone + 'static> BehaviorSubject<T> {
    pub fn new(current: T) -> Self {
        Self {
            subject: Subject::new(),
            current: RefCell::new(current),
        }
    }
    pub fn value(&self) -> T {
        self.current.borrow().clone()
    }
    pub fn observer_count(&self) -> usize {
        self.subject.observer_count()
    }
    pub fn subscribe(&self, observer: Observer<T>) -> Box<dyn Fn()> {
        let value = self.value();
        observer(&value);
        self.subject.subscribe(observer)
    }
    pub fn notify(&self, value: &T) {
        *self.current.borrow_mut() = value.clone();
        self.subject.notify(value);
    }
}
