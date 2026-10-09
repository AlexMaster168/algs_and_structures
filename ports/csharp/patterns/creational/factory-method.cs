namespace Patterns.Creational;

public interface ITransport { string Kind { get; } string Deliver(string cargo); }
public sealed class Truck : ITransport
{
    public string Kind => "truck";
    public string Deliver(string cargo) => $"Truck delivers {cargo} by road";
}
public sealed class Ship : ITransport
{
    public string Kind => "ship";
    public string Deliver(string cargo) => $"Ship delivers {cargo} by sea";
}
public abstract class Logistics
{
    protected abstract ITransport CreateTransport();
    public string PlanDelivery(string cargo) => CreateTransport().Deliver(cargo);
}
public sealed class RoadLogistics : Logistics { protected override ITransport CreateTransport() => new Truck(); }
public sealed class SeaLogistics : Logistics { protected override ITransport CreateTransport() => new Ship(); }
public static class TransportFactory
{
    public static ITransport CreateTransport(string kind) => kind switch
    {
        "truck" => new Truck(), "ship" => new Ship(), _ => throw new ArgumentException("Unknown transport", nameof(kind))
    };
}
