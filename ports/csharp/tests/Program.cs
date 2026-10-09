using System.Collections;
using System.Numerics;
using System.Reflection;
using System.Runtime.CompilerServices;
using System.Text.Json;
using Algorithms.DataStructures.Trees;
using Patterns.Architectural;
using Patterns.Behavioral;

static class Checks
{
    private static readonly JsonSerializerOptions Options = new() { PropertyNameCaseInsensitive = true };
    static object? ConvertValue(JsonElement value, Type type)
    {
        if (value.ValueKind == JsonValueKind.Null) return null;
        if (type == typeof(BigInteger)) return BigInteger.Parse(value.ToString());
        if (type == typeof(object)) return value.Clone();
        if (type.IsArray)
        {
            var element = type.GetElementType()!; var values = value.EnumerateArray().ToArray(); var result = Array.CreateInstance(element, values.Length);
            for (var i = 0; i < values.Length; i++) result.SetValue(ConvertValue(values[i], element), i);
            return result;
        }
        if (type.IsGenericType && type.GetGenericArguments().Length == 1 && typeof(IEnumerable).IsAssignableFrom(type))
        {
            var element = type.GetGenericArguments()[0]; var result = (IList)Activator.CreateInstance(typeof(List<>).MakeGenericType(element))!;
            foreach (var item in value.EnumerateArray()) result.Add(ConvertValue(item, element));
            return result;
        }
        return JsonSerializer.Deserialize(value.GetRawText(), type, Options);
    }
    static object? Normalize(object? value, MethodInfo? method = null)
    {
        if (value is null || value is string || value is bool) return value;
        if (value is BigInteger integer) return integer.ToString();
        if (value is ITuple tuple)
        {
            var names = method?.ReturnParameter.GetCustomAttribute<TupleElementNamesAttribute>()?.TransformNames;
            if (names is not null && names.Count >= tuple.Length && names.Take(tuple.Length).All(n => n is not null))
            {
                var result = new Dictionary<string, object?>(); for (var i = 0; i < tuple.Length; i++) result[char.ToLowerInvariant(names[i]![0]) + names[i]![1..]] = Normalize(tuple[i]); return result;
            }
            return Enumerable.Range(0, tuple.Length).Select(i => Normalize(tuple[i])).ToArray();
        }
        if (value is IDictionary dictionary)
        {
            var result = new List<object?[]>(); foreach (DictionaryEntry entry in dictionary) result.Add([Normalize(entry.Key), Normalize(entry.Value)]); return result;
        }
        if (value is IEnumerable sequence) return sequence.Cast<object?>().Select(item => Normalize(item)).ToArray();
        if (value.GetType().IsPrimitive || value is decimal) return value;
        return value.GetType().GetProperties().Where(p => p.GetIndexParameters().Length == 0).ToDictionary(p => char.ToLowerInvariant(p.Name[0]) + p.Name[1..], p => Normalize(p.GetValue(value)));
    }
    static bool Equal(JsonElement a, JsonElement b)
    {
        if (a.ValueKind == JsonValueKind.Number && b.ValueKind == JsonValueKind.Number) return Math.Abs(a.GetDouble() - b.GetDouble()) <= 1e-9 * Math.Max(1, Math.Abs(b.GetDouble()));
        if (a.ValueKind != b.ValueKind) return false;
        if (a.ValueKind == JsonValueKind.Array) return a.GetArrayLength() == b.GetArrayLength() && a.EnumerateArray().Zip(b.EnumerateArray()).All(pair => Equal(pair.First, pair.Second));
        if (a.ValueKind == JsonValueKind.Object) return a.EnumerateObject().Count() == b.EnumerateObject().Count() && a.EnumerateObject().All(p => b.TryGetProperty(p.Name, out var other) && Equal(p.Value, other));
        return a.ToString() == b.ToString();
    }
    static void Verify(bool value) { if (!value) throw new InvalidOperationException("Check failed"); }
    static async Task Main(string[] args)
    {
        var assembly = typeof(RedBlackTree<>).Assembly; var cases = JsonDocument.Parse(File.ReadAllText(args[0])).RootElement; var count = 0;
        foreach (var example in cases.EnumerateArray())
        {
            var originalName = example.GetProperty("name").GetString()!; var name = char.ToUpperInvariant(originalName[0]) + originalName[1..];
            var arguments = example.GetProperty("args").EnumerateArray().ToArray(); MethodInfo? selected = null; object?[]? values = null;
            foreach (var candidate in assembly.GetTypes().SelectMany(t => t.GetMethods(BindingFlags.Public | BindingFlags.Static)).Where(m => m.Name == name))
            {
                var method = candidate.IsGenericMethodDefinition ? candidate.MakeGenericMethod(Enumerable.Repeat(typeof(double), candidate.GetGenericArguments().Length).ToArray()) : candidate;
                var parameters = method.GetParameters(); if (parameters.Length < arguments.Length || parameters.Skip(arguments.Length).Any(p => !p.IsOptional)) continue;
                try { values = parameters.Select((p, i) => i < arguments.Length ? ConvertValue(arguments[i], p.ParameterType) : p.DefaultValue).ToArray(); selected = method; break; }
                catch (Exception error) when (error is JsonException or ArgumentException or NotSupportedException) { }
            }
            if (selected is null) throw new InvalidOperationException("Missing method " + originalName);
            var actual = JsonSerializer.SerializeToElement(Normalize(selected.Invoke(null, values), selected));
            if (!Equal(actual, example.GetProperty("expected"))) throw new InvalidOperationException(originalName + ": " + actual + " != " + example.GetProperty("expected"));
            count++;
        }
        var redBlack = new RedBlackTree<int>(); var avl = new AVLTree<int>(); var bTree = new BTree<int>(); var expected = new SortedSet<int>(); var random = new Random(168);
        for (var i = 0; i < 2000; i++)
        {
            var value = random.Next(300); if (random.NextDouble() < 0.55) { var changed = expected.Add(value); Verify(redBlack.Insert(value) == changed && avl.Insert(value) == changed && bTree.Insert(value) == changed); }
            else { var changed = expected.Remove(value); Verify(redBlack.Delete(value) == changed && avl.Delete(value) == changed && bTree.Delete(value) == changed); }
            Verify(redBlack.ToArray().SequenceEqual(expected) && avl.ToArray().SequenceEqual(expected) && bTree.ToArray().SequenceEqual(expected) && redBlack.IsValid());
        }
        var document = new TextDocument(); var history = new CommandHistory(); history.Run(new InsertCommand(document, 0, "abc")); Verify(history.Undo() && document.Content == ""); Verify(history.Redo() && document.Content == "abc");
        Verify(Interpreter.ParseExpression("2+x*3").Interpret(new Dictionary<string, double> { ["x"] = 4 }) == 14);
        var order = new Order(); order.Pay(); order.Ship(); order.Deliver(); Verify(order.Status == "delivered");
        Verify(new JsonSalesMiner().Mine("[{\"product\":\"apple\",\"amount\":3}]").Total == 3);
        var container = new Container(); var token = DependencyInjection.Token<object>("service"); container.Register(token, _ => new object()); Verify(ReferenceEquals(container.Resolve(token), container.Resolve(token)));
        var eventKey = new Event<int>("tick"); var events = new TypedEventEmitter(); var received = 0; events.Once(eventKey, value => received += value); Verify(events.Emit(eventKey, 4) == 0); events.Emit(eventKey, 4); Verify(received == 4);
        var attempts = 0; Verify(await Circuit.Retry(() => ++attempts < 3 ? Task.FromException<int>(new Exception()) : Task.FromResult(7)) == 7 && attempts == 3);
        Console.WriteLine($"C#: {count} reference cases, 2000 tree operations and pattern checks passed");
    }
}
