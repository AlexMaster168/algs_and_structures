class _BaseDevice:
    def __init__(self):
        self.enabled, self.volume = False, 30

    def is_enabled(self):
        return self.enabled

    def enable(self):
        self.enabled = True

    def disable(self):
        self.enabled = False

    def get_volume(self):
        return self.volume

    def set_volume(self, volume):
        self.volume = max(0, min(100, volume))


class Tv(_BaseDevice):
    name = 'TV'


class Radio(_BaseDevice):
    name = 'Radio'


class RemoteControl:
    def __init__(self, device):
        self.device = device

    def toggle_power(self):
        self.device.disable() if self.device.is_enabled() else self.device.enable()

    def volume_up(self, step=10):
        self.device.set_volume(self.device.get_volume() + step)

    def volume_down(self, step=10):
        self.device.set_volume(self.device.get_volume() - step)


class AdvancedRemoteControl(RemoteControl):
    def mute(self):
        self.device.set_volume(0)
