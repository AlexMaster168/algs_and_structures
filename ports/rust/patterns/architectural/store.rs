use serde_json::Value;
use std::{
    cell::{Cell, RefCell},
    collections::HashMap,
    rc::Rc,
};
pub struct Store<S, A> {
    state: RefCell<S>,
    reducer: Box<dyn Fn(&S, &A) -> S>,
    listeners: Rc<RefCell<Vec<Rc<dyn Fn()>>>>,
    dispatching: Cell<bool>,
}
impl<S: Clone, A: Clone> Store<S, A> {
    pub fn get_state(&self) -> S {
        self.state.borrow().clone()
    }
    pub fn dispatch(&self, action: A) -> A {
        assert!(
            !self.dispatching.replace(true),
            "Reducers may not dispatch actions"
        );
        struct Guard<'a>(&'a Cell<bool>);
        impl Drop for Guard<'_> {
            fn drop(&mut self) {
                self.0.set(false);
            }
        }
        let guard = Guard(&self.dispatching);
        let next = (self.reducer)(&self.state.borrow(), &action);
        *self.state.borrow_mut() = next;
        drop(guard);
        let snapshot = self.listeners.borrow().clone();
        for listener in snapshot {
            listener();
        }
        action
    }
    pub fn subscribe(&self, listener: Rc<dyn Fn()>) -> Box<dyn Fn()> {
        if !self
            .listeners
            .borrow()
            .iter()
            .any(|item| Rc::ptr_eq(item, &listener))
        {
            self.listeners.borrow_mut().push(listener.clone());
        }
        let weak = Rc::downgrade(&self.listeners);
        Box::new(move || {
            if let Some(listeners) = weak.upgrade() {
                listeners
                    .borrow_mut()
                    .retain(|item| !Rc::ptr_eq(item, &listener));
            }
        })
    }
}
pub fn create_store<S: Clone, A: Clone>(
    reducer: impl Fn(&S, &A) -> S + 'static,
    initial_state: S,
) -> Store<S, A> {
    Store {
        state: RefCell::new(initial_state),
        reducer: Box::new(reducer),
        listeners: Rc::new(RefCell::new(Vec::new())),
        dispatching: Cell::new(false),
    }
}
pub type JsonReducer<A> = Rc<dyn Fn(&Value, &A) -> Value>;
pub fn combine_reducers<A>(
    reducers: HashMap<String, JsonReducer<A>>,
) -> impl Fn(&HashMap<String, Value>, &A) -> HashMap<String, Value> {
    move |state, action| {
        let mut next = state.clone();
        let mut changed = false;
        for (key, reducer) in &reducers {
            let value = reducer(&state[key], action);
            changed |= value != state[key];
            next.insert(key.clone(), value);
        }
        if changed {
            next
        } else {
            state.clone()
        }
    }
}
#[derive(Clone)]
pub enum CounterAction {
    Increment,
    Decrement,
    Add(f64),
}
pub fn counter_reducer(state: &f64, action: &CounterAction) -> f64 {
    match action {
        CounterAction::Increment => state + 1.0,
        CounterAction::Decrement => state - 1.0,
        CounterAction::Add(amount) => state + amount,
    }
}
