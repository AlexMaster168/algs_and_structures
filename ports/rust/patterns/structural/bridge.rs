use std::cell::RefCell;
use std::rc::Rc;
pub trait Device {
    fn name(&self) -> &str;
    fn is_enabled(&self) -> bool;
    fn enable(&mut self);
    fn disable(&mut self);
    fn get_volume(&self) -> f64;
    fn set_volume(&mut self, volume: f64);
}
struct BaseDevice {
    enabled: bool,
    volume: f64,
}
impl Default for BaseDevice {
    fn default() -> Self {
        Self {
            enabled: false,
            volume: 30.0,
        }
    }
}
#[derive(Default)]
pub struct Tv {
    base: BaseDevice,
}
#[derive(Default)]
pub struct Radio {
    base: BaseDevice,
}
macro_rules! device {
    ($type:ty,$name:literal) => {
        impl Device for $type {
            fn name(&self) -> &str {
                $name
            }
            fn is_enabled(&self) -> bool {
                self.base.enabled
            }
            fn enable(&mut self) {
                self.base.enabled = true;
            }
            fn disable(&mut self) {
                self.base.enabled = false;
            }
            fn get_volume(&self) -> f64 {
                self.base.volume
            }
            fn set_volume(&mut self, volume: f64) {
                self.base.volume = volume.clamp(0.0, 100.0);
            }
        }
    };
}
device!(Tv, "TV");
device!(Radio, "Radio");
pub struct RemoteControl {
    pub device: Rc<RefCell<dyn Device>>,
}
impl RemoteControl {
    pub fn new(device: Rc<RefCell<dyn Device>>) -> Self {
        Self { device }
    }
    pub fn toggle_power(&self) {
        let mut device = self.device.borrow_mut();
        if device.is_enabled() {
            device.disable();
        } else {
            device.enable();
        }
    }
    pub fn volume_up(&self, step: f64) {
        let mut device = self.device.borrow_mut();
        let volume = device.get_volume();
        device.set_volume(volume + step);
    }
    pub fn volume_down(&self, step: f64) {
        self.volume_up(-step);
    }
}
pub struct AdvancedRemoteControl {
    remote: RemoteControl,
}
impl AdvancedRemoteControl {
    pub fn new(device: Rc<RefCell<dyn Device>>) -> Self {
        Self {
            remote: RemoteControl::new(device),
        }
    }
    pub fn mute(&self) {
        self.remote.device.borrow_mut().set_volume(0.0);
    }
}
impl std::ops::Deref for AdvancedRemoteControl {
    type Target = RemoteControl;
    fn deref(&self) -> &Self::Target {
        &self.remote
    }
}
