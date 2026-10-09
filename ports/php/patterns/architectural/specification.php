<?php
declare(strict_types=1);
namespace Ports\Patterns\Architectural;

interface Specification { public function isSatisfiedBy(mixed $candidate): bool; public function and(Specification $other): Specification; public function or(Specification $other): Specification; public function not(): Specification; }
class Spec implements Specification {
    private \Closure $predicate;
    public function __construct(callable $predicate) { $this->predicate = $predicate(...); }
    public function isSatisfiedBy(mixed $candidate): bool { return ($this->predicate)($candidate); }
    public function and(Specification $other): Specification { return new self(fn($candidate) => $this->isSatisfiedBy($candidate) && $other->isSatisfiedBy($candidate)); }
    public function or(Specification $other): Specification { return new self(fn($candidate) => $this->isSatisfiedBy($candidate) || $other->isSatisfiedBy($candidate)); }
    public function not(): Specification { return new self(fn($candidate) => !$this->isSatisfiedBy($candidate)); }
}
function spec(callable $predicate): Specification { return new Spec($predicate); }
