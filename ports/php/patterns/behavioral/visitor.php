<?php
declare(strict_types=1);
namespace Ports\Patterns\Behavioral;

interface ShapeVisitor { public function visitCircle(CircleShape $shape): mixed; public function visitRectangle(RectangleShape $shape): mixed; public function visitTriangle(TriangleShape $shape): mixed; }
interface VisitableShape { public function accept(ShapeVisitor $visitor): mixed; }
readonly class CircleShape implements VisitableShape { public function __construct(public int|float $radius) {} public function accept(ShapeVisitor $visitor): mixed { return $visitor->visitCircle($this); } }
readonly class RectangleShape implements VisitableShape { public function __construct(public int|float $width, public int|float $height) {} public function accept(ShapeVisitor $visitor): mixed { return $visitor->visitRectangle($this); } }
readonly class TriangleShape implements VisitableShape { public function __construct(public int|float $a, public int|float $b, public int|float $c) {} public function accept(ShapeVisitor $visitor): mixed { return $visitor->visitTriangle($this); } }
class AreaVisitor implements ShapeVisitor {
    public function visitCircle(CircleShape $shape): float { return M_PI * $shape->radius ** 2; }
    public function visitRectangle(RectangleShape $shape): int|float { return $shape->width * $shape->height; }
    public function visitTriangle(TriangleShape $shape): float { $s = ($shape->a + $shape->b + $shape->c) / 2; return sqrt($s * ($s - $shape->a) * ($s - $shape->b) * ($s - $shape->c)); }
}
class PerimeterVisitor implements ShapeVisitor {
    public function visitCircle(CircleShape $shape): float { return 2 * M_PI * $shape->radius; }
    public function visitRectangle(RectangleShape $shape): int|float { return 2 * ($shape->width + $shape->height); }
    public function visitTriangle(TriangleShape $shape): int|float { return $shape->a + $shape->b + $shape->c; }
}
class JsonExportVisitor implements ShapeVisitor {
    public function visitCircle(CircleShape $shape): string { return json_encode(['type' => 'circle', 'radius' => $shape->radius], JSON_THROW_ON_ERROR); }
    public function visitRectangle(RectangleShape $shape): string { return json_encode(['type' => 'rectangle', 'width' => $shape->width, 'height' => $shape->height], JSON_THROW_ON_ERROR); }
    public function visitTriangle(TriangleShape $shape): string { return json_encode(['type' => 'triangle', 'sides' => [$shape->a, $shape->b, $shape->c]], JSON_THROW_ON_ERROR); }
}
