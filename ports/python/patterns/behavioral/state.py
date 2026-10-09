class _BaseState:
    def pay(self, order):
        raise RuntimeError(f'Cannot pay in {self.name}')

    def ship(self, order):
        raise RuntimeError(f'Cannot ship in {self.name}')

    def deliver(self, order):
        raise RuntimeError(f'Cannot deliver in {self.name}')

    def cancel(self, order):
        raise RuntimeError(f'Cannot cancel in {self.name}')


class _NewState(_BaseState):
    name = 'new'

    def pay(self, order):
        order.transition_to(_PaidState())

    def cancel(self, order):
        order.transition_to(_CancelledState())


class _PaidState(_BaseState):
    name = 'paid'

    def ship(self, order):
        order.transition_to(_ShippedState())

    def cancel(self, order):
        order.transition_to(_CancelledState())


class _ShippedState(_BaseState):
    name = 'shipped'

    def deliver(self, order):
        order.transition_to(_DeliveredState())


class _DeliveredState(_BaseState):
    name = 'delivered'


class _CancelledState(_BaseState):
    name = 'cancelled'


class Order:
    def __init__(self):
        self.state, self.history = _NewState(), ['new']

    @property
    def status(self):
        return self.state.name

    def transition_to(self, state):
        self.state = state
        self.history.append(state.name)

    def pay(self):
        self.state.pay(self)

    def ship(self):
        self.state.ship(self)

    def deliver(self):
        self.state.deliver(self)

    def cancel(self):
        self.state.cancel(self)
