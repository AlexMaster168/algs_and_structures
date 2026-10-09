<?php
declare(strict_types=1);
namespace Ports\Patterns\Structural;
use Ports\Shared\Promise;

interface TemperatureSensor { public function celsius(): int|float; }
class LegacyFahrenheitSensor { public function __construct(private int|float $reading) {} public function readFahrenheit(): int|float { return $this->reading; } }
class FahrenheitSensorAdapter implements TemperatureSensor { public function __construct(private LegacyFahrenheitSensor $legacy) {} public function celsius(): float { return floor(($this->legacy->readFahrenheit() - 32) * 5 / 9 * 10 + 0.5) / 10; } }
function averageTemperature(array $sensors): float { return array_sum(array_map(fn($s) => $s->celsius(), $sensors)) / count($sensors); }
function promisify(callable $action): \Closure {
    return function(...$args) use ($action): Promise {
        $result = new Promise(); $args[] = function(?\Throwable $error, mixed $value = null) use ($result): void { if ($error) $result->reject($error); else $result->resolve($value); };
        try { $action(...$args); } catch (\Throwable $error) { $result->reject($error); } return $result;
    };
}
