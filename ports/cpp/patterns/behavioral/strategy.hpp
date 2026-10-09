#pragma once
#include "../../support.hpp"
#include <cmath>
namespace algs {
struct Parcel { double weightKg, orderTotal; };
struct ShippingStrategy { virtual ~ShippingStrategy() = default; virtual std::string name() const = 0; virtual double cost(Parcel parcel) const = 0; };
class FlatRateShipping : public ShippingStrategy { double rate; public: explicit FlatRateShipping(double rate): rate(rate) {} std::string name() const override { return "flat"; } double cost(Parcel) const override { return rate; } };
class WeightBasedShipping : public ShippingStrategy { double pricePerKg; public: explicit WeightBasedShipping(double pricePerKg): pricePerKg(pricePerKg) {} std::string name() const override { return "weight"; } double cost(Parcel parcel) const override { return std::ceil(parcel.weightKg) * pricePerKg; } };
class FreeOverThresholdShipping : public ShippingStrategy { double threshold; std::shared_ptr<ShippingStrategy> fallback; public: FreeOverThresholdShipping(double threshold, std::shared_ptr<ShippingStrategy> fallback): threshold(threshold), fallback(std::move(fallback)) {} std::string name() const override { return "free-over-threshold"; } double cost(Parcel parcel) const override { return parcel.orderTotal >= threshold ? 0 : fallback->cost(parcel); } };
class ShippingCalculator { std::shared_ptr<ShippingStrategy> strategy; public: explicit ShippingCalculator(std::shared_ptr<ShippingStrategy> strategy): strategy(std::move(strategy)) {} void setStrategy(std::shared_ptr<ShippingStrategy> value) { strategy = std::move(value); } double calculate(Parcel parcel) const { return strategy->cost(parcel); } std::shared_ptr<ShippingStrategy> cheapest(Parcel parcel, const std::vector<std::shared_ptr<ShippingStrategy>>& strategies) const { if (strategies.empty()) throw std::invalid_argument("No strategies"); return *std::min_element(strategies.begin(), strategies.end(), [&](auto& a, auto& b) { return a->cost(parcel) < b->cost(parcel); }); } };
}
