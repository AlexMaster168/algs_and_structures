#pragma once
#include <algorithm>
#include <array>
#include <atomic>
#include <chrono>
#include <cmath>
#include <condition_variable>
#include <cstdint>
#include <deque>
#include <exception>
#include <functional>
#include <future>
#include <iomanip>
#include <limits>
#include <list>
#include <map>
#include <memory>
#include <mutex>
#include <numeric>
#include <optional>
#include <queue>
#include <random>
#include <set>
#include <sstream>
#include <stdexcept>
#include <string>
#include <thread>
#include <tuple>
#include <type_traits>
#include <unordered_map>
#include <unordered_set>
#include <utility>
#include <variant>
#include <vector>
#include "bigint.hpp"
namespace algs {
using Numbers = std::vector<double>;
using Matrix = std::vector<Numbers>;
inline constexpr double infinity = std::numeric_limits<double>::infinity();
inline double random() { thread_local std::mt19937 engine(std::random_device{}()); return std::generate_canonical<double,53>(engine); }
inline double nowMs() { return std::chrono::duration<double,std::milli>(std::chrono::system_clock::now().time_since_epoch()).count(); }
template<class T> std::future<T> readyFuture(T value) { std::promise<T> p; p.set_value(std::move(value)); return p.get_future(); }
template<class T> std::future<T> failedFuture(std::exception_ptr error) { std::promise<T> p; p.set_exception(error); return p.get_future(); }
template<class T> std::string text(const T& value) { std::ostringstream out; out << value; return out.str(); }
}
