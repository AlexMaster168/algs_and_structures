<?php
declare(strict_types=1);

namespace Ports\Algorithms\DynamicProgramming;

use Ports\Shared\Map;
class Memoized {
    public readonly Map $cache;
    private \Closure $fn;
    private \Closure $resolveKey;
    public function __construct(callable $fn, ?callable $resolveKey = null) { $this->cache = new Map(); $this->fn = $fn(...); $this->resolveKey = $resolveKey !== null ? $resolveKey(...) : fn(...$args) => count($args) === 1 ? $args[0] : json_encode($args, JSON_THROW_ON_ERROR); }
    public function __invoke(mixed ...$args): mixed { $key = ($this->resolveKey)(...$args); if ($this->cache->has($key)) return $this->cache->get($key); $result = ($this->fn)(...$args); $this->cache->set($key,$result); return $result; }
}
function memoize(callable $fn, ?callable $resolveKey = null): Memoized { return new Memoized($fn,$resolveKey); }
