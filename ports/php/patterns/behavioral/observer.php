<?php
declare(strict_types=1);
namespace Ports\Patterns\Behavioral;

class Subject {
    private array $observers = [];
    public function __get(string $name): mixed { return count($this->observers); }
    public function subscribe(\Closure $observer): \Closure { $key = spl_object_id($observer); $this->observers[$key] = $observer; return function() use ($key): void { unset($this->observers[$key]); }; }
    public function notify(mixed $value): void { foreach (array_values($this->observers) as $observer) $observer($value); }
}
class StockTicker {
    public readonly Subject $changes; private array $prices = [];
    public function __construct() { $this->changes = new Subject(); }
    public function update(string $symbol, int|float $price): void { $previous = $this->prices[$symbol] ?? $price; $this->prices[$symbol] = $price; $this->changes->notify(['symbol' => $symbol, 'price' => $price, 'change' => $price - $previous]); }
}
class BehaviorSubject extends Subject {
    public function __construct(private mixed $current) {}
    public function __get(string $name): mixed { return $name === 'value' ? $this->current : parent::__get($name); }
    public function subscribe(\Closure $observer): \Closure { $observer($this->current); return parent::subscribe($observer); }
    public function notify(mixed $value): void { $this->current = $value; parent::notify($value); }
}
