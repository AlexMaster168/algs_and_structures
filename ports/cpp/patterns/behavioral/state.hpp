#pragma once
#include "../../support.hpp"
namespace algs {
class Order;
struct OrderState { virtual ~OrderState() = default; virtual std::string name() const = 0; virtual void pay(Order&) const; virtual void ship(Order&) const; virtual void deliver(Order&) const; virtual void cancel(Order&) const; protected: [[noreturn]] void reject(const std::string& action) const { throw std::logic_error("Cannot " + action + " an order in state " + name()); } };
struct NewState : OrderState { std::string name() const override { return "new"; } void pay(Order&) const override; void cancel(Order&) const override; };
struct PaidState : OrderState { std::string name() const override { return "paid"; } void ship(Order&) const override; void cancel(Order&) const override; };
struct ShippedState : OrderState { std::string name() const override { return "shipped"; } void deliver(Order&) const override; };
struct DeliveredState : OrderState { std::string name() const override { return "delivered"; } }; struct CancelledState : OrderState { std::string name() const override { return "cancelled"; } };
class Order { std::shared_ptr<OrderState> state = std::make_shared<NewState>(); public: std::vector<std::string> history{"new"}; std::string status() const { return state->name(); } void transitionTo(std::shared_ptr<OrderState> next) { state = std::move(next); history.push_back(state->name()); } void pay() { auto current = state; current->pay(*this); } void ship() { auto current = state; current->ship(*this); } void deliver() { auto current = state; current->deliver(*this); } void cancel() { auto current = state; current->cancel(*this); } };
inline void OrderState::pay(Order&) const { reject("pay"); } inline void OrderState::ship(Order&) const { reject("ship"); } inline void OrderState::deliver(Order&) const { reject("deliver"); } inline void OrderState::cancel(Order&) const { reject("cancel"); }
inline void NewState::pay(Order& order) const { order.transitionTo(std::make_shared<PaidState>()); } inline void NewState::cancel(Order& order) const { order.transitionTo(std::make_shared<CancelledState>()); } inline void PaidState::ship(Order& order) const { order.transitionTo(std::make_shared<ShippedState>()); } inline void PaidState::cancel(Order& order) const { order.transitionTo(std::make_shared<CancelledState>()); } inline void ShippedState::deliver(Order& order) const { order.transitionTo(std::make_shared<DeliveredState>()); }
}
