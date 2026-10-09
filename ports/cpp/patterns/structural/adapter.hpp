#pragma once
#include "../../support.hpp"
#include <cmath>
namespace algs {
struct TemperatureSensor { virtual ~TemperatureSensor() = default; virtual double celsius() const = 0; };
class LegacyFahrenheitSensor { double reading; public: explicit LegacyFahrenheitSensor(double reading): reading(reading) {} double readFahrenheit() const { return reading; } };
class FahrenheitSensorAdapter : public TemperatureSensor { LegacyFahrenheitSensor legacy; public: explicit FahrenheitSensorAdapter(LegacyFahrenheitSensor legacy): legacy(legacy) {} double celsius() const override { return std::floor((legacy.readFahrenheit() - 32) * 50 / 9 + 0.5) / 10; } };
inline double averageTemperature(const std::vector<std::reference_wrapper<const TemperatureSensor>>& sensors) { double total = 0; for (auto sensor : sensors) total += sensor.get().celsius(); return total / sensors.size(); }
template<class T, class... A, class Function> auto promisify(Function fn) { return [fn = std::move(fn)](A... args) { auto promise = std::make_shared<std::promise<T>>(); auto future = promise->get_future(); auto settled = std::make_shared<std::atomic<bool>>(false); auto finish = [promise, settled](std::exception_ptr error, T value) { if (settled->exchange(true)) return; if (error) promise->set_exception(error); else promise->set_value(std::move(value)); }; try { fn(args..., finish); } catch (...) { if (!settled->exchange(true)) promise->set_exception(std::current_exception()); } return future; }; }
}
