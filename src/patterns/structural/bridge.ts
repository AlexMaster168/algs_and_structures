export interface Device {
  readonly name: string;
  isEnabled(): boolean;
  enable(): void;
  disable(): void;
  getVolume(): number;
  setVolume(volume: number): void;
}

abstract class BaseDevice implements Device {
  private enabled = false;
  private volume = 30;

  abstract readonly name: string;

  isEnabled(): boolean {
    return this.enabled;
  }

  enable(): void {
    this.enabled = true;
  }

  disable(): void {
    this.enabled = false;
  }

  getVolume(): number {
    return this.volume;
  }

  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(100, volume));
  }
}

export class Tv extends BaseDevice {
  readonly name = 'TV';
}

export class Radio extends BaseDevice {
  readonly name = 'Radio';
}

export class RemoteControl {
  constructor(protected readonly device: Device) {}

  togglePower(): void {
    if (this.device.isEnabled()) this.device.disable();
    else this.device.enable();
  }

  volumeUp(step = 10): void {
    this.device.setVolume(this.device.getVolume() + step);
  }

  volumeDown(step = 10): void {
    this.device.setVolume(this.device.getVolume() - step);
  }
}

export class AdvancedRemoteControl extends RemoteControl {
  mute(): void {
    this.device.setVolume(0);
  }
}
