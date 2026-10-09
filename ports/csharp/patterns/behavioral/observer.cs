namespace Patterns.Behavioral;

public class Subject<T>
{
    private readonly HashSet<Action<T>> observers = [];
    public int ObserverCount => observers.Count;
    public virtual Action Subscribe(Action<T> observer) { observers.Add(observer); return () => observers.Remove(observer); }
    public virtual void Notify(T value) { foreach (var observer in observers.ToArray()) observer(value); }
}
public sealed record PriceChange(string Symbol, double Price, double Change);
public sealed class StockTicker
{
    private readonly Dictionary<string, double> prices = [];
    public Subject<PriceChange> Changes { get; } = new();
    public void Update(string symbol, double price) { var previous = prices.GetValueOrDefault(symbol, price); prices[symbol] = price; Changes.Notify(new(symbol, price, price - previous)); }
}
public sealed class BehaviorSubject<T>(T current) : Subject<T>
{
    public T Value { get; private set; } = current;
    public override Action Subscribe(Action<T> observer) { observer(Value); return base.Subscribe(observer); }
    public override void Notify(T value) { Value = value; base.Notify(value); }
}
