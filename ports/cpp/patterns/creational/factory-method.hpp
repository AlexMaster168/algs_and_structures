#pragma once
#include "../../support.hpp"
namespace algs {
struct Transport { virtual ~Transport() = default; virtual std::string kind() const = 0; virtual std::string deliver(const std::string& cargo) const = 0; };
struct Truck : Transport { std::string kind() const override { return "truck"; } std::string deliver(const std::string& cargo) const override { return "Truck delivers " + cargo + " by road"; } };
struct Ship : Transport { std::string kind() const override { return "ship"; } std::string deliver(const std::string& cargo) const override { return "Ship delivers " + cargo + " by sea"; } };
class Logistics { protected: virtual std::unique_ptr<Transport> createTransport() const = 0; public: virtual ~Logistics() = default; std::string planDelivery(const std::string& cargo) const { return createTransport()->deliver(cargo); } };
class RoadLogistics : public Logistics { protected: std::unique_ptr<Transport> createTransport() const override { return std::make_unique<Truck>(); } };
class SeaLogistics : public Logistics { protected: std::unique_ptr<Transport> createTransport() const override { return std::make_unique<Ship>(); } };
inline std::unique_ptr<Transport> createTransport(const std::string& kind) { if (kind == "truck") return std::make_unique<Truck>(); if (kind == "ship") return std::make_unique<Ship>(); throw std::invalid_argument("Unknown transport"); }
}
