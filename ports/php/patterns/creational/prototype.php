<?php
declare(strict_types=1);
namespace Ports\Patterns\Creational;

interface Prototype { public function clone(): static; }
abstract class Shape implements Prototype {
    public function __construct(public int|float $x, public int|float $y, public string $color, public array $tags = []) {}
    abstract public function area(): int|float;
    public function clone(): static { return clone $this; }
}
class Circle extends Shape {
    public function __construct(int|float $x, int|float $y, string $color, public int|float $radius, array $tags = []) { parent::__construct($x, $y, $color, $tags); }
    public function area(): float { return M_PI * $this->radius ** 2; }
}
class Rectangle extends Shape {
    public function __construct(int|float $x, int|float $y, string $color, public int|float $width, public int|float $height, array $tags = []) { parent::__construct($x, $y, $color, $tags); }
    public function area(): int|float { return $this->width * $this->height; }
}
class PrototypeRegistry {
    private array $prototypes = [];
    public function register(string $key, Prototype $prototype): static { $this->prototypes[$key] = $prototype; return $this; }
    public function create(string $key): Prototype { return ($this->prototypes[$key] ?? throw new \OutOfBoundsException("Unknown prototype $key"))->clone(); }
}
