#pragma once
#include "../../shared/json.hpp"
namespace algs {
struct HttpRequest { std::string method, url; std::map<std::string, std::string> headers; std::optional<std::string> body; double timeoutMs; };
class HttpRequestBuilder {
    std::string method = "GET", baseUrl; std::vector<std::pair<std::string, std::string>> query; std::map<std::string, std::string> headers; std::optional<std::string> body; double timeoutMs = 30000;
    static std::string encode(const std::string& text) { std::string result; const char* hex = "0123456789ABCDEF"; for (unsigned char c : text) { if ((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || (c >= '0' && c <= '9') || c == '*' || c == '-' || c == '.' || c == '_') result += char(c); else if (c == ' ') result += '+'; else { result += '%'; result += hex[c >> 4]; result += hex[c & 15]; } } return result; }
public:
    static HttpRequestBuilder get(std::string address) { HttpRequestBuilder builder; builder.url(std::move(address)); return builder; }
    static HttpRequestBuilder post(std::string address) { auto builder = get(std::move(address)); builder.withMethod("POST"); return builder; }
    HttpRequestBuilder& url(std::string address) { baseUrl = std::move(address); return *this; }
    HttpRequestBuilder& withMethod(std::string verb) { method = std::move(verb); return *this; }
    HttpRequestBuilder& header(std::string name, std::string value) { std::transform(name.begin(), name.end(), name.begin(), [](unsigned char c) { return char(std::tolower(c)); }); headers[std::move(name)] = std::move(value); return *this; }
    template<class T> HttpRequestBuilder& param(std::string name, const T& value) { query.push_back({std::move(name), text(value)}); return *this; }
    HttpRequestBuilder& json(const Json& payload) { body = payload.dump(); return header("content-type", "application/json"); }
    HttpRequestBuilder& timeout(double ms) { timeoutMs = ms; return *this; }
    HttpRequest build() const { if (baseUrl.empty()) throw std::logic_error("URL is required"); if (body && method == "GET") throw std::logic_error("GET request cannot have a body"); std::string address = baseUrl; for (std::size_t i = 0; i < query.size(); ++i) address += std::string(i ? "&" : "?") + encode(query[i].first) + '=' + encode(query[i].second); return {method, address, headers, body, timeoutMs}; }
};
}
