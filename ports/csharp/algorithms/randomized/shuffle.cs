namespace Algorithms.Randomized;
public static class Randomized
{
    public static T[] FisherYatesShuffle<T>(IReadOnlyList<T> input, Func<double>? random = null) { random ??= Random.Shared.NextDouble; var a = input.ToArray(); for (var i = a.Length - 1; i > 0; i--) { var j = (int)Math.Floor(random() * (i + 1)); (a[i], a[j]) = (a[j], a[i]); } return a; }
    public static T[] ReservoirSample<T>(IEnumerable<T> stream, int size, Func<double>? random = null) { random ??= Random.Shared.NextDouble; var reservoir = new List<T>(); var seen = 0; foreach (var item in stream) { seen++; if (reservoir.Count < size) reservoir.Add(item); else { var j = (int)Math.Floor(random() * seen); if (j < size) reservoir[j] = item; } } return reservoir.ToArray(); }
    public static Func<double> Mulberry32(uint seed) { var state = seed; return () => { state = unchecked(state + 0x6d2b79f5u); var t = state; t = unchecked((t ^ t >> 15) * (t | 1)); t ^= unchecked(t + (t ^ t >> 7) * (t | 61)); return (t ^ t >> 14) / 4294967296d; }; }
    public static double MonteCarloPi(int samples, Func<double>? random = null) { random ??= Random.Shared.NextDouble; var inside = 0; for (var i = 0; i < samples; i++) { var x = random(); var y = random(); if (x * x + y * y <= 1) inside++; } return 4d * inside / samples; }
}
