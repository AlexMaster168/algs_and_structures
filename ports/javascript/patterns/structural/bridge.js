class BaseDevice {
    enabled = false;
    volume = 30;
    isEnabled() {
        return this.enabled;
    }
    enable() {
        this.enabled = true;
    }
    disable() {
        this.enabled = false;
    }
    getVolume() {
        return this.volume;
    }
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(100, volume));
    }
}
export class Tv extends BaseDevice {
    name = 'TV';
}
export class Radio extends BaseDevice {
    name = 'Radio';
}
export class RemoteControl {
    device;
    constructor(device) {
        this.device = device;
    }
    togglePower() {
        if (this.device.isEnabled())
            this.device.disable();
        else
            this.device.enable();
    }
    volumeUp(step = 10) {
        this.device.setVolume(this.device.getVolume() + step);
    }
    volumeDown(step = 10) {
        this.device.setVolume(this.device.getVolume() - step);
    }
}
export class AdvancedRemoteControl extends RemoteControl {
    mute() {
        this.device.setVolume(0);
    }
}
