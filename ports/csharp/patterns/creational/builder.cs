using System.Collections.ObjectModel;
using System.Globalization;
using System.Text.Json;
namespace Patterns.Creational;

public sealed record HttpRequest(string Method, string Url, IReadOnlyDictionary<string, string> Headers, string? Body, double TimeoutMs);
public sealed class HttpRequestBuilder
{
    private string method = "GET", baseUrl = "";
    private readonly List<KeyValuePair<string, string>> query = [];
    private readonly Dictionary<string, string> headers = [];
    private string? body;
    private double timeoutMs = 30000;
    public static HttpRequestBuilder Get(string url) => new HttpRequestBuilder().Url(url);
    public static HttpRequestBuilder Post(string url) => new HttpRequestBuilder().Url(url).WithMethod("POST");
    public HttpRequestBuilder Url(string value) { baseUrl = value; return this; }
    public HttpRequestBuilder WithMethod(string value) { method = value; return this; }
    public HttpRequestBuilder Header(string key, string value) { headers[key.ToLowerInvariant()] = value; return this; }
    public HttpRequestBuilder Param(string name, object value) { query.Add(new(name, Convert.ToString(value, CultureInfo.InvariantCulture) ?? "")); return this; }
    public HttpRequestBuilder Json<T>(T payload) { body = JsonSerializer.Serialize(payload); return Header("content-type", "application/json"); }
    public HttpRequestBuilder Timeout(double value) { timeoutMs = value; return this; }
    public HttpRequest Build()
    {
        if (baseUrl.Length == 0) throw new InvalidOperationException("URL is required");
        if (body is not null && method == "GET") throw new InvalidOperationException("GET request cannot have a body");
        string Encode(string value) => Uri.EscapeDataString(value).Replace("%20", "+");
        var suffix = string.Join("&", query.Select(p => $"{Encode(p.Key)}={Encode(p.Value)}"));
        return new(method, suffix.Length == 0 ? baseUrl : baseUrl + "?" + suffix, new ReadOnlyDictionary<string, string>(new Dictionary<string, string>(headers)), body, timeoutMs);
    }
}
