using System.Globalization;
using System.Text.Json;
namespace Patterns.Behavioral;

public sealed record SalesRecord(string Product, double Amount);
public sealed record SalesReport(double Total, string? TopProduct, int Records);
public abstract class SalesDataMiner
{
    public SalesReport Mine(string raw) => Report(Parse(raw).Where(IsValid).ToArray());
    protected abstract SalesRecord[] Parse(string raw);
    protected virtual bool IsValid(SalesRecord record) => record.Product.Length > 0 && double.IsFinite(record.Amount) && record.Amount >= 0;
    protected virtual SalesReport Report(SalesRecord[] records)
    {
        var totals = new Dictionary<string, double>();
        foreach (var record in records) totals[record.Product] = totals.GetValueOrDefault(record.Product) + record.Amount;
        string? best = null;
        foreach (var (product, amount) in totals) if (best is null || amount > totals[best]) best = product;
        return new(records.Sum(r => r.Amount), best, records.Length);
    }
}
public sealed class CsvSalesMiner : SalesDataMiner
{
    protected override SalesRecord[] Parse(string raw) => raw.Trim().Split('\n').Skip(1).Select(line =>
    {
        var fields = line.Split(','); var amount = fields.Length > 1 ? fields[1].Trim() : "";
        var value = amount.Length == 0 ? 0 : double.TryParse(amount, NumberStyles.Float, CultureInfo.InvariantCulture, out var parsed) ? parsed : double.NaN;
        return new SalesRecord(fields[0].Trim(), value);
    }).ToArray();
}
public sealed class JsonSalesMiner : SalesDataMiner
{
    protected override SalesRecord[] Parse(string raw) => JsonSerializer.Deserialize<SalesRecord[]>(raw, new JsonSerializerOptions { PropertyNameCaseInsensitive = true }) ?? [];
}
