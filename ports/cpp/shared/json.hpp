#pragma once
#include "../support.hpp"
#include <cmath>
#include <fstream>
namespace algs {
class Json {
public:
    using Array = std::vector<Json>;
    using Object = std::map<std::string, Json>;
    std::variant<std::nullptr_t, bool, double, std::string, Array, Object> value;
    Json(): value(nullptr) {} Json(std::nullptr_t): value(nullptr) {} Json(bool x): value(x) {} Json(double x): value(x) {} template<class T, std::enable_if_t<std::is_integral_v<T> && !std::is_same_v<T, bool>, int> = 0> Json(T x): value(double(x)) {} Json(const char* x): value(std::string(x)) {} Json(std::string x): value(std::move(x)) {} Json(Array x): value(std::move(x)) {} Json(Object x): value(std::move(x)) {}
    template<class T> Json(const std::vector<T>& items): value(Array{}) { auto& a = std::get<Array>(value); for (const auto& item : items) a.emplace_back(item); }
    template<class T> Json(const std::optional<T>& item): value(nullptr) { if (item) *this = Json(*item); }
    Json(const BigInt& x): value(x.str()) {}
    const Json& at(const std::string& key) const { return std::get<Object>(value).at(key); }
    const Json& at(std::size_t index) const { return std::get<Array>(value).at(index); }
    const Array& array() const { return std::get<Array>(value); }
    const std::string& string() const { return std::get<std::string>(value); }
    double number() const { return std::get<double>(value); }
    bool boolean() const { return std::get<bool>(value); }
    static std::string quote(const std::string& text) { std::string result = "\""; for (unsigned char c : text) { switch (c) { case '"': result += "\\\""; break; case '\\': result += "\\\\"; break; case '\n': result += "\\n"; break; case '\r': result += "\\r"; break; case '\t': result += "\\t"; break; default: if (c < 32) { const char* digits = "0123456789abcdef"; result += "\\u00"; result += digits[c >> 4]; result += digits[c & 15]; } else result += char(c); } } return result + '"'; }
    std::string dump() const { return std::visit([](const auto& item) -> std::string { using T = std::decay_t<decltype(item)>; if constexpr (std::is_same_v<T, std::nullptr_t>) return "null"; else if constexpr (std::is_same_v<T, bool>) return item ? "true" : "false"; else if constexpr (std::is_same_v<T, double>) { if (!std::isfinite(item)) return "null"; std::ostringstream out; out << std::setprecision(17) << item; return out.str(); } else if constexpr (std::is_same_v<T, std::string>) return quote(item); else { std::string result = std::is_same_v<T, Array> ? "[" : "{"; bool first = true; for (const auto& entry : item) { if (!first) result += ','; first = false; if constexpr (std::is_same_v<T, Array>) result += entry.dump(); else result += quote(entry.first) + ':' + entry.second.dump(); } return result + (std::is_same_v<T, Array> ? "]" : "}"); } }, value); }
    static Json parse(const std::string& text) {
        struct Parser {
            const std::string& text; std::size_t i = 0;
            void space() { while (i < text.size() && std::isspace(static_cast<unsigned char>(text[i]))) ++i; }
            char take() { if (i == text.size()) throw std::invalid_argument("Unexpected end of JSON"); return text[i++]; }
            bool consume(char c) { space(); if (i < text.size() && text[i] == c) { ++i; return true; } return false; }
            static void utf8(std::string& out, unsigned c) { if (c < 128) out += char(c); else if (c < 2048) { out += char(192 | c >> 6); out += char(128 | (c & 63)); } else if (c < 65536) { out += char(224 | c >> 12); out += char(128 | ((c >> 6) & 63)); out += char(128 | (c & 63)); } else { out += char(240 | c >> 18); out += char(128 | ((c >> 12) & 63)); out += char(128 | ((c >> 6) & 63)); out += char(128 | (c & 63)); } }
            unsigned hex() { unsigned code = 0; for (int n = 0; n < 4; ++n) { char c = take(); int d = c >= '0' && c <= '9' ? c - '0' : c >= 'a' && c <= 'f' ? c - 'a' + 10 : c >= 'A' && c <= 'F' ? c - 'A' + 10 : -1; if (d < 0) throw std::invalid_argument("Invalid JSON escape"); code = code * 16 + unsigned(d); } return code; }
            std::string string() { if (take() != '"') throw std::invalid_argument("Expected JSON string"); std::string out; while (true) { unsigned char c = take(); if (c == '"') return out; if (c < 32) throw std::invalid_argument("Invalid JSON character"); if (c != '\\') { out += char(c); continue; } switch (take()) { case '"': out += '"'; break; case '\\': out += '\\'; break; case '/': out += '/'; break; case 'b': out += '\b'; break; case 'f': out += '\f'; break; case 'n': out += '\n'; break; case 'r': out += '\r'; break; case 't': out += '\t'; break; case 'u': { auto code = hex(); if (code >= 0xd800 && code <= 0xdbff) { if (take() != '\\' || take() != 'u') throw std::invalid_argument("Invalid surrogate"); auto low = hex(); if (low < 0xdc00 || low > 0xdfff) throw std::invalid_argument("Invalid surrogate"); code = 0x10000 + ((code - 0xd800) << 10) + low - 0xdc00; } else if (code >= 0xdc00 && code <= 0xdfff) throw std::invalid_argument("Invalid surrogate"); utf8(out, code); break; } default: throw std::invalid_argument("Invalid JSON escape"); } } }
            Json read() { space(); if (i == text.size()) throw std::invalid_argument("Empty JSON"); char c = text[i]; if (c == '"') return string(); if (consume('[')) { Array array; if (consume(']')) return array; do { array.push_back(read()); } while (consume(',')); if (!consume(']')) throw std::invalid_argument("Expected ]"); return array; } if (consume('{')) { Object object; if (consume('}')) return object; do { space(); auto key = string(); if (!consume(':')) throw std::invalid_argument("Expected :"); object[key] = read(); } while (consume(',')); if (!consume('}')) throw std::invalid_argument("Expected }"); return object; } for (auto token : {"true", "false", "null"}) { auto n = std::char_traits<char>::length(token); if (text.compare(i, n, token) == 0) { i += n; if (token[0] == 'n') return nullptr; return token[0] == 't'; } } auto start = i; if (text[i] == '-') ++i; if (i == text.size() || !std::isdigit(static_cast<unsigned char>(text[i]))) throw std::invalid_argument("Invalid JSON number"); if (text[i] == '0') ++i; else while (i < text.size() && std::isdigit(static_cast<unsigned char>(text[i]))) ++i; if (i < text.size() && text[i] == '.') { ++i; auto digits = i; while (i < text.size() && std::isdigit(static_cast<unsigned char>(text[i]))) ++i; if (i == digits) throw std::invalid_argument("Invalid JSON fraction"); } if (i < text.size() && (text[i] == 'e' || text[i] == 'E')) { ++i; if (i < text.size() && (text[i] == '+' || text[i] == '-')) ++i; auto digits = i; while (i < text.size() && std::isdigit(static_cast<unsigned char>(text[i]))) ++i; if (i == digits) throw std::invalid_argument("Invalid JSON exponent"); } return std::stod(text.substr(start, i - start)); }
        } parser{text}; auto result = parser.read(); parser.space(); if (parser.i != text.size()) throw std::invalid_argument("Trailing JSON data"); return result;
    }
    bool operator==(const Json& other) const { if (value.index() != other.value.index()) return false; if (std::holds_alternative<double>(value)) { auto a = number(), b = other.number(); return std::abs(a - b) <= 1e-9 * std::max({1.0, std::abs(a), std::abs(b)}); } return value == other.value; }
};
}
