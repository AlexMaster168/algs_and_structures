namespace Patterns.Structural;

public interface ITemperatureSensor { double Celsius(); }
public sealed class LegacyFahrenheitSensor(double reading) { public double ReadFahrenheit() => reading; }
public sealed class FahrenheitSensorAdapter(LegacyFahrenheitSensor legacy) : ITemperatureSensor
{
    public double Celsius() => Math.Floor((legacy.ReadFahrenheit() - 32) * 5 / 9 * 10 + 0.5) / 10;
}
public static class Adapter
{
    public static double AverageTemperature(IReadOnlyList<ITemperatureSensor> sensors) => sensors.Sum(s => s.Celsius()) / sensors.Count;
    public static Func<A, Task<T>> Promisify<A, T>(Action<A, Action<Exception?, T>> action) => argument =>
    {
        var completion = new TaskCompletionSource<T>(TaskCreationOptions.RunContinuationsAsynchronously);
        try { action(argument, (error, value) => { if (error is null) completion.TrySetResult(value); else completion.TrySetException(error); }); }
        catch (Exception error) { completion.TrySetException(error); }
        return completion.Task;
    };
}
