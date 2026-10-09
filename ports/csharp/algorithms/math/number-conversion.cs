using System.Numerics;
namespace Algorithms.Mathematics;
public static partial class Numbers
{
    private const string Digits = "0123456789abcdefghijklmnopqrstuvwxyz";
    public static string ToBase(BigInteger value, int radix) { if (radix < 2 || radix > 36) throw new ArgumentOutOfRangeException(nameof(radix)); if (value == 0) return "0"; var negative = value < 0; var rest = BigInteger.Abs(value); var result = ""; while (rest > 0) { result = Digits[(int)(rest % radix)] + result; rest /= radix; } return negative ? "-" + result : result; }
    public static BigInteger FromBase(string input, int radix) { var negative = input.StartsWith('-'); BigInteger result = 0; foreach (var c in input[(negative ? 1 : 0)..].ToLowerInvariant()) { var digit = Digits.IndexOf(c); if (digit < 0 || digit >= radix) throw new ArgumentOutOfRangeException(nameof(input)); result = result * radix + digit; } return negative ? -result : result; }
    private static readonly (int, string)[] Roman = [(1000, "M"), (900, "CM"), (500, "D"), (400, "CD"), (100, "C"), (90, "XC"), (50, "L"), (40, "XL"), (10, "X"), (9, "IX"), (5, "V"), (4, "IV"), (1, "I")];
    public static string ToRoman(int value) { if (value < 1 || value > 3999) throw new ArgumentOutOfRangeException(nameof(value)); var result = ""; foreach (var (amount, symbol) in Roman) while (value >= amount) { result += symbol; value -= amount; } return result; }
    public static int FromRoman(string input) { int Value(char c) => c switch { 'I' => 1, 'V' => 5, 'X' => 10, 'L' => 50, 'C' => 100, 'D' => 500, 'M' => 1000, _ => 0 }; var result = 0; for (var i = 0; i < input.Length; i++) { var current = Value(input[i]); var next = i + 1 < input.Length ? Value(input[i + 1]) : 0; result += current < next ? -current : current; } return result; }
}
