<?php
declare(strict_types=1);
namespace Ports\Shared;

class Promise {
    private string $state = 'pending';
    private mixed $value = null;
    private array $listeners = [];
    public static function resolved(mixed $value): self { $promise = new self(); $promise->resolve($value); return $promise; }
    public static function rejected(\Throwable $error): self { $promise = new self(); $promise->reject($error); return $promise; }
    public function resolve(mixed $value): void {
        if ($this->state !== 'pending') return;
        if ($value === $this) { $this->reject(new \LogicException('Promise cannot resolve itself')); return; }
        if ($value instanceof self) { $value->then($this->resolve(...), $this->reject(...)); return; }
        $this->state = 'fulfilled'; $this->value = $value; $this->flush();
    }
    public function reject(\Throwable $error): void { if ($this->state !== 'pending') return; $this->state = 'rejected'; $this->value = $error; $this->flush(); }
    private function flush(): void { $listeners = $this->listeners; $this->listeners = []; foreach ($listeners as $listener) $listener(); }
    public function then(?callable $success = null, ?callable $failure = null): self {
        $next = new self();
        $run = function() use ($next, $success, $failure): void {
            try { if ($this->state === 'fulfilled') $next->resolve($success ? $success($this->value) : $this->value); elseif ($failure) $next->resolve($failure($this->value)); else $next->reject($this->value); }
            catch (\Throwable $error) { $next->reject($error); }
        };
        if ($this->state === 'pending') $this->listeners[] = $run; else $run(); return $next;
    }
    public function await(): mixed {
        if ($this->state === 'pending') {
            $fiber = \Fiber::getCurrent(); if (!$fiber) throw new \LogicException('Await a pending promise inside a Fiber');
            $this->then(fn($value) => $fiber->resume(), fn($error) => $fiber->resume()); \Fiber::suspend();
        }
        if ($this->state === 'rejected') throw $this->value; return $this->value;
    }
}
