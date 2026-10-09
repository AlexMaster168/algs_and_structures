<?php
declare(strict_types=1);

namespace Ports\DataStructures\Graphs;

use Ports\Shared\{Map,Set};
class Graph {
    private Map $adjacency;
    public function __construct(public readonly bool $directed = false) { $this->adjacency = new Map(); }
    public function __get(string $name): int { return $name === 'vertexCount' ? $this->adjacency->size : count($this->edges()); }
    public function addVertex(mixed $vertex): static { if (!$this->adjacency->has($vertex)) $this->adjacency->set($vertex,new Map()); return $this; }
    public function addEdge(mixed $from,mixed $to,int|float $weight = 1): static { $this->addVertex($from)->addVertex($to); $this->adjacency->get($from)->set($to,$weight); if (!$this->directed) $this->adjacency->get($to)->set($from,$weight); return $this; }
    public function removeEdge(mixed $from,mixed $to): bool { $removed = $this->adjacency->get($from)?->delete($to) ?? false; if ($removed && !$this->directed) $this->adjacency->get($to)->delete($from); return $removed; }
    public function removeVertex(mixed $vertex): bool { if (!$this->adjacency->delete($vertex)) return false; foreach ($this->adjacency->values() as $neighbors) $neighbors->delete($vertex); return true; }
    public function hasVertex(mixed $vertex): bool { return $this->adjacency->has($vertex); }
    public function hasEdge(mixed $from,mixed $to): bool { return $this->adjacency->get($from)?->has($to) ?? false; }
    public function weight(mixed $from,mixed $to): int|float|null { return $this->adjacency->get($from)?->get($to); }
    public function neighbors(mixed $vertex): array { return $this->adjacency->get($vertex)?->keys() ?? []; }
    public function degree(mixed $vertex): int { return $this->adjacency->get($vertex)?->size ?? 0; }
    public function vertices(): array { return $this->adjacency->keys(); }
    public function edges(): array { $result = []; $seen = new Set(); foreach ($this->adjacency as [$from,$neighbors]) { foreach ($neighbors as [$to,$weight]) if ($this->directed || !$seen->has($to)) $result[] = ['from'=>$from,'to'=>$to,'weight'=>$weight]; $seen->add($from); } return $result; }
    public function toAdjacencyMatrix(): array { $vertices = $this->vertices(); $index = new Map(); foreach ($vertices as $i => $vertex) $index->set($vertex,$i); $matrix = array_fill(0,count($vertices),array_fill(0,count($vertices),0)); foreach ($this->adjacency as [$from,$neighbors]) foreach ($neighbors as [$to,$weight]) $matrix[$index->get($from)][$index->get($to)] = $weight; return ['vertices'=>$vertices,'matrix'=>$matrix]; }
    public function toAdjacencyList(): array { $vertices = $this->vertices(); $index = new Map(); foreach ($vertices as $i => $vertex) $index->set($vertex,$i); $list = array_map(fn($vertex) => array_map(fn($neighbor) => $index->get($neighbor),$this->neighbors($vertex)),$vertices); return ['vertices'=>$vertices,'list'=>$list]; }
}
