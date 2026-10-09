<?php
declare(strict_types=1);
namespace Ports\Patterns\Behavioral;

abstract class OrderState {
    abstract public function name(): string;
    public function pay(Order $order): void { throw new \LogicException('Cannot pay in ' . $this->name()); }
    public function ship(Order $order): void { throw new \LogicException('Cannot ship in ' . $this->name()); }
    public function deliver(Order $order): void { throw new \LogicException('Cannot deliver in ' . $this->name()); }
    public function cancel(Order $order): void { throw new \LogicException('Cannot cancel in ' . $this->name()); }
}
class NewState extends OrderState { public function name(): string { return 'new'; } public function pay(Order $order): void { $order->transitionTo(new PaidState()); } public function cancel(Order $order): void { $order->transitionTo(new CancelledState()); } }
class PaidState extends OrderState { public function name(): string { return 'paid'; } public function ship(Order $order): void { $order->transitionTo(new ShippedState()); } public function cancel(Order $order): void { $order->transitionTo(new CancelledState()); } }
class ShippedState extends OrderState { public function name(): string { return 'shipped'; } public function deliver(Order $order): void { $order->transitionTo(new DeliveredState()); } }
class DeliveredState extends OrderState { public function name(): string { return 'delivered'; } }
class CancelledState extends OrderState { public function name(): string { return 'cancelled'; } }
class Order {
    private OrderState $state; public array $history = ['new'];
    public function __construct() { $this->state = new NewState(); }
    public function __get(string $name): string { return $this->state->name(); }
    public function transitionTo(OrderState $state): void { $this->state = $state; $this->history[] = $state->name(); }
    public function pay(): void { $this->state->pay($this); } public function ship(): void { $this->state->ship($this); } public function deliver(): void { $this->state->deliver($this); } public function cancel(): void { $this->state->cancel($this); }
}
