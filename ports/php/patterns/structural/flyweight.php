<?php
declare(strict_types=1);
namespace Ports\Patterns\Structural;

readonly class TreeType { public function __construct(public string $name, public string $color, public string $texture) {} public function draw(int|float $x, int|float $y): string { return "$this->name($this->color) at $x,$y"; } }
class TreeTypeFactory {
    private array $types = [];
    public function __get(string $name): int { return count($this->types); }
    public function get(string $name, string $color, string $texture): TreeType { $key = serialize([$name, $color, $texture]); return $this->types[$key] ??= new TreeType($name, $color, $texture); }
}
class Forest {
    private array $trees = [];
    public function __construct(private TreeTypeFactory $factory = new TreeTypeFactory()) {}
    public function __get(string $name): int { return $name === 'treeCount' ? count($this->trees) : $this->factory->count; }
    public function plant(int|float $x, int|float $y, string $name, string $color, string $texture): static { $this->trees[] = [$x, $y, $this->factory->get($name, $color, $texture)]; return $this; }
    public function draw(): array { return array_map(fn($tree) => $tree[2]->draw($tree[0], $tree[1]), $this->trees); }
}
