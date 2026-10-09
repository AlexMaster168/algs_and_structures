<?php
declare(strict_types=1);
namespace Ports\Patterns\Creational;

class ObjectPool {
    private array $available = [], $inUse = [];
    private \Closure $create, $reset;
    public function __construct(callable $create, ?callable $reset = null, private int|float $maxSize = INF) { $this->create = $create(...); $this->reset = ($reset ?? static function($item): void {})(...); }
    private function key(mixed $item): string { return is_object($item) ? 'object:' . spl_object_id($item) : get_debug_type($item) . ':' . serialize($item); }
    public function __get(string $name): int { return $name === 'availableCount' ? count($this->available) : count($this->inUse); }
    public function acquire(): mixed {
        if ($this->available) $item = array_pop($this->available); else { if (count($this->inUse) >= $this->maxSize) throw new \RuntimeException('Pool is exhausted'); $item = ($this->create)(); }
        $key = $this->key($item); if (array_key_exists($key, $this->inUse)) throw new \LogicException('Factory returned an item already in use'); $this->inUse[$key] = $item; return $item;
    }
    public function release(mixed $item): void { $key = $this->key($item); if (!array_key_exists($key, $this->inUse)) throw new \InvalidArgumentException('Item does not belong to this pool'); unset($this->inUse[$key]); ($this->reset)($item); $this->available[] = $item; }
    public function use(callable $work): mixed { $item = $this->acquire(); try { return $work($item); } finally { $this->release($item); } }
}
