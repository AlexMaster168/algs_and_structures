use crate::patterns::behavioral::observer::Observer;
use std::{cell::RefCell, collections::HashMap, rc::Rc};
struct Entry<T> {
    listener: Observer<T>,
    once: bool,
    id: u64,
}
impl<T> Clone for Entry<T> {
    fn clone(&self) -> Self {
        Self {
            listener: self.listener.clone(),
            once: self.once,
            id: self.id,
        }
    }
}
struct State<T> {
    listeners: HashMap<String, Vec<Entry<T>>>,
    counter: u64,
}
pub struct TypedEventEmitter<T> {
    state: Rc<RefCell<State<T>>>,
}
impl<T> Default for TypedEventEmitter<T> {
    fn default() -> Self {
        Self {
            state: Rc::new(RefCell::new(State {
                listeners: HashMap::new(),
                counter: 0,
            })),
        }
    }
}
impl<T: 'static> TypedEventEmitter<T> {
    pub fn new() -> Self {
        Self::default()
    }
    fn add(&self, event: String, listener: Observer<T>, once: bool) -> Box<dyn Fn()> {
        let mut state = self.state.borrow_mut();
        let existing = if once {
            None
        } else {
            state.listeners.get(&event).and_then(|list| {
                list.iter()
                    .find(|entry| !entry.once && Rc::ptr_eq(&entry.listener, &listener))
                    .map(|entry| entry.id)
            })
        };
        let id = if let Some(id) = existing {
            id
        } else {
            state.counter += 1;
            let id = state.counter;
            state
                .listeners
                .entry(event.clone())
                .or_default()
                .push(Entry { listener, once, id });
            id
        };
        drop(state);
        let weak = Rc::downgrade(&self.state);
        Box::new(move || {
            if let Some(state) = weak.upgrade() {
                if let Some(list) = state.borrow_mut().listeners.get_mut(&event) {
                    list.retain(|entry| entry.id != id);
                }
            }
        })
    }
    pub fn on(&self, event: String, listener: Observer<T>) -> Box<dyn Fn()> {
        self.add(event, listener, false)
    }
    pub fn once(&self, event: String, listener: Observer<T>) -> Box<dyn Fn()> {
        self.add(event, listener, true)
    }
    pub fn off(&self, event: &str, listener: &Observer<T>) {
        if let Some(list) = self.state.borrow_mut().listeners.get_mut(event) {
            list.retain(|entry| entry.once || !Rc::ptr_eq(&entry.listener, listener));
        }
    }
    pub fn emit(&self, event: &str, payload: &T) -> usize {
        let snapshot = self
            .state
            .borrow()
            .listeners
            .get(event)
            .cloned()
            .unwrap_or_default();
        for entry in snapshot {
            if entry.once {
                if let Some(list) = self.state.borrow_mut().listeners.get_mut(event) {
                    list.retain(|item| item.id != entry.id);
                }
            }
            (entry.listener)(payload);
        }
        self.listener_count(event)
    }
    pub fn listener_count(&self, event: &str) -> usize {
        self.state.borrow().listeners.get(event).map_or(0, Vec::len)
    }
}
