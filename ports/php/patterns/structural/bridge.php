<?php
declare(strict_types=1);
namespace Ports\Patterns\Structural;

interface Device { public function isEnabled(): bool; public function enable(): void; public function disable(): void; public function getVolume(): int|float; public function setVolume(int|float $value): void; }
abstract class BaseDevice implements Device {
    private bool $enabled = false;
    private int|float $volume = 30;
    public function isEnabled(): bool { return $this->enabled; }
    public function enable(): void { $this->enabled = true; }
    public function disable(): void { $this->enabled = false; }
    public function getVolume(): int|float { return $this->volume; }
    public function setVolume(int|float $value): void { $this->volume = max(0, min(100, $value)); }
}
class Tv extends BaseDevice { public readonly string $name; public function __construct() { $this->name = 'TV'; } }
class Radio extends BaseDevice { public readonly string $name; public function __construct() { $this->name = 'Radio'; } }
class RemoteControl {
    public function __construct(protected Device $device) {}
    public function togglePower(): void { if ($this->device->isEnabled()) $this->device->disable(); else $this->device->enable(); }
    public function volumeUp(int|float $step = 10): void { $this->device->setVolume($this->device->getVolume() + $step); }
    public function volumeDown(int|float $step = 10): void { $this->device->setVolume($this->device->getVolume() - $step); }
}
class AdvancedRemoteControl extends RemoteControl { public function mute(): void { $this->device->setVolume(0); } }
