<?php
declare(strict_types=1);

namespace Ports\Shared;

class Map implements \IteratorAggregate, \Countable, \ArrayAccess, \JsonSerializable {
    private array $items = [];
    public function __construct(iterable $entries = []) { foreach ($entries as [$key, $value]) $this->set($key, $value); }
    private function key(mixed $key): string { return is_object($key) ? 'o:'.spl_object_id($key) : (is_int($key) || is_float($key) ? 'n:'.(is_nan((float)$key) ? 'NaN' : (string)$key) : get_debug_type($key).':'.serialize($key)); }
    public function set(mixed $key, mixed $value): static { $this->items[$this->key($key)] = [$key, $value]; return $this; }
    public function get(mixed $key): mixed { return $this->items[$this->key($key)][1] ?? null; }
    public function has(mixed $key): bool { return array_key_exists($this->key($key), $this->items); }
    public function delete(mixed $key): bool { $k = $this->key($key); $found = isset($this->items[$k]); unset($this->items[$k]); return $found; }
    public function clear(): void { $this->items = []; }
    public function count(): int { return count($this->items); }
    public function __get(string $name): mixed { if ($name === 'size') return count($this->items); throw new \LogicException($name); }
    public function keys(): array { return array_column(array_values($this->items), 0); }
    public function values(): array { return array_column(array_values($this->items), 1); }
    public function entries(): array { return array_values($this->items); }
    public function getIterator(): \Traversable { yield from array_values($this->items); }
    public function offsetExists(mixed $offset): bool { return $this->has($offset); }
    public function offsetGet(mixed $offset): mixed { return $this->get($offset); }
    public function offsetSet(mixed $offset, mixed $value): void { $this->set($offset, $value); }
    public function offsetUnset(mixed $offset): void { $this->delete($offset); }
    public function jsonSerialize(): array { return $this->entries(); }
}
class Set implements \IteratorAggregate, \Countable, \JsonSerializable {
    private Map $map;
    public function __construct(iterable $values = []) { $this->map = new Map(); foreach ($values as $value) $this->add($value); }
    public function add(mixed $value): static { $this->map->set($value, true); return $this; }
    public function has(mixed $value): bool { return $this->map->has($value); }
    public function delete(mixed $value): bool { return $this->map->delete($value); }
    public function clear(): void { $this->map->clear(); }
    public function count(): int { return $this->map->count(); }
    public function __get(string $name): mixed { return $this->map->$name; }
    public function values(): array { return $this->map->keys(); }
    public function getIterator(): \Traversable { yield from $this->values(); }
    public function jsonSerialize(): array { return $this->values(); }
}
function field(mixed $record, string $name): mixed { return is_array($record) ? $record[$name] : $record->$name; }
function chars(string $text): array { return preg_split('//u', $text, -1, PREG_SPLIT_NO_EMPTY) ?: []; }
function units(string $text): array { $binary = iconv('UTF-8', 'UTF-16LE', $text); return $binary === '' ? [] : array_values(unpack('v*', $binary)); }
function fromUnits(array $units): string { return $units === [] ? '' : iconv('UTF-16LE', 'UTF-8', pack('v*', ...$units)); }
function imul(int $a, int $b): int { return (($a & 65535) * ($b & 65535) + ((($a >> 16) * ($b & 65535) + ($a & 65535) * ($b >> 16)) << 16)) & 0xffffffff; }
