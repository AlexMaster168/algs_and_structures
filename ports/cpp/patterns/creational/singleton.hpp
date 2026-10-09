#pragma once
#include "../../support.hpp"
namespace algs {
class AppConfig {
    std::map<std::string, std::string> values; AppConfig() = default;
public:
    AppConfig(const AppConfig&) = delete; AppConfig& operator=(const AppConfig&) = delete;
    static AppConfig& getInstance() { static AppConfig instance; return instance; }
    AppConfig& set(std::string key, std::string value) { values[std::move(key)] = std::move(value); return *this; }
    std::optional<std::string> get(const std::string& key, std::optional<std::string> fallback = {}) const { auto it = values.find(key); return it == values.end() ? fallback : std::optional(it->second); }
};
template<class T> std::function<T()> lazySingleton(std::function<T()> create) { struct State { std::once_flag once; std::optional<T> value; }; auto state = std::make_shared<State>(); return [state, create = std::move(create)]() { std::call_once(state->once, [&] { state->value = create(); }); return *state->value; }; }
}
