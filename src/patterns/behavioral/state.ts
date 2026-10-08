export interface OrderState {
  readonly name: string;
  pay(order: Order): void;
  ship(order: Order): void;
  deliver(order: Order): void;
  cancel(order: Order): void;
}

abstract class BaseState implements OrderState {
  abstract readonly name: string;

  pay(_order: Order): void {
    this.reject('pay');
  }

  ship(_order: Order): void {
    this.reject('ship');
  }

  deliver(_order: Order): void {
    this.reject('deliver');
  }

  cancel(_order: Order): void {
    this.reject('cancel');
  }

  private reject(action: string): never {
    throw new Error(`Cannot ${action} an order in state "${this.name}"`);
  }
}

class NewState extends BaseState {
  readonly name = 'new';

  override pay(order: Order): void {
    order.transitionTo(new PaidState());
  }

  override cancel(order: Order): void {
    order.transitionTo(new CancelledState());
  }
}

class PaidState extends BaseState {
  readonly name = 'paid';

  override ship(order: Order): void {
    order.transitionTo(new ShippedState());
  }

  override cancel(order: Order): void {
    order.transitionTo(new CancelledState());
  }
}

class ShippedState extends BaseState {
  readonly name = 'shipped';

  override deliver(order: Order): void {
    order.transitionTo(new DeliveredState());
  }
}

class DeliveredState extends BaseState {
  readonly name = 'delivered';
}

class CancelledState extends BaseState {
  readonly name = 'cancelled';
}

export class Order {
  private state: OrderState = new NewState();
  readonly history: string[] = ['new'];

  get status(): string {
    return this.state.name;
  }

  transitionTo(state: OrderState): void {
    this.state = state;
    this.history.push(state.name);
  }

  pay(): void {
    this.state.pay(this);
  }

  ship(): void {
    this.state.ship(this);
  }

  deliver(): void {
    this.state.deliver(this);
  }

  cancel(): void {
    this.state.cancel(this);
  }
}
