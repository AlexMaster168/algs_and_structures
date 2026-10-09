using System.Globalization;
using System.Text.RegularExpressions;
namespace Patterns.Behavioral;

public interface IExpression { double Interpret(IReadOnlyDictionary<string, double> context); }
public sealed record NumberExpression(double Value) : IExpression { public double Interpret(IReadOnlyDictionary<string, double> context) => Value; }
public sealed record VariableExpression(string Name) : IExpression { public double Interpret(IReadOnlyDictionary<string, double> context) => context[Name]; }
public sealed record BinaryExpression(string Operator, IExpression Left, IExpression Right) : IExpression
{
    public double Interpret(IReadOnlyDictionary<string, double> context)
    {
        var a = Left.Interpret(context); var b = Right.Interpret(context);
        return Operator switch { "+" => a + b, "-" => a - b, "*" => a * b, "/" => a / b, _ => throw new FormatException("Unknown operator") };
    }
}
public static class Interpreter
{
    public static IExpression ParseExpression(string source)
    {
        var tokens = Regex.Matches(source, @"\d+(?:\.\d+)?|[A-Za-z_]\w*|[-+*/()]").Select(m => m.Value).ToArray();
        var position = 0;
        string? Peek() => position < tokens.Length ? tokens[position] : null;
        string Consume() => position < tokens.Length ? tokens[position++] : throw new FormatException("Unexpected end");
        IExpression Primary()
        {
            var token = Consume();
            if (token == "(") { var inner = Sum(); if (Consume() != ")") throw new FormatException("Expected )"); return inner; }
            if (double.TryParse(token, NumberStyles.Float, CultureInfo.InvariantCulture, out var value)) return new NumberExpression(value);
            if (char.IsLetter(token[0]) || token[0] == '_') return new VariableExpression(token);
            throw new FormatException("Unexpected token " + token);
        }
        IExpression Product() { var value = Primary(); while (Peek() is "*" or "/") value = new BinaryExpression(Consume(), value, Primary()); return value; }
        IExpression Sum() { var value = Product(); while (Peek() is "+" or "-") value = new BinaryExpression(Consume(), value, Product()); return value; }
        var result = Sum();
        if (position != tokens.Length) throw new FormatException("Unexpected token");
        return result;
    }
}
