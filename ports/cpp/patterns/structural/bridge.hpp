#pragma once
#include "../../support.hpp"
namespace algs {
struct Device { virtual ~Device() = default; virtual std::string name() const = 0; virtual bool isEnabled() const = 0; virtual void enable() = 0; virtual void disable() = 0; virtual double getVolume() const = 0; virtual void setVolume(double volume) = 0; };
class BaseDevice : public Device { bool enabled = false; double volume = 30; public: bool isEnabled() const override { return enabled; } void enable() override { enabled = true; } void disable() override { enabled = false; } double getVolume() const override { return volume; } void setVolume(double value) override { volume = std::clamp(value, 0.0, 100.0); } };
struct Tv : BaseDevice { std::string name() const override { return "TV"; } }; struct Radio : BaseDevice { std::string name() const override { return "Radio"; } };
class RemoteControl { protected: Device& device; public: explicit RemoteControl(Device& device): device(device) {} virtual ~RemoteControl() = default; void togglePower() { if (device.isEnabled()) device.disable(); else device.enable(); } void volumeUp(double step = 10) { device.setVolume(device.getVolume() + step); } void volumeDown(double step = 10) { device.setVolume(device.getVolume() - step); } };
class AdvancedRemoteControl : public RemoteControl { public: using RemoteControl::RemoteControl; void mute() { device.setVolume(0); } };
}
