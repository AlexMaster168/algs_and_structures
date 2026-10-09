<?php
declare(strict_types=1);
namespace Ports\Patterns\Architectural;
use Ports\Shared\Promise;

class CircuitOpenError extends \RuntimeException { public function __construct() { parent::__construct('Circuit is open'); } }
class CircuitBreaker {
    private int $failures = 0; private int|float $openedAt = 0; private string $current = 'closed'; private \Closure $action, $now;
    public function __construct(callable $action, private int $failureThreshold = 3, private int|float $resetTimeoutMs = 10000, ?callable $now = null) { $this->action = $action(...); $this->now = ($now ?? fn() => microtime(true) * 1000)(...); }
    public function __get(string $name): string { if ($this->current === 'open' && ($this->now)() - $this->openedAt >= $this->resetTimeoutMs) $this->current = 'half-open'; return $this->current; }
    public function call(mixed ...$args): Promise {
        if ($this->state === 'open') return Promise::rejected(new CircuitOpenError());
        try { $result = Promise::resolved(($this->action)(...$args)); } catch (\Throwable $error) { $result = Promise::rejected($error); }
        return $result->then(function($value) { $this->failures = 0; $this->current = 'closed'; return $value; }, function($error) {
            if (++$this->failures >= $this->failureThreshold || $this->current === 'half-open') { $this->current = 'open'; $this->openedAt = ($this->now)(); } throw $error;
        });
    }
}
function retry(callable $action, int $attempts = 3, int|float $delayMs = 0, int|float $factor = 2): Promise {
    if ($attempts < 1) return Promise::rejected(new \InvalidArgumentException('Attempts must be positive'));
    $run = function(int $attempt) use (&$run, $action, $attempts, $delayMs, $factor): Promise {
        try { $result = Promise::resolved($action()); } catch (\Throwable $error) { $result = Promise::rejected($error); }
        return $result->then(null, function($error) use (&$run, $attempt, $attempts, $delayMs, $factor) {
            if ($attempt + 1 >= $attempts) throw $error; if ($delayMs > 0) usleep((int)($delayMs * $factor ** $attempt * 1000)); return $run($attempt + 1);
        });
    };
    return $run(0);
}
