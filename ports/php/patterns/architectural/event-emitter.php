<?php
declare(strict_types=1);
namespace Ports\Patterns\Architectural;

class TypedEventEmitter {
    private array $listeners = [];
    public function on(string $event, \Closure $listener): \Closure { $key = spl_object_id($listener); $this->listeners[$event][$key] = $listener; return function() use ($event, $listener): void { $this->off($event, $listener); }; }
    public function once(string $event, \Closure $listener): \Closure { $off = null; $off = $this->on($event, function($payload) use (&$off, $listener): void { $off(); $listener($payload); }); return $off; }
    public function off(string $event, \Closure $listener): void { unset($this->listeners[$event][spl_object_id($listener)]); }
    public function emit(string $event, mixed $payload): int { foreach (array_values($this->listeners[$event] ?? []) as $listener) $listener($payload); return $this->listenerCount($event); }
    public function listenerCount(string $event): int { return count($this->listeners[$event] ?? []); }
}
