<?php
declare(strict_types=1);
namespace Ports\Patterns\Architectural;

class StateStore {
    private array $listeners = []; private bool $dispatching = false; private \Closure $reducer;
    public function __construct(callable $reducer, private mixed $state) { $this->reducer = $reducer(...); }
    public function getState(): mixed { return $this->state; }
    public function dispatch(array $action): array {
        if ($this->dispatching) throw new \LogicException('Reducers may not dispatch actions'); $this->dispatching = true;
        try { $this->state = ($this->reducer)($this->state, $action); } finally { $this->dispatching = false; }
        foreach (array_values($this->listeners) as $listener) $listener(); return $action;
    }
    public function subscribe(\Closure $listener): \Closure { $key = spl_object_id($listener); $this->listeners[$key] = $listener; return function() use ($key): void { unset($this->listeners[$key]); }; }
}
function createStore(callable $reducer, mixed $initialState): StateStore { return new StateStore($reducer, $initialState); }
function combineReducers(array $reducers): \Closure {
    return function(array $state, array $action) use ($reducers): array { $changed = false; $next = []; foreach ($reducers as $key => $reducer) { $next[$key] = $reducer($state[$key], $action); $changed = $changed || $next[$key] !== $state[$key]; } return $changed ? $next : $state; };
}
function counterReducer(int|float $state, array $action): int|float { return match($action['type']) { 'increment' => $state + 1, 'decrement' => $state - 1, 'add' => $state + $action['amount'], default => throw new \InvalidArgumentException('Unknown action') }; }
