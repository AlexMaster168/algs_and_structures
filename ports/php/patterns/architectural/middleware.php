<?php
declare(strict_types=1);
namespace Ports\Patterns\Architectural;
use Ports\Shared\Promise;

function compose(array $middlewares): \Closure {
    return function(mixed $context) use ($middlewares): Promise {
        $lastIndex = -1;
        $dispatch = function(int $index) use (&$dispatch, &$lastIndex, $middlewares, $context): Promise {
            if ($index <= $lastIndex) return Promise::rejected(new \LogicException('next() called multiple times')); $lastIndex = $index;
            if (!isset($middlewares[$index])) return Promise::resolved(null);
            try { return Promise::resolved($middlewares[$index]($context, fn() => $dispatch($index + 1))); }
            catch (\Throwable $error) { return Promise::rejected($error); }
        };
        return $dispatch(0);
    };
}
class Pipeline {
    private array $middlewares = [];
    public function use(callable $middleware): static { $this->middlewares[] = $middleware; return $this; }
    public function run(mixed $context): Promise { return compose($this->middlewares)($context); }
}
