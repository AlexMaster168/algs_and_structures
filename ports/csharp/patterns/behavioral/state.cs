namespace Patterns.Behavioral;

public abstract class OrderState
{
    public abstract string Name { get; }
    public virtual void Pay(Order order) => throw new InvalidOperationException("Cannot pay in " + Name);
    public virtual void Ship(Order order) => throw new InvalidOperationException("Cannot ship in " + Name);
    public virtual void Deliver(Order order) => throw new InvalidOperationException("Cannot deliver in " + Name);
    public virtual void Cancel(Order order) => throw new InvalidOperationException("Cannot cancel in " + Name);
}
internal sealed class NewState : OrderState
{
    public override string Name => "new";
    public override void Pay(Order order) => order.TransitionTo(new PaidState());
    public override void Cancel(Order order) => order.TransitionTo(new CancelledState());
}
internal sealed class PaidState : OrderState
{
    public override string Name => "paid";
    public override void Ship(Order order) => order.TransitionTo(new ShippedState());
    public override void Cancel(Order order) => order.TransitionTo(new CancelledState());
}
internal sealed class ShippedState : OrderState
{
    public override string Name => "shipped";
    public override void Deliver(Order order) => order.TransitionTo(new DeliveredState());
}
internal sealed class DeliveredState : OrderState { public override string Name => "delivered"; }
internal sealed class CancelledState : OrderState { public override string Name => "cancelled"; }
public sealed class Order
{
    private OrderState state = new NewState();
    public string Status => state.Name;
    public List<string> History { get; } = ["new"];
    public void TransitionTo(OrderState value) { state = value; History.Add(value.Name); }
    public void Pay() => state.Pay(this);
    public void Ship() => state.Ship(this);
    public void Deliver() => state.Deliver(this);
    public void Cancel() => state.Cancel(this);
}
