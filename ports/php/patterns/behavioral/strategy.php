<?php
declare(strict_types=1);
namespace Ports\Patterns\Behavioral;

interface ShippingStrategy { public function cost(array $parcel): int|float; }
class FlatRateShipping implements ShippingStrategy { public readonly string $name; public function __construct(private int|float $rate) { $this->name = 'flat'; } public function cost(array $parcel): int|float { return $this->rate; } }
class WeightBasedShipping implements ShippingStrategy { public readonly string $name; public function __construct(private int|float $pricePerKg) { $this->name = 'weight'; } public function cost(array $parcel): float { return ceil($parcel['weightKg']) * $this->pricePerKg; } }
class FreeOverThresholdShipping implements ShippingStrategy { public readonly string $name; public function __construct(private int|float $threshold, private ShippingStrategy $fallback) { $this->name = 'free-over-threshold'; } public function cost(array $parcel): int|float { return $parcel['orderTotal'] >= $this->threshold ? 0 : $this->fallback->cost($parcel); } }
class ShippingCalculator {
    public function __construct(private ShippingStrategy $strategy) {}
    public function setStrategy(ShippingStrategy $strategy): void { $this->strategy = $strategy; }
    public function calculate(array $parcel): int|float { return $this->strategy->cost($parcel); }
    public function cheapest(array $parcel, array $strategies): ShippingStrategy { if (!$strategies) throw new \InvalidArgumentException('No strategies'); $best = $strategies[0]; foreach (array_slice($strategies, 1) as $strategy) if ($strategy->cost($parcel) < $best->cost($parcel)) $best = $strategy; return $best; }
}
