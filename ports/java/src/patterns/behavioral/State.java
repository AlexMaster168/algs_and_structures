package patterns.behavioral;

public final class State {
    public interface OrderState {
        String name();
        default void pay(Order o){throw new IllegalStateException("Cannot pay in "+name());}
        default void ship(Order o){throw new IllegalStateException("Cannot ship in "+name());}
        default void deliver(Order o){throw new IllegalStateException("Cannot deliver in "+name());}
        default void cancel(Order o){throw new IllegalStateException("Cannot cancel in "+name());}
    }
    public static class NewState implements OrderState {public String name(){return "new";}public void pay(Order o){o.transitionTo(new PaidState());}public void cancel(Order o){o.transitionTo(new CancelledState());}}
    public static class PaidState implements OrderState {public String name(){return "paid";}public void ship(Order o){o.transitionTo(new ShippedState());}public void cancel(Order o){o.transitionTo(new CancelledState());}}
    public static class ShippedState implements OrderState {public String name(){return "shipped";}public void deliver(Order o){o.transitionTo(new DeliveredState());}}
    public static class DeliveredState implements OrderState {public String name(){return "delivered";}}
    public static class CancelledState implements OrderState {public String name(){return "cancelled";}}
    public static class Order {
        private OrderState state=new NewState();public final java.util.List<String> history=new java.util.ArrayList<>(java.util.List.of("new"));
        public String status(){return state.name();}public void transitionTo(OrderState state){this.state=state;history.add(state.name());}
        public void pay(){state.pay(this);}public void ship(){state.ship(this);}public void deliver(){state.deliver(this);}public void cancel(){state.cancel(this);}
    }
}
