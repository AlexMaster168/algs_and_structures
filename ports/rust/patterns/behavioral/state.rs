pub trait OrderState {
    fn name(&self) -> &str;
    fn pay(&self, _: &mut Order) -> Result<(), String> {
        Err(format!("Cannot pay an order in state {}", self.name()))
    }
    fn ship(&self, _: &mut Order) -> Result<(), String> {
        Err(format!("Cannot ship an order in state {}", self.name()))
    }
    fn deliver(&self, _: &mut Order) -> Result<(), String> {
        Err(format!("Cannot deliver an order in state {}", self.name()))
    }
    fn cancel(&self, _: &mut Order) -> Result<(), String> {
        Err(format!("Cannot cancel an order in state {}", self.name()))
    }
}
struct NewState;
struct PaidState;
struct ShippedState;
struct DeliveredState;
struct CancelledState;
impl OrderState for NewState {
    fn name(&self) -> &str {
        "new"
    }
    fn pay(&self, order: &mut Order) -> Result<(), String> {
        order.transition_to(Box::new(PaidState));
        Ok(())
    }
    fn cancel(&self, order: &mut Order) -> Result<(), String> {
        order.transition_to(Box::new(CancelledState));
        Ok(())
    }
}
impl OrderState for PaidState {
    fn name(&self) -> &str {
        "paid"
    }
    fn ship(&self, order: &mut Order) -> Result<(), String> {
        order.transition_to(Box::new(ShippedState));
        Ok(())
    }
    fn cancel(&self, order: &mut Order) -> Result<(), String> {
        order.transition_to(Box::new(CancelledState));
        Ok(())
    }
}
impl OrderState for ShippedState {
    fn name(&self) -> &str {
        "shipped"
    }
    fn deliver(&self, order: &mut Order) -> Result<(), String> {
        order.transition_to(Box::new(DeliveredState));
        Ok(())
    }
}
impl OrderState for DeliveredState {
    fn name(&self) -> &str {
        "delivered"
    }
}
impl OrderState for CancelledState {
    fn name(&self) -> &str {
        "cancelled"
    }
}
pub struct Order {
    state: Option<Box<dyn OrderState>>,
    pub history: Vec<String>,
}
impl Default for Order {
    fn default() -> Self {
        Self {
            state: Some(Box::new(NewState)),
            history: vec!["new".into()],
        }
    }
}
impl Order {
    pub fn new() -> Self {
        Self::default()
    }
    pub fn status(&self) -> &str {
        self.state.as_ref().unwrap().name()
    }
    pub fn transition_to(&mut self, state: Box<dyn OrderState>) {
        self.history.push(state.name().to_owned());
        self.state = Some(state);
    }
    fn invoke(
        &mut self,
        action: fn(&dyn OrderState, &mut Self) -> Result<(), String>,
    ) -> Result<(), String> {
        let state = self.state.take().unwrap();
        let result = action(state.as_ref(), self);
        if self.state.is_none() {
            self.state = Some(state);
        }
        result
    }
    pub fn pay(&mut self) -> Result<(), String> {
        self.invoke(|state, order| state.pay(order))
    }
    pub fn ship(&mut self) -> Result<(), String> {
        self.invoke(|state, order| state.ship(order))
    }
    pub fn deliver(&mut self) -> Result<(), String> {
        self.invoke(|state, order| state.deliver(order))
    }
    pub fn cancel(&mut self) -> Result<(), String> {
        self.invoke(|state, order| state.cancel(order))
    }
}
