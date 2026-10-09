using System.Globalization;
using System.Text.Json;
namespace Algorithms.DataStructures.Hashing;
public static class Hash
{
    public static uint Fnv1a(string input, uint seed = 0x811c9dc5) { var hash = seed; foreach (var c in input) hash = unchecked((hash ^ c) * 0x01000193); return hash; }
    public static uint DefaultHasher<T>(T key) { var type = key is null ? "object" : key is string or char ? "string" : key is bool ? "boolean" : key is byte or sbyte or short or ushort or int or uint or long or ulong or float or double or decimal ? "number" : "object"; var value = key is bool b ? b ? "true" : "false" : key is IFormattable f ? f.ToString(null, CultureInfo.InvariantCulture) : key?.ToString() ?? "null"; return Fnv1a($"{type}:{value}"); }
}
