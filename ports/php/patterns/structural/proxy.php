<?php
declare(strict_types=1);
namespace Ports\Patterns\Structural;
use Ports\Shared\Promise;

interface WeatherService { public function temperature(string $city): Promise; }
class CachingWeatherProxy implements WeatherService {
    private array $cache = []; private \Closure $now;
    public function __construct(private WeatherService $service, private int|float $ttlMs = 60000, ?callable $now = null) { $this->now = ($now ?? fn() => microtime(true) * 1000)(...); }
    public function temperature(string $city): Promise {
        $cached = $this->cache[$city] ?? null; if ($cached && $cached['expiresAt'] > ($this->now)()) return Promise::resolved($cached['value']);
        return $this->service->temperature($city)->then(function($value) use ($city) { $this->cache[$city] = ['value' => $value, 'expiresAt' => ($this->now)() + $this->ttlMs]; return $value; });
    }
}
class AccessControlProxy implements WeatherService {
    private \Closure $isAllowed;
    public function __construct(private WeatherService $service, callable $isAllowed) { $this->isAllowed = $isAllowed(...); }
    public function temperature(string $city): Promise { return ($this->isAllowed)() ? $this->service->temperature($city) : Promise::rejected(new \RuntimeException('Access denied')); }
}
class ValidatedObject {
    private \Closure $validate;
    public function __construct(private object $target, callable $validate) { $this->validate = $validate(...); }
    public function __get(string $key): mixed { return $this->target->$key; }
    public function __set(string $key, mixed $value): void { if (!($this->validate)($key, $value)) throw new \TypeError("Invalid value for $key"); $this->target->$key = $value; }
}
function createValidatedObject(object $target, callable $validate): ValidatedObject { return new ValidatedObject($target, $validate); }
