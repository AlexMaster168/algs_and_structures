class BaseState {
    pay(_order) {
        this.reject('pay');
    }
    ship(_order) {
        this.reject('ship');
    }
    deliver(_order) {
        this.reject('deliver');
    }
    cancel(_order) {
        this.reject('cancel');
    }
    reject(action) {
        throw new Error(`Cannot ${action} an order in state "${this.name}"`);
    }
}
class NewState extends BaseState {
    name = 'new';
    pay(order) {
        order.transitionTo(new PaidState());
    }
    cancel(order) {
        order.transitionTo(new CancelledState());
    }
}
class PaidState extends BaseState {
    name = 'paid';
    ship(order) {
        order.transitionTo(new ShippedState());
    }
    cancel(order) {
        order.transitionTo(new CancelledState());
    }
}
class ShippedState extends BaseState {
    name = 'shipped';
    deliver(order) {
        order.transitionTo(new DeliveredState());
    }
}
class DeliveredState extends BaseState {
    name = 'delivered';
}
class CancelledState extends BaseState {
    name = 'cancelled';
}
export class Order {
    state = new NewState();
    history = ['new'];
    get status() {
        return this.state.name;
    }
    transitionTo(state) {
        this.state = state;
        this.history.push(state.name);
    }
    pay() {
        this.state.pay(this);
    }
    ship() {
        this.state.ship(this);
    }
    deliver() {
        this.state.deliver(this);
    }
    cancel() {
        this.state.cancel(this);
    }
}
