namespace Patterns.Behavioral;

public sealed record Parcel(double WeightKg, double OrderTotal);
public interface IShippingStrategy { string Name { get; } double Cost(Parcel parcel); }
public sealed class FlatRateShipping(double rate) : IShippingStrategy { public string Name => "flat"; public double Cost(Parcel parcel) => rate; }
public sealed class WeightBasedShipping(double pricePerKg) : IShippingStrategy { public string Name => "weight"; public double Cost(Parcel parcel) => Math.Ceiling(parcel.WeightKg) * pricePerKg; }
public sealed class FreeOverThresholdShipping(double threshold, IShippingStrategy fallback) : IShippingStrategy
{
    public string Name => "free-over-threshold";
    public double Cost(Parcel parcel) => parcel.OrderTotal >= threshold ? 0 : fallback.Cost(parcel);
}
public sealed class ShippingCalculator(IShippingStrategy strategy)
{
    private IShippingStrategy strategy = strategy;
    public void SetStrategy(IShippingStrategy value) => strategy = value;
    public double Calculate(Parcel parcel) => strategy.Cost(parcel);
    public IShippingStrategy Cheapest(Parcel parcel, IReadOnlyList<IShippingStrategy> strategies)
    {
        if (strategies.Count == 0) throw new ArgumentException("No strategies");
        var best = strategies[0];
        foreach (var candidate in strategies.Skip(1)) if (candidate.Cost(parcel) < best.Cost(parcel)) best = candidate;
        return best;
    }
}
