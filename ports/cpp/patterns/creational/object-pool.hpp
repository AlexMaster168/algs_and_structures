#pragma once
#include "../../support.hpp"
namespace algs {
template<class T> class ObjectPool {
    std::vector<std::shared_ptr<T>> available; std::set<std::shared_ptr<T>> inUse; std::function<std::shared_ptr<T>()> create; std::function<void(T&)> reset; std::size_t maxSize;
public:
    ObjectPool(std::function<std::shared_ptr<T>()> create, std::function<void(T&)> reset = [](T&) {}, std::size_t maxSize = std::numeric_limits<std::size_t>::max()): create(std::move(create)), reset(std::move(reset)), maxSize(maxSize) {}
    std::size_t availableCount() const { return available.size(); } std::size_t inUseCount() const { return inUse.size(); }
    std::shared_ptr<T> acquire() { std::shared_ptr<T> item; if (!available.empty()) { item = available.back(); available.pop_back(); } else { if (inUse.size() >= maxSize) throw std::runtime_error("Pool is exhausted"); item = create(); if (!item || inUse.count(item)) throw std::logic_error("Factory must return a new object"); } inUse.insert(item); return item; }
    void release(const std::shared_ptr<T>& item) { if (!inUse.erase(item)) throw std::invalid_argument("Item does not belong to this pool"); reset(*item); available.push_back(item); }
    template<class Work> auto use(Work work) -> std::invoke_result_t<Work, T&> { auto item = acquire(); try { if constexpr (std::is_void_v<std::invoke_result_t<Work, T&>>) { work(*item); release(item); } else { auto result = work(*item); release(item); return result; } } catch (...) { if (inUse.count(item)) release(item); throw; } }
};
}
