use std::{
    cell::{Cell, RefCell},
    future::Future,
    pin::Pin,
    rc::Rc,
};
pub type MiddlewareFuture = Pin<Box<dyn Future<Output = Result<(), String>>>>;
pub type Next = Rc<dyn Fn() -> MiddlewareFuture>;
pub type Middleware<C> = Rc<dyn Fn(Rc<RefCell<C>>, Next) -> MiddlewareFuture>;
struct State<C> {
    context: Rc<RefCell<C>>,
    middlewares: Vec<Middleware<C>>,
    last: Cell<isize>,
}
fn dispatch<C: 'static>(state: Rc<State<C>>, index: usize) -> MiddlewareFuture {
    Box::pin(async move {
        if index as isize <= state.last.get() {
            return Err("next() called multiple times".into());
        }
        state.last.set(index as isize);
        if let Some(middleware) = state.middlewares.get(index).cloned() {
            let next_state = state.clone();
            let next: Next = Rc::new(move || dispatch(next_state.clone(), index + 1));
            middleware(state.context.clone(), next).await
        } else {
            Ok(())
        }
    })
}
pub fn compose<C: 'static>(
    middlewares: Vec<Middleware<C>>,
) -> impl Fn(Rc<RefCell<C>>) -> MiddlewareFuture {
    move |context| {
        dispatch(
            Rc::new(State {
                context,
                middlewares: middlewares.clone(),
                last: Cell::new(-1),
            }),
            0,
        )
    }
}
pub struct Pipeline<C> {
    middlewares: Vec<Middleware<C>>,
}
impl<C> Default for Pipeline<C> {
    fn default() -> Self {
        Self {
            middlewares: Vec::new(),
        }
    }
}
impl<C: 'static> Pipeline<C> {
    pub fn new() -> Self {
        Self::default()
    }
    pub fn use_middleware(&mut self, middleware: Middleware<C>) -> &mut Self {
        self.middlewares.push(middleware);
        self
    }
    pub fn run(&self, context: Rc<RefCell<C>>) -> MiddlewareFuture {
        compose(self.middlewares.clone())(context)
    }
}
