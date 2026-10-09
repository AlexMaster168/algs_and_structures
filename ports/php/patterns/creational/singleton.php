<?php
declare(strict_types=1);
namespace Ports\Patterns\Creational;

class AppConfig {
    private static ?self $instance = null;
    private array $values = [];
    private function __construct() {}
    public static function getInstance(): self { return self::$instance ??= new self(); }
    public function set(string $key, string $value): static { $this->values[$key] = $value; return $this; }
    public function get(string $key, ?string $fallback = null): ?string { return $this->values[$key] ?? $fallback; }
}
function lazySingleton(callable $create): \Closure {
    $created = false; $instance = null;
    return function() use ($create, &$created, &$instance): mixed { if (!$created) { $instance = $create(); $created = true; } return $instance; };
}
