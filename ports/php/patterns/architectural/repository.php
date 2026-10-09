<?php
declare(strict_types=1);
namespace Ports\Patterns\Architectural;
use Ports\Shared\Promise;

interface Repository { public function findById(string $id): Promise; public function findAll(?Specification $specification = null): Promise; public function save(array|object $entity): Promise; public function delete(string $id): Promise; }
class InMemoryRepository implements Repository {
    private array $items = []; private \Closure $clone;
    public function __construct(?callable $clone = null) { $this->clone = ($clone ?? fn($item) => unserialize(serialize($item)))(...); }
    public function findById(string $id): Promise { return Promise::resolved(isset($this->items[$id]) ? ($this->clone)($this->items[$id]) : null); }
    public function findAll(?Specification $specification = null): Promise { $values = array_filter($this->items, fn($item) => !$specification || $specification->isSatisfiedBy($item)); return Promise::resolved(array_values(array_map($this->clone, $values))); }
    public function save(array|object $entity): Promise {
        try { $id = is_array($entity) ? $entity['id'] : $entity->id; $this->items[$id] = ($this->clone)($entity); return Promise::resolved(null); }
        catch (\Throwable $error) { return Promise::rejected($error); }
    }
    public function delete(string $id): Promise { $found = isset($this->items[$id]); unset($this->items[$id]); return Promise::resolved($found); }
}
